import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 340;
const CARD_GAP = 16;
const SNAP_INTERVAL = CARD_HEIGHT + CARD_GAP;

type Tab = 'moves' | 'styles' | 'quiz';

const MOVES = [
  { id: '1', name: 'Jab', type: 'Punch', description: 'A quick, straight punch with your lead hand to gauge distance.' },
  { id: '2', name: 'Cross', type: 'Punch', description: 'A powerful straight punch with your rear hand, generating full body rotation.' },
  { id: '3', name: 'Hook', type: 'Punch', description: 'A lateral punch with a bent elbow targeting the head or body.' },
  { id: '4', name: 'Uppercut', type: 'Punch', description: 'An upward punch targeting the chin from close range.' },
  { id: '5', name: 'Teep', type: 'Kick', description: 'A front push kick that controls distance and disrupts balance.' },
  { id: '6', name: 'Low Kick', type: 'Kick', description: "A kick targeting the opponent's thigh to slow them down." },
  { id: '7', name: 'Body Kick', type: 'Kick', description: 'A powerful roundhouse kick aimed at the ribs or midsection.' },
];

const FIGHTING_STYLES = [
  { name: 'Out-Fighter', description: 'Fights from range using jabs and footwork to control distance and avoid brawls.' },
  { name: 'Pressure Fighter', description: 'Constantly pushes forward, cutting off the ring and overwhelming opponents with volume.' },
  { name: 'Counter Striker', description: 'Waits for opponent mistakes then capitalizes with precise, powerful counters.' },
  { name: 'Kicker', description: 'Relies heavily on kicks to score and damage from mid-range, keeping punchers at bay.' },
];

const TAB_LABELS: Record<Tab, string> = {
  moves: 'Kicks & Punches',
  styles: 'Fighting Styles',
  quiz: 'Fight IQ Quiz',
};

