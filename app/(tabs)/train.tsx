import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Focus = 'Technical' | 'Cardio' | 'Strength' | 'Defense' | 'Kicks';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

const workouts: Record<Focus, Record<Difficulty, string[]>> = {
  Technical: {
    Beginner: ['Jab → Cross', 'Jab → Cross → Hook', 'Jab → Cross → Low Kick'],
    Intermediate: ['Jab → Cross → Hook → Low Kick', 'Slip → Cross → Hook', 'Jab → Teep → Cross'],
    Advanced: ['Double Jab → Cross → Hook → Low Kick', 'Slip → Cross → Hook → Rear Kick', 'Jab → Cross → Pivot → Hook'],
  },
  Cardio: {
    Beginner: ['Shadowbox nonstop', 'Jab-cross bursts', 'Light kicks + movement'],
    Intermediate: ['30 sec punch flurries', 'Kick-punch-kick flow', 'Sprawl → combo repeat'],
    Advanced: ['1 min nonstop combos', 'Sprint punches + kicks', 'High pace sparring simulation'],
  },
  Strength: {
    Beginner: ['Pushups', 'Squats', 'Plank holds'],
    Intermediate: ['Jump squats', 'Pushups + knees', 'Lunges + punches'],
    Advanced: ['Burpees', 'Explosive pushups', 'Jump lunges + combo finish'],
  },
  Defense: {
    Beginner: ['High block → jab', 'Slip left → cross', 'Step back → reset'],
    Intermediate: ['Parry → cross', 'Check kick → return kick', 'Slip → hook counter'],
    Advanced: ['Slip → pivot → counter', 'Block combo → return 3 shots', 'Check → cross → low kick'],
  },
  Kicks: {
    Beginner: ['Lead teep', 'Rear low kick', 'Body kick practice'],
    Intermediate: ['Teep → cross', 'Low kick → hook', 'Body kick → angle out'],
    Advanced: ['Fake teep → cross', 'Low kick → cross → hook', 'Body kick → switch kick'],
  },
};

export default function TrainScreen() {
  const [focus, setFocus] = useState<Focus>('Technical');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [currentWorkout, setCurrentWorkout] = useState<string[]>(workouts.Technical.Beginner);

  function generateWorkout() {
    setCurrentWorkout(workouts[focus][difficulty]);
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Train</Text>
      <Text style={styles.subtitle}>
        Choose your focus and difficulty. AI generation comes next.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Focus</Text>
        {(['Technical', 'Cardio', 'Strength', 'Defense', 'Kicks'] as Focus[]).map((item) => (
          <Pressable
            key={item}
            style={[styles.option, focus === item && styles.selected]}
            onPress={() => setFocus(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Difficulty</Text>
        {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((item) => (
          <Pressable
            key={item}
            style={[styles.option, difficulty === item && styles.selected]}
            onPress={() => setDifficulty(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.generateButton} onPress={generateWorkout}>
        <Text style={styles.generateText}>Generate Workout</Text>
        <Text style={styles.generateSubtext}>Soon this will use AI + your fighter profile</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          {difficulty} {focus} Workout
        </Text>

        {currentWorkout.map((round, index) => (
          <View key={index} style={styles.roundCard}>
            <Text style={styles.roundTitle}>Round {index + 1}</Text>
            <Text style={styles.roundText}>{round}</Text>
            <Text style={styles.roundSubtext}>3 minutes work / 1 minute rest</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Workout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101010' },
  content: { padding: 20, paddingBottom: 40 },
  appName: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 16, lineHeight: 22, marginBottom: 20 },
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  option: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  selected: { backgroundColor: '#ff3b30', borderColor: '#ff3b30' },
  optionText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  generateButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  generateText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  generateSubtext: { color: '#ffe5e2', fontSize: 13, marginTop: 4 },
  roundCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  roundTitle: { color: '#ff3b30', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  roundText: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  roundSubtext: { color: '#aaa', fontSize: 13 },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: { color: '#101010', fontSize: 18, fontWeight: '900' },
});