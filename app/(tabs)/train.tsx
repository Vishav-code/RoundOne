import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Focus = 'Technical' | 'Cardio' | 'Strength' | 'Defense' | 'Kicks';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

type AIRound = {
  round: number;
  drill: string;
  coachingTip: string;
};

type AIWorkout = {
  title: string;
  warmup: string;
  rounds: AIRound[];
  finisher: string;
  tips: string[];
};

const SERVER_URL = 'http://10.12.132.1:3001';

export default function TrainScreen() {
  const [focus, setFocus] = useState<Focus>('Technical');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [workout, setWorkout] = useState<AIWorkout | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateWorkout() {
    try {
      setLoading(true);

      const response = await fetch(`${SERVER_URL}/generate-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focus, difficulty }),
      });

      const data = await response.json();
      setWorkout(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Train</Text>
      <Text style={styles.subtitle}>Generate a personalized workout using AI.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Focus</Text>
        {(['Technical', 'Cardio', 'Strength', 'Defense', 'Kicks'] as Focus[]).map((item) => (
          <Pressable key={item} style={[styles.option, focus === item && styles.selected]} onPress={() => setFocus(item)}>
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
          <Text style={styles.text}>Warmup: {workout.warmup}</Text>

          {workout.rounds.map((round) => (
            <View key={round.round} style={styles.roundCard}>
              <Text style={styles.roundTitle}>Round {round.round}</Text>
              <Text style={styles.roundText}>{round.drill}</Text>
              <Text style={styles.tip}>Tip: {round.coachingTip}</Text>
            </View>
          ))}

          <Text style={styles.text}>Finisher: {workout.finisher}</Text>

          {workout.tips.map((tip, index) => (
            <Text key={index} style={styles.tip}>• {tip}</Text>
          ))}
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
  generateText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  text: { color: '#ccc', fontSize: 15, marginBottom: 12 },
  roundCard: { backgroundColor: '#111', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  roundTitle: { color: '#ff3b30', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  roundText: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  tip: { color: '#aaa', fontSize: 14, marginBottom: 6 },
});