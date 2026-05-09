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

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [reach, setReach] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [style, setStyle] = useState('');

  function saveProfile() {
    if (!name || !age || !height || !weight || !reach || !experience || !goal || !style) {
      Alert.alert('Missing Info', 'Please fill out all profile fields before continuing.');
      return;
    }

    Alert.alert(
      'Profile Saved',
      `Welcome ${name}! Your ${experience} kickboxing profile is ready.`
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>AI Kickboxing Coach</Text>
        <Text style={styles.title}>Build Your Fighter Profile</Text>
        <Text style={styles.subtitle}>
          We use this information to personalize your workouts, style, and training plan.
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
          {[
            'Out-fighter',
            'Pressure fighter',
            'Counter striker',
            'Kicker',
            'Not sure yet',
          ].map((item) => (
            <Pressable
              key={item}
              style={[styles.optionButton, style === item && styles.selectedButton]}
              onPress={() => setStyle(item)}
            >
              <Text style={[styles.optionText, style === item && styles.selectedText]}>
                {item}
              </Text>
            </Pressable>
          ))}
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
});