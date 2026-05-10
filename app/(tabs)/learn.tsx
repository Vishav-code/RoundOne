import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Screen =
  | 'menu'
  | 'moves'
  | 'styles'
  | 'quiz'
  | 'detail';

export default function LearnScreen() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedMove, setSelectedMove] = useState('');

  const moves = [
    'Jab',
    'Cross',
    'Hook',
    'Uppercut',
    'Teep',
    'Low Kick',
    'Body Kick',
  ];

  const styles = [
    'Out-fighter',
    'Pressure fighter',
    'Counter striker',
    'Kicker',
  ];

  // ================= MENU =================
  if (screen === 'menu') {
    return (
      <ScrollView style={stylesUI.page} contentContainerStyle={stylesUI.content}>
        <Text style={stylesUI.title}>Learn</Text>
        <Text style={stylesUI.subtitle}>
          Improve your technique, fight IQ, and overall skill.
        </Text>

        <Pressable
          style={stylesUI.card}
          onPress={() => setScreen('moves')}
        >
          <Text style={stylesUI.cardTitle}>Punches & Kicks</Text>
          <Text style={stylesUI.cardSub}>Learn strikes and techniques</Text>
        </Pressable>

        <Pressable
          style={stylesUI.card}
          onPress={() => setScreen('styles')}
        >
          <Text style={stylesUI.cardTitle}>Fighting Styles</Text>
          <Text style={stylesUI.cardSub}>Understand different strategies</Text>
        </Pressable>

        <Pressable
          style={stylesUI.card}
          onPress={() => setScreen('quiz')}
        >
          <Text style={stylesUI.cardTitle}>Fight IQ Quiz</Text>
          <Text style={stylesUI.cardSub}>Test your fight knowledge</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ================= MOVES =================
  if (screen === 'moves') {
    return (
      <ScrollView style={stylesUI.page} contentContainerStyle={stylesUI.content}>
        <Text style={stylesUI.title}>Punches & Kicks</Text>

        {moves.map((move) => (
          <Pressable
            key={move}
            style={stylesUI.card}
            onPress={() => {
              setSelectedMove(move);
              setScreen('detail');
            }}
          >
            <Text style={stylesUI.cardTitle}>{move}</Text>
          </Pressable>
        ))}

        <Pressable onPress={() => setScreen('menu')}>
          <Text style={stylesUI.back}>← Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ================= STYLES =================
  if (screen === 'styles') {
    return (
      <ScrollView style={stylesUI.page} contentContainerStyle={stylesUI.content}>
        <Text style={stylesUI.title}>Fighting Styles</Text>

        {styles.map((style) => (
          <View key={style} style={stylesUI.card}>
            <Text style={stylesUI.cardTitle}>{style}</Text>
            <Text style={stylesUI.cardSub}>
              Learn how this style fights and wins.
            </Text>
          </View>
        ))}

        <Pressable onPress={() => setScreen('menu')}>
          <Text style={stylesUI.back}>← Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ================= QUIZ =================
  if (screen === 'quiz') {
    return (
      <View style={stylesUI.page}>
        <Text style={stylesUI.title}>Fight IQ Quiz</Text>
        <Text style={stylesUI.subtitle}>
          (Placeholder) Scenario-based questions coming soon.
        </Text>

        <Pressable onPress={() => setScreen('menu')}>
          <Text style={stylesUI.back}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  // ================= DETAIL =================
  if (screen === 'detail') {
    return (
      <ScrollView style={stylesUI.page} contentContainerStyle={stylesUI.content}>
        <Text style={stylesUI.title}>{selectedMove}</Text>

        <View style={stylesUI.card}>
          <Text style={stylesUI.section}>What it is</Text>
          <Text style={stylesUI.text}>
            A fundamental strike used in kickboxing.
          </Text>
        </View>

        <View style={stylesUI.card}>
          <Text style={stylesUI.section}>When to use</Text>
          <Text style={stylesUI.text}>
            Use it to control distance and set up combos.
          </Text>
        </View>

        <View style={stylesUI.card}>
          <Text style={stylesUI.section}>Common mistakes</Text>
          <Text style={stylesUI.text}>• Dropping guard</Text>
          <Text style={stylesUI.text}>• Not resetting</Text>
          <Text style={stylesUI.text}>• Overreaching</Text>
        </View>

        <Pressable style={stylesUI.button}>
          <Text style={stylesUI.buttonText}>Watch Demo</Text>
        </Pressable>

        <Pressable style={stylesUI.button}>
          <Text style={stylesUI.buttonText}>Start Practice</Text>
        </Pressable>

        <Pressable onPress={() => setScreen('moves')}>
          <Text style={stylesUI.back}>← Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return null;
}

const stylesUI = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101010',
    padding: 20,
  },
  content: {
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 20,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1b1b1b',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardSub: {
    color: '#aaa',
    marginTop: 4,
  },
  section: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  text: {
    color: '#ccc',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
  },
  back: {
    color: '#ff3b30',
    marginTop: 20,
    fontWeight: '700',
  },
});