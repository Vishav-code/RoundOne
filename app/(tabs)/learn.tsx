import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  QUESTION_TIME_LIMIT,
  QUESTIONS_PER_QUIZ,
  buildSession,
  calculateQuestionScore,
  getSessionRank,
  pickQuestions,
  type Question,
  type QuestionResult,
  type QuizSession,
} from '../../data/quizQuestions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_HEIGHT = 340;
const CARD_GAP = 16;
const SNAP_INTERVAL = CARD_HEIGHT + CARD_GAP;

type Tab = 'moves' | 'styles' | 'quiz';
type PracticePhase = 'idle' | 'active' | 'done';
type QuizPhase = 'idle' | 'question' | 'feedback' | 'results';

type Move = {
  id: string;
  name: string;
  type: 'Punch' | 'Kick';
  description: string;
  whatItIs: string;
  whenToUse: string[];
  commonMistakes: string[];
};

const MOVES: Move[] = [
  {
    id: '1',
    name: 'Jab',
    type: 'Punch',
    description: 'A quick, straight punch with your lead hand to gauge distance.',
    whatItIs:
      "The jab is your most important weapon — a straight punch thrown with the lead hand. It sets up every combo, controls range, and disrupts your opponent's rhythm without overcommitting.",
    whenToUse: [
      "Opening combos to gauge your opponent's reaction",
      'Controlling distance and keeping opponents at range',
      'Setting up the cross or a double jab combination',
      "Interrupting an opponent's forward pressure",
    ],
    commonMistakes: [
      'Dropping the rear hand while throwing',
      'Telegraphing by dipping the shoulder first',
      'Not resetting back to guard quickly',
      'Overreaching and losing your base',
    ],
  },
  {
    id: '2',
    name: 'Cross',
    type: 'Punch',
    description: 'A powerful straight punch with your rear hand, generating full body rotation.',
    whatItIs:
      'The cross is your power shot. Thrown with the rear hand, it uses full hip and shoulder rotation to generate maximum force. Usually lands as the "2" after a jab.',
    whenToUse: [
      'After a jab to create the classic 1-2 combination',
      "Countering when your opponent drops their guard",
      'Targeting an opponent who keeps walking forward',
      'Following up a parry or slip to the outside',
    ],
    commonMistakes: [
      'Letting the lead hand drop during the punch',
      'Not rotating the hips for full power',
      'Throwing without setting it up first',
      'Leaning too far forward and losing balance',
    ],
  },
  {
    id: '3',
    name: 'Hook',
    type: 'Punch',
    description: 'A lateral punch with a bent elbow targeting the head or body.',
    whatItIs:
      "The hook travels in a horizontal arc with the elbow bent at roughly 90°. It's designed to get around an opponent's guard and can target the head, ear, or body with devastating effect.",
    whenToUse: [
      'After the jab-cross to complete a 3-punch combo',
      'When an opponent is defending straight punches',
      'Targeting the body to slow down a pressure fighter',
      "In close range when there's no room for straight shots",
    ],
    commonMistakes: [
      'Winding up the arm and telegraphing',
      'Throwing with the arm only — no hip rotation',
      'Dropping the other hand during the throw',
      'Over-rotating and spinning off balance',
    ],
  },
  {
    id: '4',
    name: 'Uppercut',
    type: 'Punch',
    description: 'An upward punch targeting the chin from close range.',
    whatItIs:
      "The uppercut travels vertically upward, targeting the chin or solar plexus. It's a close-range weapon that's hardest to see coming and often ends fights when it connects cleanly.",
    whenToUse: [
      "When your opponent dips their head forward",
      'In a close-range exchange or clinch break',
      'After a body shot that makes them hunch over',
      'When they cover high and leave the body open',
    ],
    commonMistakes: [
      'Throwing from too far away — needs close range',
      'Dropping both hands as you load up',
      'Not bending the knees to generate upward drive',
      'Not rotating the shoulder into the punch',
    ],
  },
  {
    id: '5',
    name: 'Teep',
    type: 'Kick',
    description: 'A front push kick that controls distance and disrupts balance.',
    whatItIs:
      "The teep is Muay Thai's equivalent of the jab. It's a straight push kick thrown with the ball of the foot that keeps opponents at range, breaks their rhythm, and drains their energy over time.",
    whenToUse: [
      'Stopping a pressure fighter from getting inside',
      'Countering an incoming kick as they chamber',
      'Targeting the stomach to drain cardio',
      'Re-establishing range after a scramble',
    ],
    commonMistakes: [
      'Pushing instead of snapping — you lose power',
      'Not retracting the kick quickly enough',
      'Neglecting to return to fighting stance',
      'Telegraphing by dropping the hands first',
    ],
  },
  {
    id: '6',
    name: 'Low Kick',
    type: 'Kick',
    description: "A kick targeting the opponent's thigh to slow them down.",
    whatItIs:
      "The low kick strikes the outside of the opponent's thigh with the shin. Repeated low kicks damage leg muscles, disrupt footwork, and slow the opponent considerably by the later rounds.",
    whenToUse: [
      'When your opponent squares up or stands flat-footed',
      'After a combination to catch them while resetting',
      'As a counter when they throw a cross',
      'To slow down a fast, mobile opponent',
    ],
    commonMistakes: [
      'Kicking with the foot instead of the shin',
      'Not checking your guard while kicking',
      'Telegraphing by dropping the shoulder',
      'Bent knee at impact — loses power and risks injury',
    ],
  },
  {
    id: '7',
    name: 'Body Kick',
    type: 'Kick',
    description: 'A powerful roundhouse kick aimed at the ribs or midsection.',
    whatItIs:
      'The body kick targets the liver, ribs, or floating ribs with the shin. A clean liver kick can drop anyone regardless of size — it is one of the most decisive weapons in kickboxing.',
    whenToUse: [
      "When the opponent's arms are raised high to protect the head",
      'After a teep to set up the angle',
      "Countering a jab when they extend and open their ribs",
      "In later rounds when their guard starts to lower",
    ],
    commonMistakes: [
      'Kicking with the foot or ankle instead of the shin',
      'Not pivoting the planted foot — kills power and risks the knee',
      'Dropping the opposite hand as you kick',
      'Kicking flat-footed with no hip rotation',
    ],
  },
];

