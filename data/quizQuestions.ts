// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionStyle = 'out-fighter' | 'pressure' | 'counter' | 'kicker' | 'general';

export type Question = {
  id: string;
  style: QuestionStyle;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
};

export type QuestionResult = {
  questionId: string;
  selectedOption: number; // -1 = time expired
  correct: boolean;
  responseMs: number;
  pointsEarned: number;
};

// Future-proof for backend: POST this object as-is when auth is added.
// Server re-derives totalScore from questions[] to prevent tampering.
export type QuizSession = {
  sessionId: string;
  userId: string | null; // null until auth is wired up
  completedAt: number;   // unix ms
  questions: QuestionResult[];
  totalScore: number;
  accuracy: number;      // 0–1
  avgResponseMs: number;
  rank: string;
};

// ─── Scoring ──────────────────────────────────────────────────────────────────

export const QUESTION_TIME_LIMIT = 15; // seconds per question
export const QUESTIONS_PER_QUIZ = 10;

export const calculateQuestionScore = (correct: boolean, responseMs: number): number => {
  if (!correct) return 0;
  const secondsTaken = Math.min(responseMs / 1000, QUESTION_TIME_LIMIT);
  const timeBonus = Math.max(0, Math.floor(50 * (1 - secondsTaken / QUESTION_TIME_LIMIT)));
  return 100 + timeBonus;
};

// ─── Ranks ────────────────────────────────────────────────────────────────────

export type Rank = { label: string; minScore: number; color: string };

export const RANKS: Rank[] = [
  { label: 'Amateur',    minScore: 0,    color: '#666666' },
  { label: 'Contender', minScore: 300,  color: '#a0855b' },
  { label: 'Prospect',  minScore: 600,  color: '#7cb9e8' },
  { label: 'Champion',  minScore: 850,  color: '#c0c0c0' },
  { label: 'Elite',     minScore: 1100, color: '#ffd700' },
  { label: 'Legend',    minScore: 1350, color: '#ff3b30' },
];

export const getSessionRank = (score: number): Rank => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].minScore) return RANKS[i];
  }
  return RANKS[0];
};

// ─── Session builder ──────────────────────────────────────────────────────────

export const buildSession = (results: QuestionResult[]): QuizSession => {
  const totalScore = results.reduce((s, r) => s + r.pointsEarned, 0);
  const correct    = results.filter(r => r.correct).length;
  const avgResponseMs = results.reduce((s, r) => s + r.responseMs, 0) / results.length;
  return {
    sessionId:    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId:       null,
    completedAt:  Date.now(),
    questions:    results,
    totalScore,
    accuracy:     correct / results.length,
    avgResponseMs,
    rank:         getSessionRank(totalScore).label,
  };
};

// ─── Randomiser ───────────────────────────────────────────────────────────────

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Picks 2 from each style + 2 general = 10, then shuffles the selection.
export const pickQuestions = (): Question[] => {
  const styles: QuestionStyle[] = ['out-fighter', 'pressure', 'counter', 'kicker', 'general'];
  const selected = styles.flatMap(style =>
    shuffle(QUESTIONS.filter(q => q.style === style)).slice(0, 2)
  );
  return shuffle(selected);
};

