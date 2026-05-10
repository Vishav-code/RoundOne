import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FighterProfile = {
  name: string;
  age: string;
  height: string;
  weight: string;
  reach: string;
  experience: string;
  goal: string;
  style: string;
};

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [reach, setReach] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [style, setStyle] = useState('');

  const [profileSaved, setProfileSaved] = useState(false);
  const [fighterProfile, setFighterProfile] = useState<FighterProfile | null>(null);

  function saveProfile() {
    if (!name || !age || !height || !weight || !reach || !experience || !goal || !style) {
      Alert.alert('Missing Info', 'Please fill out all profile fields before continuing.');
      return;
    }

    const profile: FighterProfile = {
      name,
      age,
      height,
      weight,
      reach,
      experience,
      goal,
      style,
    };

    setFighterProfile(profile);
    setProfileSaved(true);
  }

  function getRecommendedFocus() {
    if (!fighterProfile) {
      return 'Start with basic stance, jab-cross, defense, and simple movement.';
    }

    if (fighterProfile.style === 'Out-fighter') {
      return 'Use your jab, teep, and footwork to control distance. Stay long, keep your opponent at the end of your strikes, and reset after every combo.';
    }

    if (fighterProfile.style === 'Pressure fighter') {
      return 'Work on forward pressure, body shots, low kicks, and cutting off angles. Your goal is to stay active without walking straight into counters.';
    }

    if (fighterProfile.style === 'Counter striker') {
      return 'Focus on slipping, blocking, and returning counters quickly. Let the opponent miss, then answer with clean shots.';
    }

    if (fighterProfile.style === 'Kicker') {
      return 'Practice teeps, low kicks, body kicks, and distance management. Use your legs to control range before entering with punches.';
    }

    return 'Start with basic stance, jab-cross, defense, and simple movement. The app can help you discover your fighting style as you train.';
  }

  if (profileSaved && fighterProfile) {
    return (
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appName}>AI Kickboxing Coach</Text>
          <Text style={styles.title}>Welcome, {fighterProfile.name}</Text>
          <Text style={styles.subtitle}>
            Your fighter profile is ready. Today&apos;s training is personalized around your goal,
            experience, and fighting style.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Fighter Profile</Text>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Experience</Text>
            <Text style={styles.profileValue}>{fighterProfile.experience}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Goal</Text>
            <Text style={styles.profileValue}>{fighterProfile.goal}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Style</Text>
            <Text style={styles.profileValue}>{fighterProfile.style}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Height</Text>
            <Text style={styles.profileValue}>{fighterProfile.height}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Weight</Text>
            <Text style={styles.profileValue}>{fighterProfile.weight}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Reach</Text>
            <Text style={styles.profileValue}>{fighterProfile.reach}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today&apos;s Recommended Focus</Text>
          <Text style={styles.recommendationText}>{getRecommendedFocus()}</Text>
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
          <Text style={styles.sectionTitle}>Quick Start</Text>

          <Pressable style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Start Training</Text>
            <Text style={styles.menuButtonSubtext}>Generate a workout based on your profile</Text>
          </Pressable>

          <Pressable style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Learn Moves</Text>
            <Text style={styles.menuButtonSubtext}>Practice jabs, teeps, kicks, and defense</Text>
          </Pressable>

          <Pressable style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Virtual Spar</Text>
            <Text style={styles.menuButtonSubtext}>React to attacks and earn a rank</Text>
          </Pressable>

          <Pressable style={styles.menuButton}>
            <Text style={styles.menuButtonText}>Fight IQ Quiz</Text>
            <Text style={styles.menuButtonSubtext}>Answer fight scenarios and improve your score</Text>
          </Pressable>
        </View>

        <Pressable style={styles.secondaryButton} onPress={() => setProfileSaved(false)}>
          <Text style={styles.secondaryButtonText}>Edit Fighter Profile</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>AI Kickboxing Coach</Text>
        <Text style={styles.title}>Build Your Fighter Profile</Text>
        <Text style={styles.subtitle}>
          We use this information to personalize your workouts, fighting style, and training plan.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Info</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          style={styles.input}
          placeholder="Height, example: 6'6"
          placeholderTextColor="#777"
          value={height}
          onChangeText={setHeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight, example: 205 lb"
          placeholderTextColor="#777"
          value={weight}
          onChangeText={setWeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Reach, example: 80 in"
          placeholderTextColor="#777"
          value={reach}
          onChangeText={setReach}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Experience Level</Text>

        <View style={styles.optionGrid}>
          {['Beginner', 'Learner', 'Intermediate', 'Advanced'].map((item) => (
            <Pressable
              key={item}
              style={[styles.optionButton, experience === item && styles.selectedButton]}
              onPress={() => setExperience(item)}
            >
              <Text style={[styles.optionText, experience === item && styles.selectedText]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Main Goal</Text>

        <View style={styles.optionGrid}>
          {[
            'Learn basics',
            'Improve combos',
            'Improve defense',
            'Improve cardio',
            'Prepare for sparring',
          ].map((item) => (
            <Pressable
              key={item}
              style={[styles.optionButton, goal === item && styles.selectedButton]}
              onPress={() => setGoal(item)}
            >
              <Text style={[styles.optionText, goal === item && styles.selectedText]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Fighting Style</Text>

        <View style={styles.optionGrid}>
          {['Out-fighter', 'Pressure fighter', 'Counter striker', 'Kicker', 'Not sure yet'].map(
            (item) => (
              <Pressable
                key={item}
                style={[styles.optionButton, style === item && styles.selectedButton]}
                onPress={() => setStyle(item)}
              >
                <Text style={[styles.optionText, style === item && styles.selectedText]}>
                  {item}
                </Text>
              </Pressable>
            )
          )}
        </View>
      </View>

      <Pressable style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save Fighter Profile</Text>
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

  header: {
    marginTop: 30,
    marginBottom: 20,
  },

  appName: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    color: '#b5b5b5',
    fontSize: 16,
    lineHeight: 22,
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
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
  },

  optionGrid: {
    gap: 10,
  },

  optionButton: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 14,
  },

  selectedButton: {
    backgroundColor: '#ff3b30',
    borderColor: '#ff3b30',
  },

  optionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  selectedText: {
    color: '#ffffff',
  },

  saveButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 4,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },

  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    paddingVertical: 10,
    gap: 12,
  },

  profileLabel: {
    color: '#a5a5a5',
    fontSize: 15,
    fontWeight: '600',
  },

  profileValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },

  recommendationText: {
    color: '#ffffff',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
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
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },

  statNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },

  statLabel: {
    color: '#a5a5a5',
    fontSize: 12,
    fontWeight: '600',
  },

  menuButton: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  menuButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  menuButtonSubtext: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 18,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },

  secondaryButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '800',
  },
});