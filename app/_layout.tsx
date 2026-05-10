import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import 'react-native-reanimated';

import { ProfileProvider, useProfile } from '@/context/ProfileContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function SignupModal() {
  const { profile, profileLoaded, saveProfile } = useProfile();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [reach, setReach] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [style, setStyle] = useState('');

  if (!profileLoaded || profile !== null) return null;

  async function handleSave() {
    if (!name || !age || !height || !weight || !reach || !experience || !goal || !style) {
      Alert.alert('Missing Info', 'Please fill out all fields to continue.');
      return;
    }
    await saveProfile({ name, age, height, weight, reach, experience, goal, style });
  }

  return (
    <Modal animationType="slide" transparent={false} visible statusBarTranslucent>
      <ScrollView style={styles.modalPage} contentContainerStyle={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalAppLabel}>ROUND ONE</Text>
          <Text style={styles.modalTitle}>Create Your{'\n'}Fighter Profile</Text>
          <Text style={styles.modalSubtitle}>
            Tell us about yourself so we can personalize your training, style, and goals.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#555"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Height  (e.g. 6'2)"
            placeholderTextColor="#555"
            value={height}
            onChangeText={setHeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Weight  (e.g. 185 lb)"
            placeholderTextColor="#555"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Reach  (e.g. 74 in)"
            placeholderTextColor="#555"
            value={reach}
            onChangeText={setReach}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Experience Level</Text>
          <View style={styles.optionGrid}>
            {['Beginner', 'Learner', 'Intermediate', 'Advanced'].map((item) => (
              <Pressable
                key={item}
                style={[styles.option, experience === item && styles.optionSelected]}
                onPress={() => setExperience(item)}
              >
                <Text style={[styles.optionText, experience === item && styles.optionTextSelected]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Main Goal</Text>
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
                style={[styles.option, goal === item && styles.optionSelected]}
                onPress={() => setGoal(item)}
              >
                <Text style={[styles.optionText, goal === item && styles.optionTextSelected]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fighting Style</Text>
          <View style={styles.optionGrid}>
            {['Out-fighter', 'Pressure fighter', 'Counter striker', 'Kicker', 'Not sure yet'].map(
              (item) => (
                <Pressable
                  key={item}
                  style={[styles.option, style === item && styles.optionSelected]}
                  onPress={() => setStyle(item)}
                >
                  <Text style={[styles.optionText, style === item && styles.optionTextSelected]}>
                    {item}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enter the Ring</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SignupModal />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ProfileProvider>
      <RootLayoutInner />
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  modalPage: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 50,
  },
  modalHeader: {
    marginTop: 60,
    marginBottom: 28,
  },
  modalAppLabel: {
    color: '#ff3b30',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 12,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 46,
    marginBottom: 14,
  },
  modalSubtitle: {
    color: '#555',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1c1c1c',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 10,
  },
  optionGrid: {
    gap: 8,
  },
  option: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 12,
    padding: 14,
  },
  optionSelected: {
    backgroundColor: '#ff3b30',
    borderColor: '#ff3b30',
  },
  optionText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