// ─── Dataset ──────────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [

  // ── General (10) ─────────────────────────────────────────────────────────

  {
    id: 'g1',
    style: 'general',
    difficulty: 'easy',
    prompt: "What's the primary purpose of the jab?",
    options: [
      'To knock out the opponent',
      'To control distance and set up combinations',
      'To score points with power',
      'To protect the body',
    ],
    correct: 1,
    explanation: "The jab controls range, gauges distance, disrupts timing, and sets up every combination — it's not a power shot.",
  },
  {
    id: 'g2',
    style: 'general',
    difficulty: 'easy',
    prompt: 'What does "cutting off the ring" mean?',
    options: [
      'Running away from your opponent',
      'Standing in the corner to recover',
      'Moving to limit your opponent\'s escape routes',
      'Clinching to stop movement',
    ],
    correct: 2,
    explanation: 'Cutting off the ring means using angles and diagonal movement to prevent your opponent from circling away, forcing them to engage.',
  },
  {
    id: 'g3',
    style: 'general',
    difficulty: 'easy',
    prompt: 'What does "southpaw" refer to?',
    options: [
      'A fighter who only throws kicks',
      'A left-handed fighter with their right foot forward',
      'A fighter who always circles to the left',
      'A defensive specialist style',
    ],
    correct: 1,
    explanation: 'A southpaw leads with their right hand and holds their power left hand in the rear — the mirror image of an orthodox stance.',
  },
  {
    id: 'g4',
    style: 'general',
    difficulty: 'medium',
    prompt: 'What is a "check" in kickboxing?',
    options: [
      'A straight punch to the body',
      'Raising your knee to intercept an incoming leg kick',
      'A takedown defence',
      'Stopping a jab with your palm',
    ],
    correct: 1,
    explanation: 'Checking a kick means lifting your shin to meet the incoming kick, damaging the attacker\'s shin and protecting your own leg.',
  },
  {
    id: 'g5',
    style: 'general',
    difficulty: 'medium',
    prompt: "What's the role of feints in fighting?",
    options: [
      'To waste the opponent\'s energy',
      'To signal your real attack and time it better',
      'To make your opponent react and create openings',
      'To slow down the pace of the fight',
    ],
    correct: 2,
    explanation: 'Feints trick your opponent into reacting — dropping their guard, flinching, or shifting weight — creating the opening for a real strike.',
  },
  {
    id: 'g6',
    style: 'general',
    difficulty: 'easy',
    prompt: "What's the safest default guard position?",
    options: [
      'Both hands at your sides',
      'High guard with both hands protecting the temples',
      'Lead hand extended at all times',
      'Hands resting on your hips',
    ],
    correct: 1,
    explanation: 'The high guard keeps both hands close to the head, protecting against hooks and crosses while allowing quick returns.',
  },
  {
    id: 'g7',
    style: 'general',
    difficulty: 'medium',
    prompt: "What's the best time to land a body kick?",
    options: [
      'While your opponent is fresh and alert',
      'When their arm is extended or raised, exposing the ribs',
      'As an opening move every round',
      'Only when fighting from a southpaw stance',
    ],
    correct: 1,
    explanation: "A body kick lands cleanest when the opponent's arm is extended from throwing a punch, temporarily exposing the ribs.",
  },
  {
    id: 'g8',
    style: 'general',
    difficulty: 'easy',
    prompt: "What's the primary purpose of footwork?",
    options: [
      'To tire the opponent out',
      'To look impressive to the judges',
      'To control range, angles, and balance',
      "To stay out of the referee's way",
    ],
    correct: 2,
    explanation: "Good footwork controls the distance you fight at, creates angles for attack, and keeps you balanced — it's the foundation of everything.",
  },
  {
    id: 'g9',
    style: 'general',
    difficulty: 'medium',
    prompt: 'Which punch is hardest to see coming?',
    options: [
      'The jab — it\'s the fastest',
      'The overhand right — it travels furthest',
      'The uppercut — it travels upward from outside the sightline',
      'The hook — it\'s the most powerful',
    ],
    correct: 2,
    explanation: "The uppercut travels upward and is largely hidden beneath the opponent's field of vision, making it one of the hardest punches to pick up.",
  },
  {
    id: 'g10',
    style: 'general',
    difficulty: 'hard',
    prompt: 'What does "reading your opponent" mean in a fight?',
    options: [
      'Watching their training videos beforehand',
      'Counting their punches to judge their pace',
      'Recognising their patterns and tells in real time to exploit them',
      'Asking their trainer about their game plan',
    ],
    correct: 2,
    explanation: "Reading your opponent means identifying their habits — tells before a punch, reactions to pressure, go-to combinations — and exploiting that knowledge mid-fight.",
  },

  // ── Out-fighter (8) ───────────────────────────────────────────────────────

  {
    id: 'of1',
    style: 'out-fighter',
    difficulty: 'easy',
    prompt: "What's the primary weapon of an out-fighter?",
    options: [
      'The overhand right',
      'Body hooks at close range',
      'The jab used to control distance',
      'Leg kicks from mid-range',
    ],
    correct: 2,
    explanation: 'The out-fighter relies on the jab to control distance, disrupt rhythm, and set up the cross — without it, the whole style falls apart.',
  },
  {
    id: 'of2',
    style: 'out-fighter',
    difficulty: 'medium',
    prompt: 'A pressure fighter is closing the distance fast. What should an out-fighter do?',
    options: [
      'Stand and trade punches',
      'Clinch immediately',
      'Use lateral movement and the teep to reset the range',
      'Drop to a low stance and swing for the body',
    ],
    correct: 2,
    explanation: 'The teep pushes the pressure fighter back out to range, and lateral movement stops them from cutting the ring — two tools essential for keeping the fight long.',
  },
  {
    id: 'of3',
    style: 'out-fighter',
    difficulty: 'medium',
    prompt: "What's the biggest vulnerability of an out-fighter?",
    options: [
      'Throwing too much power too early',
      'Getting trapped on the ropes and forced into close range',
      'Throwing too many kicks',
      'Overusing the cross',
    ],
    correct: 1,
    explanation: "Once an out-fighter is pinned on the ropes or in the corner, they can't use their footwork advantage — the skill that makes their whole style work.",
  },
  {
    id: 'of4',
    style: 'out-fighter',
    difficulty: 'medium',
    prompt: 'Which combination best suits an out-fighter?',
    options: [
      'Hook-uppercut-hook',
      'Jab-cross-pivot to create an angle',
      'Low kick-low kick-low kick',
      'Overhand right-clinch',
    ],
    correct: 1,
    explanation: 'The jab-cross-pivot creates a new angle after the exchange, letting the out-fighter avoid the counter and reset back to range.',
  },
  {
    id: 'of5',
    style: 'out-fighter',
    difficulty: 'easy',
    prompt: 'What footwork pattern is essential for an out-fighter?',
    options: [
      'Staying flat-footed to generate power',
      'Moving only in straight lines',
      'Constant lateral movement and pivots to control the fight\'s geometry',
      'Only moving backward',
    ],
    correct: 2,
    explanation: "Lateral movement and pivots let the out-fighter stay out of danger, find angles, and control where the fight happens — it's non-negotiable for this style.",
  },
  {
    id: 'of6',
    style: 'out-fighter',
    difficulty: 'hard',
    prompt: 'When does an out-fighter land their most effective counters?',
    options: [
      'When they chase the opponent across the ring',
      'When their opponent overextends and is momentarily off balance',
      'After absorbing a body shot',
      'In the clinch during a break',
    ],
    correct: 1,
    explanation: 'The out-fighter is at their most dangerous when the opponent misses — that brief moment of extension and imbalance is exactly when a clean counter lands.',
  },
  {
    id: 'of7',
    style: 'out-fighter',
    difficulty: 'hard',
    prompt: 'An out-fighter is facing a kicker who keeps landing low kicks. Best adjustment?',
    options: [
      'Trade kicks from the same range',
      'Get inside and nullify the kicks by closing the distance',
      'Stand at mid-range and absorb the kicks',
      'Only throw hooks in response',
    ],
    correct: 1,
    explanation: "Closing the distance makes the kicker's kicks impossible to throw with full extension — getting inside neutralises their main weapon.",
  },
  {
    id: 'of8',
    style: 'out-fighter',
    difficulty: 'easy',
    prompt: 'What ring position does an out-fighter most want to control?',
    options: [
      'Against the ropes for support',
      'The centre of the ring for maximum movement options',
      'The corner to limit the opponent\'s movement',
      'As close as possible to the opponent',
    ],
    correct: 1,
    explanation: 'The centre of the ring gives an out-fighter 360° of space to move in any direction — essential for lateral movement and avoiding being cut off.',
  },

  // ── Pressure fighter (8) ──────────────────────────────────────────────────

  {
    id: 'pf1',
    style: 'pressure',
    difficulty: 'easy',
    prompt: "What's the primary goal of a pressure fighter?",
    options: [
      'To score points safely from range',
      'To overwhelm opponents by removing their space and forcing close exchanges',
      'To land one big punch and finish early',
      'To tire the opponent with body shots only',
    ],
    correct: 1,
    explanation: "Pressure fighters win by taking away the opponent's room to breathe and think — volume and forward movement are the weapons.",
  },
  {
    id: 'pf2',
    style: 'pressure',
    difficulty: 'medium',
    prompt: 'How does a pressure fighter effectively cut off the ring?',
    options: [
      'Running straight at the opponent',
      'Using diagonal angles to herd the opponent toward the ropes or corner',
      'Clinching every time the opponent tries to move',
      'Staying in the dead centre of the ring',
    ],
    correct: 1,
    explanation: "Moving diagonally cuts off the opponent's circular escape route — walking straight just lets them circle away.",
  },
  {
    id: 'pf3',
    style: 'pressure',
    difficulty: 'medium',
    prompt: 'What defensive approach suits a pressure fighter?',
    options: [
      'Constant slipping and rolling to avoid all contact',
      'A high guard and head movement to walk through shots while advancing',
      'Running to the outside to avoid danger',
      'Blocking with arms fully extended',
    ],
    correct: 1,
    explanation: "Pressure fighters accept they'll take some shots while closing distance — a tight high guard and rolling with punches lets them survive and keep coming.",
  },
  {
    id: 'pf4',
    style: 'pressure',
    difficulty: 'medium',
    prompt: 'What\'s the biggest danger for a pressure fighter to watch for?',
    options: [
      'Throwing too many jabs',
      'Getting countered hard while moving into range',
      'Not throwing enough kicks',
      'Being too defensive early',
    ],
    correct: 1,
    explanation: "A pressure fighter moving in is vulnerable to counters — a well-timed straight punch straight down the middle can stop their advance cold.",
  },
  {
    id: 'pf5',
    style: 'pressure',
    difficulty: 'hard',
    prompt: 'What body target is most valuable for a pressure fighter to attack?',
    options: [
      'The shoulder to limit punching power',
      'The top of the head',
      'The liver and ribs to slow the opponent\'s movement',
      'The lead leg only',
    ],
    correct: 2,
    explanation: "Body work slows the opponent's footwork over time — a pressure fighter who breaks down the body makes it much harder for an out-fighter to keep moving.",
  },
  {
    id: 'pf6',
    style: 'pressure',
    difficulty: 'hard',
    prompt: 'An out-fighter keeps landing teeps to stop your advance. Best response?',
    options: [
      'Stop and reset to long range',
      'Catch the kick and hold their leg',
      'Time the teep, parry or catch it, and immediately close the distance',
      'Wait for them to tire and lower their teep',
    ],
    correct: 2,
    explanation: "Catching or parrying the teep neutralises it and gives a split-second window to close distance before they can reset — that's the moment to capitalise.",
  },
  {
    id: 'pf7',
    style: 'pressure',
    difficulty: 'easy',
    prompt: 'Which combination best represents a pressure fighter\'s style?',
    options: [
      'Jab-jab-step back',
      'Jab-cross-hook-body hook while moving forward',
      'Low kick-teep-step back',
      'Single cross then clinch every time',
    ],
    correct: 1,
    explanation: "The pressure fighter strings together combinations while pushing forward — the goal is volume and forward momentum, not single shots.",
  },
  {
    id: 'pf8',
    style: 'pressure',
    difficulty: 'medium',
    prompt: 'What does a pressure fighter do when the opponent clinches to survive?',
    options: [
      'Rest and recover in the clinch',
      'Separate immediately and reset at long range',
      'Work the body inside and separate on their own terms',
      'Appeal to the referee to break them',
    ],
    correct: 2,
    explanation: "The clinch is an out-fighter's escape hatch — a pressure fighter should work knees and body shots inside rather than letting the opponent rest.",
  },

  // ── Counter striker (8) ───────────────────────────────────────────────────

  {
    id: 'cs1',
    style: 'counter',
    difficulty: 'easy',
    prompt: "What's the core discipline of a counter striker?",
    options: [
      'Throwing first on every exchange',
      'Patience — waiting for the opponent to commit and punishing mistakes',
      'Constant aggression and forward pressure',
      'Relying only on kicks to score',
    ],
    correct: 1,
    explanation: "Counter strikers win by letting the opponent make the first move — that commitment creates an opening the counter striker is already prepared for.",
  },
  {
    id: 'cs2',
    style: 'counter',
    difficulty: 'medium',
    prompt: 'Your opponent throws a hard jab. Best response as a counter striker?',
    options: [
      'Block and throw the same jab straight back',
      'Slip to the outside and fire the cross to the exposed head',
      'Step back and reset',
      'Rush inside and clinch',
    ],
    correct: 1,
    explanation: "Slipping to the outside puts you off their centreline while putting their head directly in your cross's path — the textbook counter to a jab.",
  },
  {
    id: 'cs3',
    style: 'counter',
    difficulty: 'medium',
    prompt: 'Which defensive skill is most valuable for a counter striker?',
    options: [
      'Turtle shell guard — absorb everything',
      'Rolling with punches to redirect force and create openings',
      'Constant lateral movement only',
      'Catching every kick with both hands',
    ],
    correct: 1,
    explanation: "Rolling with a punch moves you into position to land a counter — it's both defence and offence at the same time, which is exactly what counter striking is about.",
  },
  {
    id: 'cs4',
    style: 'counter',
    difficulty: 'hard',
    prompt: "What's the counter striker's biggest risk in a fight?",
    options: [
      'Throwing too many punches',
      'Looking too aggressive',
      'Losing rounds if the opponent is cautious and won\'t commit to attacks',
      'Getting too tired from defensive movement',
    ],
    correct: 2,
    explanation: "If both fighters wait for the other to commit, the counter striker may lose rounds on the scorecards — judges reward aggression, and waiting looks passive.",
  },
  {
    id: 'cs5',
    style: 'counter',
    difficulty: 'medium',
    prompt: 'When is a counter striker most dangerous?',
    options: [
      'In the opening round while fresh',
      'When they\'re backed up against the ropes',
      'When the opponent commits hard to an attack and opens up',
      'After taking a knockdown — adrenaline peaks',
    ],
    correct: 2,
    explanation: "Every big committed attack creates a window — the harder the opponent swings, the more off-balance and exposed they are, and the cleaner the counter lands.",
  },
  {
    id: 'cs6',
    style: 'counter',
    difficulty: 'medium',
    prompt: 'What\'s the ideal range for a counter striker to operate at?',
    options: [
      'Grappling range',
      'Just outside the opponent\'s comfortable punching range, close enough to counter immediately',
      'As far away as possible',
      'Deep inside the clinch',
    ],
    correct: 1,
    explanation: "That just-outside range baits the opponent to overextend, while keeping the counter striker close enough to land immediately when the opening appears.",
  },
  {
    id: 'cs7',
    style: 'counter',
    difficulty: 'hard',
    prompt: 'How does a counter striker draw out an opponent who won\'t commit?',
    options: [
      'Throw wild punches to invite a response',
      'Talk during the fight to provoke them',
      'Use feints and false openings to invite the attack they\'re prepared to punish',
      'Drop their hands to provoke aggression',
    ],
    correct: 2,
    explanation: "A well-executed feint looks like a real attack — the opponent reacts instinctively, and that reactive commitment is exactly what the counter striker is waiting for.",
  },
  {
    id: 'cs8',
    style: 'counter',
    difficulty: 'hard',
    prompt: 'A pressure fighter keeps walking through counters. What\'s the counter striker\'s best adjustment?',
    options: [
      'Throw harder to stop them',
      'Move constantly and use the teep to maintain distance while still countering off it',
      'Match their pressure',
      'Wait until they get tired — nothing else works',
    ],
    correct: 1,
    explanation: "Against heavy pressure, the counter striker adds movement and the teep to keep the fight at the range where counters work — nullifying the pressure while staying dangerous.",
  },

  // ── Kicker (8) ────────────────────────────────────────────────────────────

  {
    id: 'k1',
    style: 'kicker',
    difficulty: 'easy',
    prompt: "What's the primary damage target for a low kick specialist?",
    options: [
      'The head',
      'The body and ribs',
      'The outer or inner thigh',
      'The shoulder',
    ],
    correct: 2,
    explanation: "Repeated shin-on-thigh contact breaks down the leg muscles, causing pain, bruising, and eventually a loss of mobility — one of the most effective attrition weapons in kickboxing.",
  },
  {
    id: 'k2',
    style: 'kicker',
    difficulty: 'medium',
    prompt: 'How does a kicker maintain optimal fighting range?',
    options: [
      'Staying inside at all times',
      'Using the teep and lateral movement to keep the fight at mid-range',
      'Clinching when threatened',
      'Matching whatever range the opponent chooses',
    ],
    correct: 1,
    explanation: "Mid-range is the kicker's home — close enough for full-power kicks, far enough to load up. The teep is their range-finder, same as the jab for boxers.",
  },
  {
    id: 'k3',
    style: 'kicker',
    difficulty: 'medium',
    prompt: 'What\'s the check defence against a low kick?',
    options: [
      'Stepping away from the kick',
      'Catching the kick with both hands',
      'Raising the lead shin to meet the incoming kick, bone on bone',
      'Dropping the elbow to block',
    ],
    correct: 2,
    explanation: "Checking means lifting your shin to intercept the kick — the attacker's shin hits your shin, which hurts them more and discourages further low kicks.",
  },
  {
    id: 'k4',
    style: 'kicker',
    difficulty: 'hard',
    prompt: 'Which kick causes the most fight-changing cumulative damage?',
    options: [
      'The spinning back kick — most power per shot',
      'The axe kick — most intimidating',
      'Repeated low kicks to the thigh that destroy leg mobility over rounds',
      'A single perfectly timed head kick',
    ],
    correct: 2,
    explanation: "A single low kick does little. Twenty low kicks to the same thigh can make an opponent unable to push off that leg properly — it's a long-game weapon.",
  },
  {
    id: 'k5',
    style: 'kicker',
    difficulty: 'medium',
    prompt: 'The opponent successfully clinches to nullify your kicks. Best response?',
    options: [
      'Stand and trade punches inside',
      'Use knees, create space, and push them back to kicking range',
      'Shoot for a takedown',
      'Drop to the ground to escape',
    ],
    correct: 1,
    explanation: "The clinch is a kicker's worst place to be. Knees buy time, and creating space gets you back to the range where your weapons work.",
  },
  {
    id: 'k6',
    style: 'kicker',
    difficulty: 'hard',
    prompt: 'What technical adjustment generates the most power on a roundhouse kick?',
    options: [
      'Squaring the hips toward the target',
      'Crossing the back foot behind the lead foot',
      'Pivoting hard on the ball of the planted foot while rotating the hips fully through',
      'Staying flat-footed for a stable base',
    ],
    correct: 2,
    explanation: "The hip rotation is where kick power comes from. Pivoting on the ball of the planted foot unlocks the full rotation of the hips, shin, and body into the target.",
  },
  {
    id: 'k7',
    style: 'kicker',
    difficulty: 'medium',
    prompt: 'Which combination best sets up a clean body kick?',
    options: [
      'Body kick-body kick-body kick repeated',
      'Jab-jab to raise the guard, then drive the kick into the exposed ribs',
      'Teep-teep-teep then body kick',
      'Low kick immediately followed by a head kick',
    ],
    correct: 1,
    explanation: "Two jabs pull the opponent's hands up to protect the head — the moment their guard rises, the ribs are exposed for the body kick.",
  },
  {
    id: 'k8',
    style: 'kicker',
    difficulty: 'hard',
    prompt: 'Your opponent has started successfully checking your low kicks. Best adjustment?',
    options: [
      'Stop throwing low kicks entirely',
      'Kick harder to overpower the check',
      'Switch the target — body or head kick, or fake the low kick to set up the high',
      'Clinch after every low kick attempt',
    ],
    correct: 2,
    explanation: "If they're checking the low kick, they're conditioned to lift the leg — a fake low kick makes them lift, and that shift of weight opens the body or head for the real strike.",
  },
];
