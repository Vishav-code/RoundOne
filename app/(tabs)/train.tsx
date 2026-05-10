import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Workout = {
  title: string;
  rounds: string[];
};

export default function TrainScreen() {
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);

  const premadeWorkouts: Workout[] = [
    {
      title: 'Beginner Combo Workout',
      rounds: [
        'Round 1: Jab → Cross',
        'Round 2: Jab → Cross → Hook',
        'Round 3: Jab → Cross → Low Kick',
      ],
    },
    {
      title: 'Cardio Kickboxing',
      rounds: [
        'Round 1: Fast punches (non-stop)',
        'Round 2: Kicks + movement',
        'Round 3: Bursts (10 sec all out)',
      ],
    },
    {
      title: 'Defense & Counters',
      rounds: [
        'Round 1: Block + return jab',
        'Round 2: Slip → Cross',
        'Round 3: Check kick → counter',
      ],
    },
    {
      title: 'Kicks Focus',
      rounds: [
        'Round 1: Lead teep',
        'Round 2: Rear body kick',
        'Round 3: Low kicks',
      ],
    },
    {
      title: 'Sparring Prep',
      rounds: [
        'Round 1: Movement + jab',
        'Round 2: Combos + defense',
        'Round 3: Free flow shadowboxing',
      ],
    },
  ];

  function generateWorkout() {
    const random1 = premadeWorkouts[Math.floor(Math.random() * premadeWorkouts.length)];
    const random2 = premadeWorkouts[Math.floor(Math.random() * premadeWorkouts.length)];
    const random3 = premadeWorkouts[Math.floor(Math.random() * premadeWorkouts.length)];

    const workout: Workout = {
      title: 'AI Generated Workout',
      rounds: [
        random1.rounds[0],
        random2.rounds[1],
        random3.rounds[2],
      ],
    };

    setGeneratedWorkout(workout);
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Train</Text>
      <Text style={styles.subtitle}>
        Choose a workout or generate one based on your needs.
      </Text>

      {/* AI GENERATOR */}
      <Pressable style={styles.generateButton} onPress={generateWorkout}>
        <Text style={styles.generateText}>Generate Workout</Text>
        <Text style={styles.generateSubtext}>
          Personalized workout using AI logic
        </Text>
      </Pressable>

      {generatedWorkout && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{generatedWorkout.title}</Text>
          {generatedWorkout.rounds.map((round, index) => (
            <Text key={index} style={styles.text}>
              {round}
            </Text>
          ))}
        </View>
      )}

      {/* PREMADE WORKOUTS */}
      <Text style={styles.sectionTitle}>Quick Workouts</Text>

      {premadeWorkouts.map((workout, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          {workout.rounds.map((round, i) => (
            <Text key={i} style={styles.text}>
              {round}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101010',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  appName: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  generateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  generateSubtext: {
    color: '#ffe5e2',
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: {
    color: '#ccc',
    marginBottom: 6,
  },
});