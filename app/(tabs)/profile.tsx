import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Fighter Profile</Text>
      <Text style={styles.subtitle}>Track your fighter stats, progress, and training identity.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Fighter Info</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>Vishavjit</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Experience</Text>
          <Text style={styles.value}>Beginner</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Goal</Text>
          <Text style={styles.value}>Improve combos</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Style</Text>
          <Text style={styles.value}>Out-fighter</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50</Text>
          <Text style={styles.statLabel}>Fight IQ</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>Bronze</Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Strengths</Text>
        <Text style={styles.text}>• Jab</Text>
        <Text style={styles.text}>• Footwork</Text>
        <Text style={styles.text}>• Distance control</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Needs Work</Text>
        <Text style={styles.text}>• Defense after combos</Text>
        <Text style={styles.text}>• Low kick checks</Text>
        <Text style={styles.text}>• Cardio in later rounds</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>
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
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 18,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    paddingVertical: 10,
  },
  label: {
    color: '#999',
    fontSize: 15,
    fontWeight: '600',
  },
  value: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  text: {
    color: '#d6d6d6',
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#ff3b30',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});