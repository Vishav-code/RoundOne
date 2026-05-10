import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

type Prompt = {
  attack: string;
  reaction: string;
};

const punchPrompts: Prompt[] = [
  { attack: 'Jab Incoming', reaction: 'Slip Right' },
  { attack: 'Cross Incoming', reaction: 'Slip Left' },
  { attack: 'Hook Incoming', reaction: 'Block High' },
  { attack: 'Straight Incoming', reaction: 'Duck' },
];

export default function SparScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [prompt, setPrompt] = useState<Prompt>(punchPrompts[0]);
  const [feedback, setFeedback] = useState('Get ready');
  const [correct, setCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const maxRounds = difficulty === 'Easy' ? 6 : difficulty === 'Medium' ? 8 : 10;
  const reactionTime = difficulty === 'Easy' ? 2.5 : difficulty === 'Medium' ? 1.7 : 1.0;

  useEffect(() => {
    if (!started) return;

    setTimeLeft(reactionTime);
    setFeedback('React now');

    const countdown = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, Number((prev - 0.1).toFixed(1))));
    }, 100);

    const timer = setTimeout(() => {
      checkReactionAutomatically();
      clearInterval(countdown);
    }, reactionTime * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, [round, started]);

  function checkReactionAutomatically() {
    let success = false;

    if (prompt.reaction === 'Slip Left') success = detectSlipLeft();
    if (prompt.reaction === 'Slip Right') success = detectSlipRight();
    if (prompt.reaction === 'Duck') success = detectDuck();
    if (prompt.reaction === 'Block High') success = detectHighBlock();

    setCorrect(success);
    setFeedback(success ? 'Good reaction' : `Hit — needed ${prompt.reaction}`);

    if (success) setScore((prev) => prev + 10);

    setTimeout(() => {
      if (round >= maxRounds) {
        setStarted(false);
        setFinished(true);
        return;
      }

      const next = punchPrompts[Math.floor(Math.random() * punchPrompts.length)];
      setPrompt(next);
      setRound((prev) => prev + 1);
      setCorrect(false);
    }, 900);
  }

  // Placeholder tracking functions
  // Next step: replace these with real camera pose data
  function detectSlipLeft() {
    return Math.random() > 0.35;
  }

  function detectSlipRight() {
    return Math.random() > 0.35;
  }

  function detectDuck() {
    return Math.random() > 0.35;
  }

  function detectHighBlock() {
    return Math.random() > 0.35;
  }

  function startSpar() {
    setRound(1);
    setScore(0);
    setPrompt(punchPrompts[0]);
    setFeedback('Get ready');
    setCorrect(false);
    setFinished(false);
    setStarted(true);
  }

  if (!permission) return <View style={styles.page} />;

  if (!permission.granted) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Camera Access Needed</Text>
        <Text style={styles.subtitle}>Virtual Spar needs camera access.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.page}>
        <Text style={styles.appName}>AI Kickboxing Coach</Text>
        <Text style={styles.title}>Spar Complete</Text>

        <View style={styles.card}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.subtitle}>Final Score</Text>
          <Text style={styles.text}>Difficulty: {difficulty}</Text>
          <Text style={styles.text}>Rounds: {maxRounds}</Text>
          <Text style={styles.text}>Tip: Move early, reset fast, keep your guard high.</Text>
        </View>

        <Pressable style={styles.button} onPress={startSpar}>
          <Text style={styles.buttonText}>Run It Back</Text>
        </Pressable>
      </View>
    );
  }

  if (started) {
    return (
      <View style={styles.cameraPage}>
        <CameraView style={styles.camera} facing="front" />

        <View style={styles.overlay}>
          <View style={styles.hud}>
            <Text style={styles.hudText}>Round {round}/{maxRounds}</Text>
            <Text style={styles.hudText}>Score {score}</Text>
          </View>

          <View style={styles.promptBox}>
            <Text style={styles.attack}>{prompt.attack}</Text>
            <Text style={styles.reaction}>{prompt.reaction}</Text>
            <Text style={styles.timer}>{timeLeft.toFixed(1)}s</Text>
          </View>

          <View style={[styles.target, correct ? styles.green : styles.red]}>
            <Text style={styles.targetText}>{correct ? '✓' : '!'}</Text>
          </View>

          <Text style={styles.feedback}>{feedback}</Text>

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
        Punch-only reaction sparring. The app automatically checks if you react in time.
      </Text>

      <Text style={styles.sectionTitle}>Choose Difficulty</Text>

      <View style={styles.row}>
        {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
          <Pressable
            key={level}
            style={[styles.smallOption, difficulty === level && styles.selected]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={styles.optionText}>{level}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button} onPress={startSpar}>
        <Text style={styles.buttonText}>Start Spar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#101010', padding: 20 },
  cameraPage: { flex: 1, backgroundColor: '#101010' },
  appName: { color: '#ff3b30', fontSize: 16, fontWeight: '700', marginTop: 30, marginBottom: 8 },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 16, marginBottom: 20, lineHeight: 22 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 14, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  smallOption: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  selected: { backgroundColor: '#ff3b30', borderColor: '#ff3b30' },
  optionText: { color: '#fff', fontWeight: '700' },
  button: { backgroundColor: '#ff3b30', padding: 17, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryText: { color: '#fff', fontWeight: '700' },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 35,
  },
  hud: { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  hudText: {
    color: '#fff',
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 12,
  },
  promptBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  attack: { color: '#fff', fontSize: 28, fontWeight: '900' },
  reaction: { color: '#ff3b30', fontSize: 22, fontWeight: '800', marginTop: 6 },
  timer: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 8 },
  target: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  red: { borderColor: '#ff3b30', backgroundColor: 'rgba(255,59,48,0.18)' },
  green: { borderColor: '#34c759', backgroundColor: 'rgba(52,199,89,0.2)' },
  targetText: { color: '#fff', fontSize: 46, fontWeight: '900' },
  feedback: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  score: { color: '#ff3b30', fontSize: 60, fontWeight: '900' },
  text: { color: '#ccc', fontSize: 16, marginBottom: 8 },
});