import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Focus = 'Technical' | 'Cardio' | 'Strength' | 'Defense' | 'Kicks';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

type AIRound = {
  round: number;
  drill: string;
  coachingTip: string;
  durationSeconds: number;
  steps?: string[];
};

type AIWorkout = {
  title: string;
  warmup: string;
  rounds: AIRound[];
  finisher: string;
  tips: string[];
};

const SERVER_URL = 'http://10.12.132.1:3001';
const SAVED_WORKOUTS_KEY = 'savedWorkouts';
const SELECTED_WORKOUT_KEY = 'selectedWorkout';
const RANK_XP_KEY = 'rankXP';

export default function TrainScreen() {
  const [focuses, setFocuses] = useState<Focus[]>(['Technical']);
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [workout, setWorkout] = useState<AIWorkout | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<AIWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [replacingRound, setReplacingRound] = useState<number | null>(null);

  const [activeRound, setActiveRound] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);
  const [workoutXPAwarded, setWorkoutXPAwarded] = useState(false);
  const [rankMessage, setRankMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedWorkouts() {
      const saved = await AsyncStorage.getItem(SAVED_WORKOUTS_KEY);
      setSavedWorkouts(saved ? JSON.parse(saved) : []);
    }

    async function loadSelectedWorkout() {
      const selected = await AsyncStorage.getItem(SELECTED_WORKOUT_KEY);

      if (selected) {
        setWorkout(JSON.parse(selected));
        setCompletedRounds([]);
        setActiveRound(null);
        setTimeLeft(0);
        setTimerRunning(false);
        setWorkoutXPAwarded(false);
        setRankMessage(null);

        await AsyncStorage.removeItem(SELECTED_WORKOUT_KEY);
      }
    }

    loadSavedWorkouts();
    loadSelectedWorkout();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);

          if (activeRound !== null) {
            completeRound(activeRound);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, activeRound, completedRounds, workout, workoutXPAwarded]);

  function getWorkoutXP() {
    if (difficulty === 'Beginner') return 50;
    if (difficulty === 'Intermediate') return 100;
    return 175;
  }

  function toggleFocus(item: Focus) {
    setFocuses((prev) => {
      if (prev.includes(item)) {
        return prev.length === 1 ? prev : prev.filter((focus) => focus !== item);
      }

      return [...prev, item];
    });
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function getTotalSeconds() {
    if (!workout) return 0;
    const rounds = workout.rounds.reduce((sum, round) => sum + round.durationSeconds, 0);
    return rounds + 300;
  }

  function getProgressPercent() {
    if (!workout) return 0;
    return (completedRounds.length / workout.rounds.length) * 100;
  }

  function startTimer(round: AIRound) {
    setActiveRound(round.round);
    setTimeLeft(round.durationSeconds || 90);
    setTimerRunning(true);
  }

  function pauseTimer() {
    setTimerRunning(false);
  }

  function resetTimer(round: AIRound) {
    setActiveRound(round.round);
    setTimeLeft(round.durationSeconds || 90);
    setTimerRunning(false);
  }

  async function awardRankXP() {
  if (workoutXPAwarded) return;

  const savedXP = await AsyncStorage.getItem(RANK_XP_KEY);
  const currentXP = savedXP ? Number(JSON.parse(savedXP)) : 0;
  const earnedXP = getWorkoutXP();
  const newXP = currentXP + earnedXP;

  await AsyncStorage.setItem(RANK_XP_KEY, JSON.stringify(newXP));

  setWorkoutXPAwarded(true);
  setRankMessage(`Workout complete! +${earnedXP} Rank XP`);
}

async function completeRound(roundNumber: number) {
  if (!workout) return;

  const updatedRounds = completedRounds.includes(roundNumber)
    ? completedRounds
    : [...completedRounds, roundNumber];

  setCompletedRounds(updatedRounds);

  if (updatedRounds.length === workout.rounds.length) {
    await awardRankXP();
  }
}

  async function saveWorkout() {
    if (!workout) return;

    const saved = await AsyncStorage.getItem(SAVED_WORKOUTS_KEY);
    const oldWorkouts = saved ? JSON.parse(saved) : [];
    const updatedWorkouts = [workout, ...oldWorkouts];

    await AsyncStorage.setItem(SAVED_WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    setSavedWorkouts(updatedWorkouts);
  }

  async function generateWorkout() {
    try {
      setLoading(true);
      setWorkout(null);
      setActiveRound(null);
      setTimeLeft(0);
      setTimerRunning(false);
      setCompletedRounds([]);
      setWorkoutXPAwarded(false);
      setRankMessage(null);

      const response = await fetch(`${SERVER_URL}/generate-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focuses, difficulty }),
      });

      const data = await response.json();

      const fixedWorkout = {
        ...data,
        rounds: data.rounds.map((round: AIRound, index: number) => ({
          ...round,
          round: index + 1,
          durationSeconds: round.durationSeconds || 90,
          steps: round.steps || ['Keep your guard up', 'Stay balanced', 'Reset after every combo'],
        })),
      };

      setWorkout(fixedWorkout);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function replaceRound(roundIndex: number) {
    if (!workout) return;

    try {
      setReplacingRound(roundIndex);

      const response = await fetch(`${SERVER_URL}/generate-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focuses, difficulty }),
      });

      const data = await response.json();
      const newRound = data.rounds[roundIndex] || data.rounds[0];

      const updatedRounds = [...workout.rounds];
      updatedRounds[roundIndex] = {
        ...newRound,
        round: roundIndex + 1,
        durationSeconds: newRound.durationSeconds || 90,
        steps: newRound.steps || ['Keep your guard up', 'Stay balanced', 'Reset after every combo'],
      };

      setWorkout({ ...workout, rounds: updatedRounds });
      setCompletedRounds((prev) => prev.filter((round) => round !== roundIndex + 1));
      setRankMessage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setReplacingRound(null);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Train</Text>
      <Text style={styles.subtitle}>Generate a hybrid timed workout using AI.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Focus Areas</Text>
        {(['Technical', 'Cardio', 'Strength', 'Defense', 'Kicks'] as Focus[]).map((item) => (
          <Pressable key={item} style={[styles.option, focuses.includes(item) && styles.selected]} onPress={() => toggleFocus(item)}>
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Difficulty</Text>
        {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((item) => (
          <Pressable key={item} style={[styles.option, difficulty === item && styles.selected]} onPress={() => setDifficulty(item)}>
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.generateButton} onPress={generateWorkout}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateText}>Generate AI Workout</Text>}
      </Pressable>

      {workout && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{workout.title}</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>Focus: {focuses.join(' + ')}</Text>
            <Text style={styles.summaryText}>Difficulty: {difficulty}</Text>
            <Text style={styles.summaryText}>Total Time: ~{Math.ceil(getTotalSeconds() / 60)} min</Text>
            <Text style={styles.summaryText}>Progress: {completedRounds.length}/{workout.rounds.length} rounds</Text>
            <Text style={styles.summaryText}>Reward: +{getWorkoutXP()} Rank XP</Text>

            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${getProgressPercent()}%` }]} />
            </View>

            {rankMessage && <Text style={styles.rankMessage}>{rankMessage}</Text>}
          </View>

          <Text style={styles.text}>Warmup: {workout.warmup}</Text>

          {workout.rounds.map((round, index) => (
            <View key={round.round} style={styles.roundCard}>
              <Text style={styles.roundTitle}>
                {completedRounds.includes(round.round) ? '✅ ' : ''}Round {round.round}
              </Text>

              <Text style={styles.roundText}>{round.drill}</Text>
              <Text style={styles.tip}>Tip: {round.coachingTip}</Text>

              {round.steps?.map((step, stepIndex) => (
                <Text key={stepIndex} style={styles.step}>• {step}</Text>
              ))}

              <Text style={styles.timer}>
                {activeRound === round.round ? formatTime(timeLeft) : formatTime(round.durationSeconds)}
              </Text>

              <View style={styles.timerRow}>
                <Pressable style={styles.timerButton} onPress={() => startTimer(round)}>
                  <Text style={styles.timerButtonText}>Start</Text>
                </Pressable>

                <Pressable style={styles.timerButtonDark} onPress={pauseTimer}>
                  <Text style={styles.timerButtonText}>Pause</Text>
                </Pressable>

                <Pressable style={styles.timerButtonDark} onPress={() => resetTimer(round)}>
                  <Text style={styles.timerButtonText}>Reset</Text>
                </Pressable>
              </View>

              <View style={styles.timerRow}>
                <Pressable style={styles.completeButton} onPress={() => completeRound(round.round)}>
                  <Text style={styles.timerButtonText}>Complete</Text>
                </Pressable>

                <Pressable style={styles.timerButtonDark} onPress={() => replaceRound(index)}>
                  {replacingRound === index ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.timerButtonText}>Replace Round</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ))}

          <Text style={styles.text}>Finisher: {workout.finisher}</Text>

          {workout.tips.map((tip, index) => (
            <Text key={index} style={styles.tip}>• {tip}</Text>
          ))}

          <Pressable style={styles.saveButton} onPress={saveWorkout}>
            <Text style={styles.generateText}>Save Workout</Text>
          </Pressable>

          <Text style={styles.savedText}>Saved Workouts: {savedWorkouts.length}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101010' },
  content: { padding: 20, paddingBottom: 40 },
  appName: { color: '#ff3b30', fontSize: 16, fontWeight: '700', marginTop: 30, marginBottom: 8 },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 16, marginBottom: 20 },
  card: { backgroundColor: '#1b1b1b', borderRadius: 18, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  option: { backgroundColor: '#111', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  selected: { backgroundColor: '#ff3b30', borderColor: '#ff3b30' },
  optionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  generateButton: { backgroundColor: '#ff3b30', borderRadius: 16, padding: 18, marginBottom: 16, alignItems: 'center' },
  saveButton: { backgroundColor: '#ff3b30', borderRadius: 16, padding: 16, marginTop: 14, alignItems: 'center' },
  generateText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  text: { color: '#ccc', fontSize: 15, marginBottom: 12 },
  summaryCard: { backgroundColor: '#111', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#333' },
  summaryText: { color: '#ddd', fontSize: 14, marginBottom: 6, fontWeight: '700' },
  rankMessage: { color: '#4ade80', fontSize: 15, fontWeight: '900', marginTop: 10 },
  progressBackground: { height: 10, backgroundColor: '#333', borderRadius: 10, overflow: 'hidden', marginTop: 8 },
  progressFill: { height: '100%', backgroundColor: '#ff3b30', borderRadius: 10 },
  roundCard: { backgroundColor: '#111', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  roundTitle: { color: '#ff3b30', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  roundText: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  tip: { color: '#aaa', fontSize: 14, marginBottom: 6 },
  step: { color: '#ccc', fontSize: 14, marginBottom: 4 },
  timer: { color: '#fff', fontSize: 34, fontWeight: '900', marginVertical: 10 },
  timerRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  timerButton: { flex: 1, backgroundColor: '#ff3b30', padding: 12, borderRadius: 12, alignItems: 'center' },
  timerButtonDark: { flex: 1, backgroundColor: '#222', padding: 12, borderRadius: 12, alignItems: 'center' },
  completeButton: { flex: 1, backgroundColor: '#198754', padding: 12, borderRadius: 12, alignItems: 'center' },
  timerButtonText: { color: '#fff', fontWeight: '800' },
  savedText: { color: '#aaa', textAlign: 'center', marginTop: 10, fontWeight: '700' },
});