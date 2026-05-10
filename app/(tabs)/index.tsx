import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useProfile } from '@/context/ProfileContext';

const LEADERBOARD = [
  { rank: 1, name: 'DragonFist_Pro', fightIQ: 1420, spar: 890 },
  { rank: 2, name: 'IronGlove_K', fightIQ: 1310, spar: 820 },
  { rank: 3, name: 'ShadowKicker99', fightIQ: 1280, spar: 760 },
  { rank: 4, name: 'ThaiBoxer_X', fightIQ: 1150, spar: 710 },
  { rank: 5, name: 'NightHawk', fightIQ: 1090, spar: 650 },
  { rank: 6, name: 'RoninStrike', fightIQ: 980, spar: 590 },
  { rank: 7, name: 'BlitzKing77', fightIQ: 920, spar: 540 },
  { rank: 8, name: 'JabMachine', fightIQ: 860, spar: 490 },
  { rank: 9, name: 'ViperKick', fightIQ: 790, spar: 420 },
  { rank: 10, name: 'WildCard_88', fightIQ: 720, spar: 380 },
];

const STRIKES = [
  { label: 'Jab', current: 1, max: 15 },
  { label: 'Cross', current: 1, max: 15 },
  { label: 'Hook', current: 1, max: 15 },
  { label: 'Uppercut', current: 1, max: 15 },
  { label: 'Teep', current: 1, max: 15 },
  { label: 'Low Kick', current: 1, max: 15 },
  { label: 'Body Kick', current: 1, max: 15 },
];

const MEDAL_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <View
      style={[
        styles.badge,
        isTop3 ? { backgroundColor: MEDAL_COLORS[rank] } : styles.badgePlain,
      ]}
    >
      <Text style={[styles.badgeText, !isTop3 && { color: '#555' }]}>{rank}</Text>
    </View>
  );
}

function StatBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min(current / max, 1) * 100;
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${pct}%` as `${number}%` }]} />
    </View>
  );
}

export default function HomeScreen() {
  const { profile } = useProfile();
  const displayName = profile?.name?.trim() ?? '';
  const welcomeName = displayName ? displayName.toUpperCase() : 'UNKNOWN FIGHTER';

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.appLabel}>ROUND ONE</Text>
        <Text style={styles.welcomeGreet}>WELCOME,</Text>
        <Text style={styles.fighterName}>{welcomeName}</Text>
        {profile?.style ? (
          <View style={styles.styleBadge}>
            <Text style={styles.styleBadgeText}>{profile.style.toUpperCase()}</Text>
          </View>
        ) : null}
        <View style={styles.headerDivider} />
      </View>

      {/* ── Recent Workouts ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>/ RECENT WORKOUTS</Text>
        <View style={styles.card}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Text style={styles.emptyIconText}>0</Text>
              <Text style={styles.emptyIconSub}>SESSIONS</Text>
            </View>
            <Text style={styles.emptyTitle}>No workouts logged yet</Text>
            <Text style={styles.emptySubtitle}>
              Head to the Train tab to generate and log your first session.
            </Text>
          </View>
        </View>
      </View>

      {/* ── Leaderboard ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>/ LEADERBOARD</Text>
        <View style={styles.card}>

          {/* Column headers */}
          <View style={styles.lbHeaderRow}>
            <View style={styles.badgeSpacer} />
            <Text style={[styles.lbColHead, { flex: 1 }]}>FIGHTER</Text>
            <Text style={[styles.lbColHead, styles.lbColRight]}>IQ</Text>
            <Text style={[styles.lbColHead, styles.lbColRight]}>SPAR</Text>
          </View>

          {LEADERBOARD.map((entry, i) => (
            <View
              key={entry.rank}
              style={[styles.lbRow, i === LEADERBOARD.length - 1 && styles.lbRowLast]}
            >
              <RankBadge rank={entry.rank} />
              <Text style={[styles.lbName, { flex: 1 }]} numberOfLines={1}>
                {entry.name}
              </Text>
              <Text style={styles.lbScore}>{entry.fightIQ}</Text>
              <Text style={styles.lbScore}>{entry.spar}</Text>
            </View>
          ))}

          {/* User row */}
          <View style={styles.lbUserRow}>
            <View style={[styles.badge, styles.userBadge]}>
              <Text style={[styles.badgeText, { color: '#ff3b30' }]}>11</Text>
            </View>
            <Text style={[styles.lbName, styles.lbUserName, { flex: 1 }]} numberOfLines={1}>
              {displayName || 'YOU'}
            </Text>
            <Text style={[styles.lbScore, { color: '#ff3b30' }]}>50</Text>
            <Text style={[styles.lbScore, { color: '#ff3b30' }]}>0</Text>
          </View>
        </View>
      </View>

      {/* ── Strike Log ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>/ STRIKE LOG</Text>
        <View style={styles.card}>
          {STRIKES.map((s, i) => (
            <View
              key={s.label}
              style={[styles.strikeRow, i === STRIKES.length - 1 && styles.strikeRowLast]}
            >
              <Text style={styles.strikeLabel}>{s.label}</Text>
              <StatBar current={s.current} max={s.max} />
              <Text style={styles.strikeCount}>
                {s.current}
                <Text style={styles.strikeMax}>/{s.max}</Text>
              </Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 50,
  },

  /* Header */
  header: {
    marginTop: 40,
    marginBottom: 28,
  },
  appLabel: {
    color: '#ff3b30',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
  },
  welcomeGreet: {
    color: '#444',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  fighterName: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 42,
  },
  headerDivider: {
    height: 2,
    backgroundColor: '#ff3b30',
    width: 40,
    marginTop: 16,
    borderRadius: 2,
  },

  /* Sections */
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    color: '#ff3b30',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },

  /* Card */
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1c1c1c',
    overflow: 'hidden',
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    color: '#333',
    fontSize: 20,
    fontWeight: '900',
  },
  emptyIconSub: {
    color: '#333',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1,
  },
  emptyTitle: {
    color: '#555',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },

  /* Leaderboard */
  lbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  badgeSpacer: {
    width: 30,
    marginRight: 10,
  },
  lbColHead: {
    color: '#444',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  lbColRight: {
    width: 46,
    textAlign: 'right',
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  lbRowLast: {
    borderBottomWidth: 0,
  },
  lbUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#160404',
    borderTopWidth: 1,
    borderTopColor: '#2a0a0a',
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgePlain: {
    backgroundColor: '#1a1a1a',
  },
  userBadge: {
    backgroundColor: '#1a0000',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  badgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  lbName: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
  },
  lbUserName: {
    color: '#ff3b30',
    fontWeight: '700',
  },
  lbScore: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
    width: 46,
    textAlign: 'right',
  },

  /* Strike Log */
  strikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
    gap: 12,
  },
  strikeRowLast: {
    borderBottomWidth: 0,
  },
  strikeLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    width: 68,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#1e1e1e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ff3b30',
    borderRadius: 2,
  },
  strikeCount: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    width: 38,
    textAlign: 'right',
  },
  strikeMax: {
    color: '#444',
    fontWeight: '600',
  },

  styleBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#1a0000',
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  styleBadgeText: {
    color: '#ff3b30',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
