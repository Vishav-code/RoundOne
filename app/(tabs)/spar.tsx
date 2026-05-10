import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SparScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState('Beginner reaction');
  const [difficulty, setDifficulty] = useState('Easy');
  const [started, setStarted] = useState(false);
  const [prompt, setPrompt] = useState('Slip Left');

  const modes = [
    'Beginner reaction',
    'Defense',
    'Punch response',
    'Kick defense',
    'Full spar',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const prompts = ['Slip Left', 'Slip Right', 'Block High', 'Duck', 'Counter Cross', 'Check Kick'];

  function nextPrompt() {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(random);
  }

  if (!permission) {
    return <View style={styles.page} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Camera Access Needed</Text>
        <Text style={styles.subtitle}>Virtual Spar uses your camera for reaction training.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  if (started) {
    return (
      <View style={styles.page}>
        <CameraView style={styles.camera} facing="front" />

        <View style={styles.overlay}>
          <Text style={styles.prompt}>{prompt}</Text>

          <View style={styles.targetCircle} />

          <View style={styles.arrowRow}>
            <Text style={styles.arrow}>←</Text>
            <Text style={styles.arrow}>↑</Text>
            <Text style={styles.arrow}>→</Text>
          </View>

          <Pressable style={styles.button} onPress={nextPrompt}>
            <Text style={styles.buttonText}>Next Prompt</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => setStarted(false)}>
            <Text style={styles.secondaryText}>End Spar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.appName}>AI Kickboxing Coach</Text>
      <Text style={styles.title}>Virtual Spar</Text>
      <Text style={styles.subtitle}>
        Choose a sparring mode and difficulty. Camera tracking will be added here.
      </Text>

      <Text style={styles.sectionTitle}>Choose Mode</Text>
      {modes.map((item) => (
        <Pressable
          key={item}
          style={[styles.option, mode === item && styles.selected]}
          onPress={() => setMode(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </Pressable>
      ))}

      <Text style={styles.sectionTitle}>Choose Difficulty</Text>
      <View style={styles.row}>
        {difficulties.map((item) => (
          <Pressable
            key={item}
            style={[styles.smallOption, difficulty === item && styles.selected]}
            onPress={() => setDifficulty(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button} onPress={() => setStarted(true)}>
        <Text style={styles.buttonText}>Start Spar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 20,
  },
  appName: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 8,
    textTransform: 'uppercase',
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
    lineHeight: 22,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#1b1b1b',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  smallOption: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#ff3b30',
    borderColor: '#ff3b30',
  },
  optionText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff3b30',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
  },
  prompt: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 16,
  },
  targetCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 5,
    borderColor: '#ff3b30',
    backgroundColor: 'rgba(255,59,48,0.15)',
  },
  arrowRow: {
    flexDirection: 'row',
    gap: 30,
  },
  arrow: {
    color: '#fff',
    fontSize: 50,
    fontWeight: '900',
  },
});