const FIGHTING_STYLES = [
  { name: 'Out-Fighter', description: 'Fights from range using jabs and footwork to control distance and avoid brawls.' },
  { name: 'Pressure Fighter', description: 'Constantly pushes forward, cutting off the ring and overwhelming opponents with volume.' },
  { name: 'Counter Striker', description: 'Waits for opponent mistakes then capitalizes with precise, powerful counters.' },
  { name: 'Kicker', description: 'Relies heavily on kicks to score and damage from mid-range, keeping punchers at bay.' },
];

const TAB_LABELS: Record<Tab, string> = {
  moves: 'Kicks & Punches',
  styles: 'Fighting Styles',
  quiz: 'Fight IQ Quiz',
};

const TARGET_OPTIONS = [10, 20, 30];

let introHasPlayed = false;

export default function LearnScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('moves');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(!introHasPlayed);
  const [carouselHeight, setCarouselHeight] = useState(500);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [practicePhase, setPracticePhase] = useState<PracticePhase>('idle');
  const [targetReps, setTargetReps] = useState(10);
  const [repCount, setRepCount] = useState(0);

  // Quiz state
  const [quizPhase, setQuizPhase]           = useState<QuizPhase>('idle');
  const [quizQuestions, setQuizQuestions]   = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx]         = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining]   = useState(QUESTION_TIME_LIMIT);
  const [session, setSession]               = useState<QuizSession | null>(null);
  const resultsAccum                        = useRef<QuestionResult[]>([]);
  const questionStartTime                   = useRef(0);
  const timerRef                            = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const introOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.4)).current;
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const detailSlide = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const repScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (introHasPlayed || !showIntro) return;
    introHasPlayed = true;

    Animated.parallel([
      Animated.timing(introOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(textScale, { toValue: 1, tension: 45, friction: 8, useNativeDriver: true }),
    ]).start();

    const makeRing = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );

    const r1 = makeRing(ring1, 0);
    const r2 = makeRing(ring2, 500);
    const r3 = makeRing(ring3, 1000);
    r1.start();
    r2.start();
    r3.start();

    const timer = setTimeout(() => {
      r1.stop();
      r2.stop();
      r3.stop();
      Animated.timing(introOpacity, { toValue: 0, duration: 550, useNativeDriver: true }).start(() =>
        setShowIntro(false)
      );
    }, 2500);

    return () => {
      clearTimeout(timer);
      r1.stop();
      r2.stop();
      r3.stop();
    };
  }, []);

  const openDetail = (move: Move) => {
    setSelectedMove(move);
    setPracticePhase('idle');
    setRepCount(0);
    setTargetReps(10);
    detailSlide.setValue(SCREEN_WIDTH);
    Animated.spring(detailSlide, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
  };

  const closeDetail = () => {
    Animated.timing(detailSlide, { toValue: SCREEN_WIDTH, duration: 260, useNativeDriver: true }).start(() => {
      setSelectedMove(null);
      setPracticePhase('idle');
      setRepCount(0);
    });
  };

  // ── Quiz timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (quizPhase !== 'question') return;
    setTimeRemaining(QUESTION_TIME_LIMIT);
    questionStartTime.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [quizPhase, currentIdx]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (quizPhase === 'question' && timeRemaining === 0) handleTimeUp();
  }, [timeRemaining]);

  // ── Quiz handlers ────────────────────────────────────────────────────────────
  const startQuiz = () => {
    const questions = pickQuestions();
    resultsAccum.current = [];
    setQuizQuestions(questions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setSession(null);
    setQuizPhase('question');
  };

  const submitAnswer = (optionIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const responseMs = Date.now() - questionStartTime.current;
    const q = quizQuestions[currentIdx];
    const correct = optionIndex === q.correct;
    const result: QuestionResult = {
      questionId: q.id,
      selectedOption: optionIndex,
      correct,
      responseMs,
      pointsEarned: calculateQuestionScore(correct, responseMs),
    };
    resultsAccum.current = [...resultsAccum.current, result];
    setSelectedOption(optionIndex);
    setQuizPhase('feedback');
  };

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const q = quizQuestions[currentIdx];
    const result: QuestionResult = {
      questionId: q.id,
      selectedOption: -1,
      correct: false,
      responseMs: QUESTION_TIME_LIMIT * 1000,
      pointsEarned: 0,
    };
    resultsAccum.current = [...resultsAccum.current, result];
    setSelectedOption(-1);
    setQuizPhase('feedback');
  };

  const goNext = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= quizQuestions.length) {
      const built = buildSession(resultsAccum.current);
      setSession(built);
      setQuizPhase('results');
    } else {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setQuizPhase('question');
    }
  };

  const resetQuiz = () => {
    setQuizPhase('idle');
    setCurrentIdx(0);
    setSelectedOption(null);
    setSession(null);
    resultsAccum.current = [];
  };

  const countRep = () => {
    const next = repCount + 1;
    setRepCount(next);
    Animated.sequence([
      Animated.spring(repScale, { toValue: 1.4, tension: 300, friction: 5, useNativeDriver: true }),
      Animated.spring(repScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    if (next >= targetReps) setPracticePhase('done');
  };

  const carouselPaddingV = Math.max(16, (carouselHeight - CARD_HEIGHT) / 2);

  const ringTransform = (anim: Animated.Value) => ({
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 3.2] }) }],
    opacity: anim.interpolate({ inputRange: [0, 0.12, 0.75, 1], outputRange: [0, 0.65, 0.2, 0] }),
  });

  return (
    <View style={styles.page}>
      <Text style={styles.pageTitle}>Learn</Text>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['moves', 'styles', 'quiz'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              numberOfLines={1}
            >
              {TAB_LABELS[tab]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Kicks & Punches — vertical snap carousel */}
      {activeTab === 'moves' && (
        <View
          style={styles.carouselContainer}
          onLayout={(e) => setCarouselHeight(e.nativeEvent.layout.height)}
        >
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingVertical: carouselPaddingV, alignItems: 'center' }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.y / SNAP_INTERVAL);
              setActiveIndex(Math.max(0, Math.min(index, MOVES.length - 1)));
            }}
          >
            {MOVES.map((move, index) => {
              const inputRange = [
                (index - 1) * SNAP_INTERVAL,
                index * SNAP_INTERVAL,
                (index + 1) * SNAP_INTERVAL,
              ];
              const scale = scrollY.interpolate({ inputRange, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
              const opacity = scrollY.interpolate({ inputRange, outputRange: [0.45, 1, 0.45], extrapolate: 'clamp' });

              return (
                <Pressable key={move.id} onPress={() => openDetail(move)}>
                  <Animated.View
                    style={[
                      styles.moveCard,
                      { transform: [{ scale }], opacity },
                      index < MOVES.length - 1 && { marginBottom: CARD_GAP },
                    ]}
                  >
                    <View style={styles.animArea}>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{move.type.toUpperCase()}</Text>
                      </View>
                      <View style={styles.animFrame}>
                        <Text style={styles.animFrameLabel}>Animation</Text>
                        <Text style={styles.animFrameSub}>placeholder</Text>
                      </View>
                      <View style={styles.tapHint}>
                        <Text style={styles.tapHintText}>TAP TO OPEN</Text>
                      </View>
                    </View>
                    <View style={styles.moveInfo}>
                      <Text style={styles.moveName}>{move.name}</Text>
                      <Text style={styles.moveDesc}>{move.description}</Text>
                    </View>
                  </Animated.View>
                </Pressable>
              );
            })}
          </Animated.ScrollView>

          <View style={styles.dotsColumn}>
            {MOVES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Fighting Styles */}
      {activeTab === 'styles' && (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {FIGHTING_STYLES.map((style) => (
            <View key={style.name} style={styles.styleCard}>
              <Text style={styles.styleCardTitle}>{style.name}</Text>
              <Text style={styles.styleCardDesc}>{style.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Fight IQ Quiz ── */}
      {activeTab === 'quiz' && (
        <View style={styles.quizContainer}>

          {/* IDLE */}
          {quizPhase === 'idle' && (
            <View style={styles.quizCenter}>
              <View style={styles.quizIconBox}>
                <Text style={styles.quizIconText}>?</Text>
              </View>
              <Text style={styles.quizTitle}>Fight IQ Quiz</Text>
              <Text style={styles.quizSub}>
                10 questions · 15 s each{'\n'}Correct + fast = more points
              </Text>
              {session && (
                <View style={styles.lastSessionBox}>
                  <Text style={styles.lastSessionLabel}>LAST SESSION</Text>
                  <Text style={[styles.lastSessionRank, { color: getSessionRank(session.totalScore).color }]}>
                    {getSessionRank(session.totalScore).label}
                  </Text>
                  <Text style={styles.lastSessionScore}>{session.totalScore} pts</Text>
                </View>
              )}
              <Pressable style={styles.startQuizBtn} onPress={startQuiz}>
                <Text style={styles.startQuizBtnText}>Start Quiz</Text>
              </Pressable>
            </View>
          )}

          {/* QUESTION + FEEDBACK share the same card layout */}
          {(quizPhase === 'question' || quizPhase === 'feedback') && quizQuestions.length > 0 && (() => {
            const q = quizQuestions[currentIdx];
            const totalPts = resultsAccum.current.reduce((s, r) => s + r.pointsEarned, 0);
            const timerPct = timeRemaining / QUESTION_TIME_LIMIT;
            const timerColor = timerPct > 0.6 ? '#4ade80' : timerPct > 0.3 ? '#facc15' : '#ff3b30';
            const LABELS = ['A', 'B', 'C', 'D'];
            return (
              <View style={styles.quizQuestionWrap}>
                {/* Progress + score row */}
                <View style={styles.qProgressRow}>
                  <Text style={styles.qProgressText}>
                    Q {currentIdx + 1} / {quizQuestions.length}
                  </Text>
                  <Text style={styles.qScoreText}>{totalPts} pts</Text>
                </View>

                {/* Timer bar */}
                <View style={styles.timerBarBg}>
                  <View style={[styles.timerBarFill, {
                    width: `${timerPct * 100}%` as any,
                    backgroundColor: timerColor,
                  }]} />
                </View>

                {/* Question prompt */}
                <ScrollView
                  style={styles.qScrollArea}
                  contentContainerStyle={styles.qScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.qPrompt}>{q.prompt}</Text>

                  {/* Answer options */}
                  {q.options.map((option, i) => {
                    let btnStyle = styles.optionBtn;
                    let labelStyle = styles.optionLabel;
                    let textStyle = styles.optionText;
                    if (quizPhase === 'feedback') {
                      if (i === q.correct) {
                        btnStyle = { ...styles.optionBtn, ...styles.optionCorrect } as any;
                        labelStyle = { ...styles.optionLabel, ...styles.optionLabelCorrect } as any;
                      } else if (i === selectedOption && selectedOption !== q.correct) {
                        btnStyle = { ...styles.optionBtn, ...styles.optionWrong } as any;
                        labelStyle = { ...styles.optionLabel, ...styles.optionLabelWrong } as any;
                      } else {
                        textStyle = { ...styles.optionText, color: '#333' } as any;
                      }
                    }
                    return (
                      <Pressable
                        key={i}
                        style={btnStyle}
                        onPress={() => quizPhase === 'question' && submitAnswer(i)}
                        disabled={quizPhase === 'feedback'}
                      >
                        <View style={labelStyle}>
                          <Text style={styles.optionLabelText}>{LABELS[i]}</Text>
                        </View>
                        <Text style={[textStyle, { flex: 1 }]}>{option}</Text>
                      </Pressable>
                    );
                  })}

                  {/* Feedback explanation */}
                  {quizPhase === 'feedback' && (
                    <View style={styles.explanationBox}>
                      {selectedOption === -1 ? (
                        <Text style={styles.explanationTitle}>⏱ Time's up!</Text>
                      ) : selectedOption === q.correct ? (
                        <Text style={[styles.explanationTitle, { color: '#4ade80' }]}>
                          ✓ Correct  +{resultsAccum.current[resultsAccum.current.length - 1]?.pointsEarned} pts
                        </Text>
                      ) : (
                        <Text style={[styles.explanationTitle, { color: '#ff3b30' }]}>✕ Wrong</Text>
                      )}
                      <Text style={styles.explanationBody}>{q.explanation}</Text>
                      <Pressable style={styles.nextBtn} onPress={goNext}>
                        <Text style={styles.nextBtnText}>
                          {currentIdx + 1 >= quizQuestions.length ? 'See Results' : 'Next →'}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </ScrollView>
              </View>
            );
          })()}

          {/* RESULTS */}
          {quizPhase === 'results' && session && (() => {
            const rank = getSessionRank(session.totalScore);
            const correct = session.questions.filter(r => r.correct).length;
            const avgSec = (session.avgResponseMs / 1000).toFixed(1);
            return (
              <ScrollView contentContainerStyle={styles.resultsScroll} showsVerticalScrollIndicator={false}>
                {/* Rank badge */}
                <View style={[styles.rankBadge, { borderColor: rank.color }]}>
                  <Text style={[styles.rankLabel, { color: rank.color }]}>{rank.label.toUpperCase()}</Text>
                  <Text style={styles.rankScore}>{session.totalScore}</Text>
                  <Text style={styles.rankScoreLabel}>points</Text>
                </View>

                {/* Stats row */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{correct}/{session.questions.length}</Text>
                    <Text style={styles.statLabel}>Correct</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{Math.round(session.accuracy * 100)}%</Text>
                    <Text style={styles.statLabel}>Accuracy</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{avgSec}s</Text>
                    <Text style={styles.statLabel}>Avg speed</Text>
                  </View>
                </View>

                {/* Per-question breakdown */}
                <Text style={styles.breakdownHeader}>QUESTION BREAKDOWN</Text>
                {session.questions.map((r, i) => (
                  <View key={i} style={styles.breakdownRow}>
                    <View style={[styles.breakdownDot, { backgroundColor: r.correct ? '#4ade80' : '#ff3b30' }]} />
                    <Text style={styles.breakdownQ} numberOfLines={1}>
                      {quizQuestions[i]?.prompt ?? `Q${i + 1}`}
                    </Text>
                    <Text style={[styles.breakdownPts, { color: r.correct ? '#4ade80' : '#555' }]}>
                      +{r.pointsEarned}
                    </Text>
                  </View>
                ))}

                {/* Actions */}
                <View style={styles.resultActions}>
                  <Pressable style={styles.playAgainBtn} onPress={startQuiz}>
                    <Text style={styles.playAgainText}>Play Again</Text>
                  </Pressable>
                  <Pressable style={styles.leaderboardBtn}>
                    <Text style={styles.leaderboardText}>Leaderboard (soon)</Text>
                  </Pressable>
                </View>
              </ScrollView>
            );
          })()}

        </View>
      )}

      {/* ── Detail overlay ── */}
      {selectedMove && (
        <Animated.View style={[styles.detailOverlay, { transform: [{ translateX: detailSlide }] }]}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <Pressable onPress={closeDetail} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Back</Text>
            </Pressable>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{selectedMove.type.toUpperCase()}</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailScroll}>
            {/* Demo area */}
            <View style={styles.detailAnimArea}>
              <View style={styles.detailAnimFrame}>
                <Text style={styles.detailAnimLabel}>Demo Animation</Text>
                <Text style={styles.detailAnimSub}>placeholder</Text>
              </View>
              <Pressable style={styles.playBtn}>
                <Text style={styles.playBtnText}>▶  Play Demo</Text>
              </Pressable>
            </View>

            {/* Move name */}
            <Text style={styles.detailTitle}>{selectedMove.name}</Text>

            {/* — What it is — */}
            <View style={styles.coachBlock}>
              <Text style={styles.coachLabel}>WHAT IT IS</Text>
              <View style={styles.coachDivider} />
              <Text style={styles.coachBody}>{selectedMove.whatItIs}</Text>
            </View>

            {/* — When to use — */}
            <View style={styles.coachBlock}>
              <Text style={styles.coachLabel}>WHEN TO USE</Text>
              <View style={styles.coachDivider} />
              {selectedMove.whenToUse.map((point, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>

            {/* — Common mistakes — */}
            <View style={styles.coachBlock}>
              <Text style={[styles.coachLabel, { color: '#ff3b30' }]}>COMMON MISTAKES</Text>
              <View style={[styles.coachDivider, { backgroundColor: '#ff3b30' }]} />
              {selectedMove.commonMistakes.map((mistake, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.mistakeCross}>✕</Text>
                  <Text style={styles.bulletText}>{mistake}</Text>
                </View>
              ))}
            </View>

            {/* — Practice flow — */}
            <View style={styles.practiceBlock}>
              <Text style={styles.coachLabel}>PRACTICE</Text>
              <View style={styles.coachDivider} />

              {practicePhase === 'idle' && (
                <>
                  <Text style={styles.practiceSubLabel}>Select target reps</Text>
                  <View style={styles.targetRow}>
                    {TARGET_OPTIONS.map((t) => (
                      <Pressable
                        key={t}
                        style={[styles.targetPill, targetReps === t && styles.targetPillActive]}
                        onPress={() => setTargetReps(t)}
                      >
                        <Text style={[styles.targetPillText, targetReps === t && styles.targetPillTextActive]}>
                          {t}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  <Pressable style={styles.startBtn} onPress={() => setPracticePhase('active')}>
                    <Text style={styles.startBtnText}>Start Practice</Text>
                  </Pressable>
                </>
              )}

              {practicePhase === 'active' && (
                <>
                  <View style={styles.counterRow}>
                    <Animated.Text style={[styles.repNumber, { transform: [{ scale: repScale }] }]}>
                      {repCount}
                    </Animated.Text>
                    <Text style={styles.repTarget}> / {targetReps}</Text>
                  </View>
                  <View style={styles.repBarBg}>
                    <View style={[styles.repBarFill, { width: `${(repCount / targetReps) * 100}%` as any }]} />
                  </View>
                  <Pressable style={styles.tapBtn} onPress={countRep}>
                    <Text style={styles.tapBtnText}>TAP — REP DONE</Text>
                  </Pressable>
                  <Pressable onPress={() => { setPracticePhase('idle'); setRepCount(0); }}>
                    <Text style={styles.stopLink}>Stop session</Text>
                  </Pressable>
                </>
              )}

              {practicePhase === 'done' && (
                <>
                  <View style={styles.doneBox}>
                    <Text style={styles.doneCheck}>✓</Text>
                    <Text style={styles.doneTitle}>Set Complete!</Text>
                    <Text style={styles.doneSub}>{targetReps} reps of {selectedMove.name}</Text>
                  </View>
                  <View style={styles.doneActions}>
                    <Pressable
                      style={styles.againBtn}
                      onPress={() => { setRepCount(0); setPracticePhase('active'); }}
                    >
                      <Text style={styles.againBtnText}>Go Again</Text>
                    </Pressable>
                    <Pressable
                      style={styles.doneBtn}
                      onPress={() => { setRepCount(0); setPracticePhase('idle'); }}
                    >
                      <Text style={styles.doneBtnText}>Done</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* Intro overlay — always on top */}
      {showIntro && (
        <Animated.View style={[styles.introOverlay, { opacity: introOpacity }]}>
          <View style={styles.ringsAnchor}>
            <View style={{ width: 0, height: 0 }}>
              {[ring1, ring2, ring3].map((anim, i) => (
                <Animated.View key={i} style={[styles.ring, ringTransform(anim)]} />
              ))}
            </View>
          </View>
          <Animated.Text style={[styles.introTitle, { transform: [{ scale: textScale }] }]}>
            LEARN
          </Animated.Text>
          <Text style={styles.introSub}>Your fight education starts here</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101010',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
    paddingHorizontal: 4,
  },
  tabActive: { backgroundColor: '#ff3b30' },
  tabText: { color: '#666', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  tabTextActive: { color: '#fff' },
  // Carousel
  carouselContainer: { flex: 1 },
  moveCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#252525',
  },
  animArea: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  typeBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  typeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  animFrame: {
    width: 110,
    height: 110,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animFrameLabel: { color: '#3a3a3a', fontSize: 13, fontWeight: '600' },
  animFrameSub: { color: '#2a2a2a', fontSize: 11 },
  tapHint: { marginTop: 14 },
  tapHintText: { color: '#333', fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  moveInfo: { padding: 16, paddingBottom: 12 },
  moveName: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  moveDesc: { color: '#777', fontSize: 13, lineHeight: 18 },
  // Side dots
  dotsColumn: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: { width: 6, borderRadius: 3 },
  dotActive: { height: 20, backgroundColor: '#ff3b30' },
  dotInactive: { height: 6, backgroundColor: '#333' },
  // Fighting styles
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  styleCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#252525',
  },
  styleCardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  styleCardDesc: { color: '#777', fontSize: 14, lineHeight: 20 },
  // Quiz
  quizCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  quizIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quizIconText: { color: '#ff3b30', fontSize: 36, fontWeight: '800' },
  quizTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 10 },
  quizSub: { color: '#555', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  // Detail overlay
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#101010',
    zIndex: 50,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  backBtn: { paddingVertical: 6, paddingRight: 16 },
  backBtnText: { color: '#ff3b30', fontSize: 16, fontWeight: '700' },
  detailScroll: { paddingBottom: 60 },
  detailAnimArea: {
    height: 220,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1e1e1e',
    marginBottom: 24,
  },
  detailAnimFrame: {
    width: 130,
    height: 130,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailAnimLabel: { color: '#3a3a3a', fontSize: 14, fontWeight: '600' },
  detailAnimSub: { color: '#2a2a2a', fontSize: 12 },
  playBtn: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#ff3b30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
  },
  playBtnText: { color: '#ff3b30', fontSize: 14, fontWeight: '700' },
  detailTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  // Coaching blocks
  coachBlock: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  coachLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  coachDivider: {
    height: 1,
    backgroundColor: '#222',
    marginBottom: 14,
  },
  coachBody: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3b30',
    marginTop: 7,
  },
  bulletText: { color: '#ccc', fontSize: 14, lineHeight: 22, flex: 1 },
  mistakeCross: { color: '#ff3b30', fontSize: 14, fontWeight: '800', marginTop: 2 },
  // Practice block
  practiceBlock: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  practiceSubLabel: {
    color: '#555',
    fontSize: 13,
    marginBottom: 14,
  },
  targetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  targetPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    backgroundColor: '#1a1a1a',
  },
  targetPillActive: { backgroundColor: '#ff3b30', borderColor: '#ff3b30' },
  targetPillText: { color: '#555', fontSize: 16, fontWeight: '700' },
  targetPillTextActive: { color: '#fff' },
  startBtn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  // Active practice
  counterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  repNumber: { color: '#fff', fontSize: 80, fontWeight: '900', lineHeight: 88 },
  repTarget: { color: '#444', fontSize: 28, fontWeight: '700', paddingBottom: 10 },
  repBarBg: {
    height: 4,
    backgroundColor: '#1e1e1e',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  repBarFill: { height: 4, backgroundColor: '#ff3b30', borderRadius: 2 },
  tapBtn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 22,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  tapBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
  stopLink: { color: '#444', fontSize: 13, textAlign: 'center', fontWeight: '600' },
  // Done state
  doneBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  doneCheck: { color: '#ff3b30', fontSize: 52, fontWeight: '900', marginBottom: 8 },
  doneTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6 },
  doneSub: { color: '#555', fontSize: 15 },
  doneActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  againBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ff3b30',
    alignItems: 'center',
  },
  againBtnText: { color: '#ff3b30', fontSize: 15, fontWeight: '800' },
  doneBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  // Intro overlay
  introOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  ringsAnchor: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: '#ff3b30',
    top: -110,
    left: -110,
  },
  introTitle: {
    color: '#fff',
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 14,
    textAlign: 'center',
  },
  introSub: { color: '#444', fontSize: 14, marginTop: 14, letterSpacing: 0.5 },

  // ── Quiz ──────────────────────────────────────────────────────────────────
  quizContainer: { flex: 1 },

  // idle
  lastSessionBox: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
    width: '100%',
  },
  lastSessionLabel: { color: '#555', fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  lastSessionRank:  { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  lastSessionScore: { color: '#555', fontSize: 13 },
  startQuizBtn: {
    marginTop: 28,
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  startQuizBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  // question / feedback
  quizQuestionWrap: { flex: 1, paddingTop: 4 },
  qProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  qProgressText: { color: '#555', fontSize: 13, fontWeight: '700' },
  qScoreText:    { color: '#ff3b30', fontSize: 13, fontWeight: '800' },
  timerBarBg: {
    height: 4,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  timerBarFill: { height: 4, borderRadius: 2 },
  qScrollArea:   { flex: 1 },
  qScrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  qPrompt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 24,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#252525',
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  optionCorrect: { borderColor: '#4ade80', backgroundColor: '#0d2218' },
  optionWrong:   { borderColor: '#ff3b30', backgroundColor: '#200d0d' },
  optionLabel: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelCorrect: { backgroundColor: '#4ade80' },
  optionLabelWrong:   { backgroundColor: '#ff3b30' },
  optionLabelText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  optionText: { color: '#ccc', fontSize: 14, lineHeight: 20 },

  // explanation
  explanationBox: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#252525',
  },
  explanationTitle: { fontSize: 16, fontWeight: '800', marginBottom: 10 },
  explanationBody:  { color: '#888', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  nextBtn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // results
  resultsScroll: { paddingHorizontal: 20, paddingBottom: 50, alignItems: 'center' },
  rankBadge: {
    marginTop: 16,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141414',
    marginBottom: 28,
  },
  rankLabel:      { fontSize: 11, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
  rankScore:      { color: '#fff', fontSize: 48, fontWeight: '900', lineHeight: 52 },
  rankScoreLabel: { color: '#555', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252525',
    padding: 20,
    width: '100%',
    marginBottom: 28,
  },
  statBox:     { flex: 1, alignItems: 'center' },
  statValue:   { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  statLabel:   { color: '#555', fontSize: 11, fontWeight: '600' },
  statDivider: { width: 1, backgroundColor: '#252525', marginHorizontal: 4 },

  // breakdown
  breakdownHeader: {
    color: '#444',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    gap: 10,
  },
  breakdownDot: { width: 8, height: 8, borderRadius: 4 },
  breakdownQ:   { color: '#666', fontSize: 13, flex: 1 },
  breakdownPts: { fontSize: 13, fontWeight: '700' },

  // result actions
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 28, width: '100%' },
  playAgainBtn: {
    flex: 1,
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  playAgainText:    { color: '#fff', fontSize: 15, fontWeight: '800' },
  leaderboardBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  leaderboardText: { color: '#444', fontSize: 13, fontWeight: '700' },
});
