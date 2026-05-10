import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useProfile } from '@/context/ProfileContext';

import { RANKS } from '@/data/quizQuestions';

const SAVED_WORKOUTS_KEY = 'savedWorkouts';
const SELECTED_WORKOUT_KEY = 'selectedWorkout';
const RANK_XP_KEY = 'rankXP';

function getRankInfo(score: number) {
  let current = RANKS[0];

  for (const r of RANKS) {
    if (score >= r.minScore) current = r;
  }

  const nextIndex = RANKS.indexOf(current) + 1;
  const next = nextIndex < RANKS.length ? RANKS[nextIndex] : null;

  const pct = next
    ? (score - current.minScore) / (next.minScore - current.minScore)
    : 1;

  return { current, next, pct };
}

type SavedWorkout = {
  title: string;
  warmup: string;
  rounds: {
    round: number;
    drill: string;
    coachingTip: string;
    durationSeconds: number;
    steps?: string[];
  }[];
  finisher: string;
  tips: string[];
};

export default function ProfileScreen() {
  const { profile, clearProfile } = useProfile();
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [rankXP, setRankXP] = useState(0);

  const { current: currentRank, next: nextRank, pct: rankPct } = getRankInfo(rankXP);

  async function loadProfileData() {
    const saved = await AsyncStorage.getItem(SAVED_WORKOUTS_KEY);
    const xp = await AsyncStorage.getItem(RANK_XP_KEY);

    setSavedWorkouts(saved ? JSON.parse(saved) : []);
    setRankXP(xp ? JSON.parse(xp) : 0);
  }

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  useEffect(() => {
    loadProfileData();
  }, []);

  function handleSignOut() {
    Alert.alert('Sign Out', 'This will clear all your data and show the signup screen.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await AsyncStorage.multiRemove([SAVED_WORKOUTS_KEY, SELECTED_WORKOUT_KEY, RANK_XP_KEY, 'moveXP']);
          await clearProfile();
        },
      },
    ]);
  }

  async function openSavedWorkout(workout: SavedWorkout) {
    await AsyncStorage.setItem(SELECTED_WORKOUT_KEY, JSON.stringify(workout));
    router.push('/(tabs)/train');
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Fighter Profile</Text>
      <Text style={styles.subtitle}>Track your fighter stats, progress, and training identity.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Fighter Info</Text>

        {([
          ['Name', profile?.name],
          ['Age', profile?.age],
          ['Height', profile?.height],
          ['Weight', profile?.weight],
          ['Reach', profile?.reach],
          ['Experience', profile?.experience],
          ['Goal', profile?.goal],
          ['Style', profile?.style],
        ] as [string, string | undefined][]).map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value ?? '—'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{savedWorkouts.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{rankXP}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>

        <View style={styles.statCard}>
          <Text
            style={[styles.statNumber, styles.rankStatText, { color: currentRank.color }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {currentRank.label}
          </Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rankRow}>
          <Text
            style={[styles.rankLabel, { color: currentRank.color }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {currentRank.label}
          </Text>

          {nextRank ? (
            <Text style={styles.rankNext}>{nextRank.minScore - rankXP} XP to {nextRank.label}</Text>
          ) : (
            <Text style={styles.rankNext}>Max rank reached</Text>
          )}
        </View>

        <View style={styles.rankTrack}>
          <View style={[styles.rankFill, { width: `${rankPct * 100}%` as `${number}%`, backgroundColor: currentRank.color }]} />
        </View>

        <View style={styles.rankEndpoints}>
          <Text style={styles.rankMin}>{currentRank.minScore}</Text>
          {nextRank && <Text style={styles.rankMax}>{nextRank.minScore}</Text>}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Saved Workouts</Text>

        {savedWorkouts.length === 0 ? (
          <Text style={styles.text}>No saved workouts yet.</Text>
        ) : (
          savedWorkouts.map((workout, index) => (
            <Pressable key={index} style={styles.workoutCard} onPress={() => openSavedWorkout(workout)}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.text}>Rounds: {workout.rounds.length}</Text>
              <Text style={styles.text}>Warmup: {workout.warmup}</Text>
              <Text style={styles.openText}>Tap to open in Training →</Text>
            </Pressable>
          ))
        )}
      </View>

      <Pressable style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101010' },
  content: { padding: 20, paddingBottom: 40 },
  appName: { color: '#ff3b30', fontSize: 16, fontWeight: '700', marginTop: 30, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 16, lineHeight: 22, marginBottom: 20 },
  card: { backgroundColor: '#1b1b1b', borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#2a2a2a', paddingVertical: 10 },
  label: { color: '#999', fontSize: 15, fontWeight: '600' },
  value: { color: '#fff', fontSize: 15, fontWeight: '700' },
  statsContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#1b1b1b', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  statNumber: { color: '#fff', fontSize: 20, fontWeight: '800' },
  rankStatText: { fontSize: 15, maxWidth: '100%' },
  statLabel: { color: '#aaa', fontSize: 12, marginTop: 4, fontWeight: '600' },
  text: { color: '#d6d6d6', fontSize: 16, marginBottom: 8 },
  workoutCard: { backgroundColor: '#111', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  workoutTitle: { color: '#ff3b30', fontSize: 17, fontWeight: '800', marginBottom: 8 },
  openText: { color: '#ff3b30', fontSize: 14, fontWeight: '800', marginTop: 4 },
  button: { backgroundColor: '#ff3b30', borderRadius: 16, padding: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12 },
  rankLabel: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5, flex: 1 },
  rankNext: { color: '#666', fontSize: 12, fontWeight: '600' },
  rankTrack: { height: 8, backgroundColor: '#1a1a1a', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  rankFill: { height: '100%', borderRadius: 4 },
  rankEndpoints: { flexDirection: 'row', justifyContent: 'space-between' },
  rankMin: { color: '#555', fontSize: 11, fontWeight: '600' },
  rankMax: { color: '#555', fontSize: 11, fontWeight: '600' },
});