// Module-level flag: survives tab switches and remounts within the same JS session
let introHasPlayed = false;

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('moves');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(!introHasPlayed);
  const [carouselHeight, setCarouselHeight] = useState(500);

  const scrollY = useRef(new Animated.Value(0)).current;
  const introOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.4)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (introHasPlayed || !showIntro) return;
    introHasPlayed = true;

    // Fade in overlay + spring the title text
    Animated.parallel([
      Animated.timing(introOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(textScale, { toValue: 1, tension: 45, friction: 8, useNativeDriver: true }),
    ]).start();

    // Looping pulse for each ring, staggered
    const makeRing = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );

    const r1 = makeRing(ring1, 0);
    const r2 = makeRing(ring2, 500);
    const r3 = makeRing(ring3, 1000);
    r1.start();
    r2.start();
    r3.start();

    // Dismiss after 2.5 s
    const timer = setTimeout(() => {
      r1.stop();
      r2.stop();
      r3.stop();
      Animated.timing(introOpacity, { toValue: 0, duration: 550, useNativeDriver: true }).start(() =>
        setShowIntro(false)
      );
    }, 2500);

    return () => {
      clearTimeout(timer);
      r1.stop();
      r2.stop();
      r3.stop();
    };
  }, []);

  const carouselPaddingV = Math.max(16, (carouselHeight - CARD_HEIGHT) / 2);

  const ringTransform = (anim: Animated.Value) => ({
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.2] }) }],
    opacity: anim.interpolate({ inputRange: [0, 0.12, 0.75, 1], outputRange: [0, 0.65, 0.2, 0] }),
  });

  return (
    <View style={styles.page}>
      <Text style={styles.pageTitle}>Learn</Text>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['moves', 'styles', 'quiz'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              numberOfLines={1}
            >
              {TAB_LABELS[tab]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Kicks & Punches — vertical snap carousel */}
      {activeTab === 'moves' && (
        <View
          style={styles.carouselContainer}
          onLayout={(e) => setCarouselHeight(e.nativeEvent.layout.height)}
        >
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingVertical: carouselPaddingV, alignItems: 'center' }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.y / SNAP_INTERVAL);
              setActiveIndex(Math.max(0, Math.min(index, MOVES.length - 1)));
            }}
          >
            {MOVES.map((move, index) => {
              const inputRange = [
                (index - 1) * SNAP_INTERVAL,
                index * SNAP_INTERVAL,
                (index + 1) * SNAP_INTERVAL,
              ];
              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [0.85, 1, 0.85],
                extrapolate: 'clamp',
              });
              const opacity = scrollY.interpolate({
                inputRange,
                outputRange: [0.45, 1, 0.45],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={move.id}
                  style={[
                    styles.moveCard,
                    { transform: [{ scale }], opacity },
                    index < MOVES.length - 1 && { marginBottom: CARD_GAP },
                  ]}
                >
                  <View style={styles.animArea}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{move.type.toUpperCase()}</Text>
                    </View>
                    <View style={styles.animFrame}>
                      <Text style={styles.animFrameLabel}>Animation</Text>
                      <Text style={styles.animFrameSub}>placeholder</Text>
                    </View>
                  </View>
                  <View style={styles.moveInfo}>
                    <Text style={styles.moveName}>{move.name}</Text>
                    <Text style={styles.moveDesc}>{move.description}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.ScrollView>

          {/* Vertical position dots on the right */}
          <View style={styles.dotsColumn}>
            {MOVES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Fighting Styles */}
      {activeTab === 'styles' && (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {FIGHTING_STYLES.map((style) => (
            <View key={style.name} style={styles.styleCard}>
              <Text style={styles.styleCardTitle}>{style.name}</Text>
              <Text style={styles.styleCardDesc}>{style.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Fight IQ Quiz */}
      {activeTab === 'quiz' && (
        <View style={styles.quizCenter}>
          <View style={styles.quizIconBox}>
            <Text style={styles.quizIconText}>?</Text>
          </View>
          <Text style={styles.quizTitle}>Fight IQ Quiz</Text>
          <Text style={styles.quizSub}>Scenario-based questions coming soon.</Text>
        </View>
      )}

      {/* Intro overlay — rendered last so it sits on top */}
      {showIntro && (
        <Animated.View style={[styles.introOverlay, { opacity: introOpacity }]}>
          {/* Pulsing rings centered via zero-size anchor */}
          <View style={styles.ringsAnchor}>
            <View style={{ width: 0, height: 0 }}>
              {[ring1, ring2, ring3].map((anim, i) => (
                <Animated.View key={i} style={[styles.ring, ringTransform(anim)]} />
              ))}
            </View>
          </View>

          {/* Title */}
          <Animated.Text style={[styles.introTitle, { transform: [{ scale: textScale }] }]}>
            LEARN
          </Animated.Text>
          <Text style={styles.introSub}>Your fight education starts here</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101010',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
    paddingHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#ff3b30',
  },
  tabText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#fff',
  },
  // Vertical carousel
  carouselContainer: {
    flex: 1,
  },
  moveCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#252525',
  },
  animArea: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  typeBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  animFrame: {
    width: 110,
    height: 110,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animFrameLabel: {
    color: '#3a3a3a',
    fontSize: 13,
    fontWeight: '600',
  },
  animFrameSub: {
    color: '#2a2a2a',
    fontSize: 11,
  },
  moveInfo: {
    padding: 16,
    paddingBottom: 12,
  },
  moveName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  moveDesc: {
    color: '#777',
    fontSize: 13,
    lineHeight: 18,
  },
  // Side dots (vertical)
  dotsColumn: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    borderRadius: 3,
  },
  dotActive: {
    height: 20,
    backgroundColor: '#ff3b30',
  },
  dotInactive: {
    height: 6,
    backgroundColor: '#333',
  },
  // Fighting styles
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  styleCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#252525',
  },
  styleCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  styleCardDesc: {
    color: '#777',
    fontSize: 14,
    lineHeight: 20,
  },
  // Quiz
  quizCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  quizIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quizIconText: {
    color: '#ff3b30',
    fontSize: 36,
    fontWeight: '800',
  },
  quizTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  quizSub: {
    color: '#555',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Intro overlay
  introOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  // Zero-size anchor so absolute rings are centered on screen
  ringsAnchor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: '#ff3b30',
    top: -110,
    left: -110,
  },
  introTitle: {
    color: '#fff',
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 14,
    textAlign: 'center',
  },
  introSub: {
    color: '#444',
    fontSize: 14,
    marginTop: 14,
    letterSpacing: 0.5,
  },
});
