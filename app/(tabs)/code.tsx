import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  SafeAreaView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { CODE_CHALLENGES, CodeChallenge, CodeBlock } from '@/constants/codeData';
import { useGameStore } from '@/store/gameStore';
import MascotCharacter from '@/components/MascotCharacter';
import ProgressBar from '@/components/ProgressBar';
import ConfettiEffect from '@/components/ConfettiEffect';

// ── Challenge Card ──────────────────────────────────────────────────
interface ChallengeCardProps {
  challenge: CodeChallenge;
  completed: boolean;
  onStart: () => void;
  index: number;
}

function ChallengeCard({ challenge, completed, onStart, index }: ChallengeCardProps) {
  const isWeb = Platform.OS === 'web';
  const slideAnim = useRef(new Animated.Value(isWeb ? 0 : 40)).current;
  const opacityAnim = useRef(new Animated.Value(isWeb ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }, { scale: scaleAnim }], opacity: opacityAnim }}>
      <Pressable
        onPress={onStart}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      >
        <LinearGradient
          colors={[challenge.color, challenge.color + 'BB']}
          style={styles.challengeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.challengeCardHeader}>
            <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeGoal}>{challenge.goal}</Text>
            </View>
            <View style={styles.challengeRight}>
              {completed ? (
                <View style={styles.doneBox}>
                  <Text style={styles.doneEmoji}>✅</Text>
                  <Text style={styles.doneText}>Done!</Text>
                </View>
              ) : (
                <View style={styles.codeButton}>
                  <Text style={styles.codeButtonText}>Code!</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.storyBox}>
            <Text style={styles.storyText} numberOfLines={2}>{challenge.story}</Text>
          </View>
          <Text style={styles.challengeStars}>⭐ {challenge.stars} stars</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

// ── Code Block item ──────────────────────────────────────────────────
interface CodeBlockItemProps {
  block: CodeBlock;
  onPress: () => void;
  isInSequence?: boolean;
  index?: number;
}

function CodeBlockItem({ block, onPress, isInSequence = false, index }: CodeBlockItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.codeBlock,
          { backgroundColor: block.color, transform: [{ scale: scaleAnim }] },
          isInSequence && styles.codeBlockInSequence,
        ]}
      >
        {isInSequence && index !== undefined && (
          <View style={styles.blockStepNumber}>
            <Text style={styles.blockStepText}>{index + 1}</Text>
          </View>
        )}
        <Text style={styles.blockEmoji}>{block.emoji}</Text>
        <Text style={styles.blockLabel}>{block.label}</Text>
        {isInSequence && (
          <View style={styles.blockRemove}>
            <Text style={styles.blockRemoveText}>✕</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ── Running Animation ─────────────────────────────────────────────
interface RunningAnimProps {
  blocks: CodeBlock[];
  currentStep: number;
  isRunning: boolean;
  success: boolean | null;
}

function RunningAnim({ blocks, currentStep, isRunning, success }: RunningAnimProps) {
  return (
    <View style={styles.runningAnim}>
      <MascotCharacter
        mood={success === true ? 'celebrating' : success === false ? 'thinking' : isRunning ? 'excited' : 'happy'}
        size="medium"
        animate={isRunning || success !== null}
      />
      <View style={styles.runStepsContainer}>
        {blocks.map((b, i) => (
          <View
            key={i}
            style={[
              styles.runStep,
              { backgroundColor: b.color + '44', borderColor: b.color },
              currentStep === i && styles.runStepActive,
              currentStep > i && styles.runStepDone,
            ]}
          >
            <Text style={styles.runStepEmoji}>{b.emoji}</Text>
            {currentStep > i && <Text style={styles.runStepCheck}>✓</Text>}
          </View>
        ))}
        {success === true && <Text style={styles.runSuccess}>🎉</Text>}
        {success === false && <Text style={styles.runFail}>😅</Text>}
      </View>
    </View>
  );
}

// ── Challenge Player ──────────────────────────────────────────────────
interface ChallengePlayerProps {
  challenge: CodeChallenge;
  onComplete: () => void;
  onClose: () => void;
}

function ChallengePlayer({ challenge, onComplete, onClose }: ChallengePlayerProps) {
  const [sequence, setSequence] = useState<CodeBlock[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runStep, setRunStep] = useState(-1);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const MAX_BLOCKS = challenge.solution.length + 2;

  const addBlock = (block: CodeBlock) => {
    if (sequence.length >= MAX_BLOCKS) return;
    setSequence((s) => [...s, block]);
    setResult(null);
  };

  const removeBlock = (idx: number) => {
    setSequence((s) => s.filter((_, i) => i !== idx));
    setResult(null);
  };

  const clearSequence = () => {
    setSequence([]);
    setResult(null);
    setRunStep(-1);
  };

  const runProgram = () => {
    if (sequence.length === 0) return;
    setIsRunning(true);
    setRunStep(-1);
    setResult(null);
    setAttempts((a) => a + 1);

    // Animate through each step
    let step = 0;
    const interval = setInterval(() => {
      setRunStep(step);
      step++;
      if (step >= sequence.length) {
        clearInterval(interval);
        // Check if solution matches
        const sequenceIds = sequence.map((b) => b.id);
        const isCorrect = JSON.stringify(sequenceIds) === JSON.stringify(challenge.solution);
        setResult(isCorrect ? 'success' : 'fail');
        setIsRunning(false);
        if (isCorrect) {
          setTimeout(() => onComplete(), 1500);
        }
      }
    }, 600);
  };

  return (
    <View style={styles.player}>
      {/* Header */}
      <LinearGradient colors={[challenge.color, challenge.color + 'BB']} style={styles.playerHeader}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.playerTitle}>{challenge.title}</Text>
        <Pressable onPress={() => setShowHint(!showHint)} style={styles.hintButton}>
          <Text style={styles.hintButtonText}>💡</Text>
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.playerContent} showsVerticalScrollIndicator={false}>
        {/* Story */}
        <View style={styles.storyCard}>
          <Text style={styles.storyEmoji}>{challenge.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.storyTitle}>{challenge.goal}</Text>
            <Text style={styles.storyDesc}>{challenge.story}</Text>
          </View>
        </View>

        {/* Hint */}
        {showHint && (
          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>💡 Hint</Text>
            <Text style={styles.hintText}>{challenge.hint}</Text>
          </View>
        )}

        {/* Running Animation */}
        {(isRunning || result !== null) && (
          <RunningAnim
            blocks={sequence}
            currentStep={runStep}
            isRunning={isRunning}
            success={result === 'success' ? true : result === 'fail' ? false : null}
          />
        )}

        {/* Result feedback */}
        {result === 'success' && (
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>Amazing! You did it!</Text>
            <Text style={styles.successStars}>⭐ +{challenge.stars} stars!</Text>
          </View>
        )}
        {result === 'fail' && (
          <View style={styles.failCard}>
            <Text style={styles.failEmoji}>😅</Text>
            <Text style={styles.failTitle}>Not quite right!</Text>
            <Text style={styles.failText}>
              {attempts < 3 ? 'Try a different order of blocks!' : 'Tap 💡 for a hint!'}
            </Text>
          </View>
        )}

        {/* Sequence Builder */}
        <View style={styles.sequenceSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>📋 Your Program ({sequence.length}/{MAX_BLOCKS})</Text>
            {sequence.length > 0 && (
              <Pressable onPress={clearSequence} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
            )}
          </View>

          <View style={[styles.sequenceArea, sequence.length === 0 && styles.sequenceAreaEmpty]}>
            {sequence.length === 0 ? (
              <Text style={styles.emptySequenceText}>👇 Tap blocks below to build your program!</Text>
            ) : (
              <View style={styles.sequenceBlocks}>
                {sequence.map((block, i) => (
                  <CodeBlockItem
                    key={i}
                    block={block}
                    onPress={() => removeBlock(i)}
                    isInSequence
                    index={i}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Available Blocks */}
        <View style={styles.availableSection}>
          <Text style={styles.sectionLabel}>🧩 Available Blocks — tap to add!</Text>
          <View style={styles.availableBlocks}>
            {challenge.availableBlocks.map((block) => (
              <CodeBlockItem
                key={block.id}
                block={block}
                onPress={() => addBlock(block)}
              />
            ))}
          </View>
        </View>

        {/* Run Button */}
        <Pressable
          onPress={runProgram}
          style={[
            styles.runButton,
            { backgroundColor: challenge.color },
            (isRunning || sequence.length === 0) && styles.runButtonDisabled,
          ]}
          disabled={isRunning || sequence.length === 0}
        >
          <Text style={styles.runButtonText}>
            {isRunning ? '⚙️ Running...' : '▶ Run Program!'}
          </Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ── Main Code Screen ──────────────────────────────────────────────────
export default function CodeScreen() {
  const { completedChallenges, addStars, completeChallenge } = useGameStore();
  const [activeChallenge, setActiveChallenge] = useState<CodeChallenge | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    if (!activeChallenge) return;
    const alreadyDone = completedChallenges.includes(activeChallenge.id);
    if (!alreadyDone) {
      addStars(activeChallenge.stars);
      completeChallenge(activeChallenge.id);
    }
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setActiveChallenge(null);
    }, 2000);
  };

  const completedCount = completedChallenges.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ConfettiEffect active={showConfetti} />

      <Modal visible={!!activeChallenge} animationType="slide" presentationStyle="pageSheet">
        {activeChallenge && (
          <ChallengePlayer
            challenge={activeChallenge}
            onComplete={handleComplete}
            onClose={() => setActiveChallenge(null)}
          />
        )}
      </Modal>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#FB923C', '#E87520']} style={styles.header}>
          <Text style={styles.headerTitle}>💻 Coding Fun!</Text>
          <Text style={styles.headerSubtitle}>Build programs for Sparky!</Text>
          <View style={styles.headerStatsRow}>
            <Text style={styles.headerStatText}>✅ {completedCount}/{CODE_CHALLENGES.length} puzzles solved</Text>
          </View>
          <ProgressBar progress={completedCount / CODE_CHALLENGES.length} color={Colors.white} height={10} />
        </LinearGradient>

        {/* Intro card */}
        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>🤖</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>How it works!</Text>
            <Text style={styles.introText}>
              Tap code blocks to build Sparky's program. Put them in the right order, then press RUN! 🚀
            </Text>
          </View>
        </View>

        {/* Challenges */}
        <View style={styles.challengesContainer}>
          <Text style={styles.sectionTitle}>Pick a challenge! 🎯</Text>
          {CODE_CHALLENGES.map((challenge, i) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              completed={completedChallenges.includes(challenge.id)}
              onStart={() => setActiveChallenge(challenge)}
              index={i}
            />
          ))}
        </View>

        {/* All done */}
        {completedCount === CODE_CHALLENGES.length && (
          <View style={styles.allDoneBanner}>
            <Text style={styles.allDoneEmoji}>🚀</Text>
            <Text style={styles.allDoneTitle}>All Challenges Complete!</Text>
            <Text style={styles.allDoneText}>You're a coding superstar! Check your Rewards!</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingTop: 16, gap: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.white },
  headerSubtitle: { fontSize: 15, color: Colors.white + 'DD', fontWeight: '500' },
  headerStatsRow: { flexDirection: 'row', marginBottom: 4 },
  headerStatText: { fontSize: 13, color: Colors.white, fontWeight: '700' },

  introCard: {
    margin: 20,
    marginBottom: 0,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.orange + '44',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  introEmoji: { fontSize: 32 },
  introTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 3 },
  introText: { fontSize: 12, color: Colors.textLight, lineHeight: 18 },

  challengesContainer: { padding: 20, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },

  challengeCard: {
    borderRadius: 20,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  challengeCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  challengeEmoji: { fontSize: 36 },
  challengeInfo: { flex: 1, gap: 2 },
  challengeTitle: { fontSize: 16, fontWeight: '800', color: Colors.white },
  challengeGoal: { fontSize: 12, color: Colors.white + 'CC', fontWeight: '500' },
  challengeRight: { alignItems: 'center' },
  doneBox: { alignItems: 'center', gap: 2 },
  doneEmoji: { fontSize: 24 },
  doneText: { fontSize: 10, color: Colors.white, fontWeight: '700' },
  codeButton: {
    backgroundColor: Colors.white + '33',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  codeButtonText: { fontSize: 13, fontWeight: '800', color: Colors.white },
  storyBox: {
    backgroundColor: Colors.white + '22',
    borderRadius: 10,
    padding: 10,
  },
  storyText: { fontSize: 12, color: Colors.white + 'DD', lineHeight: 18 },
  challengeStars: { fontSize: 13, fontWeight: '700', color: Colors.white },

  allDoneBanner: {
    margin: 20,
    backgroundColor: Colors.orange + '22',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.orange,
  },
  allDoneEmoji: { fontSize: 48 },
  allDoneTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  allDoneText: { fontSize: 14, color: Colors.textLight, textAlign: 'center' },

  // Player
  player: { flex: 1, backgroundColor: Colors.background },
  playerHeader: {
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  playerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Colors.white },
  hintButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintButtonText: { fontSize: 18 },

  playerContent: { padding: 16, gap: 14 },

  storyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  storyEmoji: { fontSize: 32 },
  storyTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  storyDesc: { fontSize: 13, color: Colors.textLight, lineHeight: 19 },

  hintCard: {
    backgroundColor: Colors.accent + '33',
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.accentDark,
    gap: 4,
  },
  hintTitle: { fontSize: 14, fontWeight: '800', color: Colors.text },
  hintText: { fontSize: 13, color: Colors.textLight, lineHeight: 19 },

  // Running animation
  runningAnim: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  runStepsContainer: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  runStep: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  runStepActive: {
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
  runStepDone: {
    opacity: 0.6,
  },
  runStepEmoji: { fontSize: 20 },
  runStepCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 12,
    backgroundColor: Colors.green,
    borderRadius: 8,
    paddingHorizontal: 2,
    color: Colors.white,
    fontWeight: '800',
  },
  runSuccess: { fontSize: 28, alignSelf: 'center' },
  runFail: { fontSize: 28, alignSelf: 'center' },

  successCard: {
    backgroundColor: Colors.green + '18',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  successEmoji: { fontSize: 48 },
  successTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  successStars: { fontSize: 18, fontWeight: '700', color: Colors.orange },

  failCard: {
    backgroundColor: Colors.primary + '18',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  failEmoji: { fontSize: 36 },
  failTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  failText: { fontSize: 13, color: Colors.textLight, textAlign: 'center' },

  sequenceSection: { gap: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: Colors.text },
  clearButton: {
    backgroundColor: Colors.primary + '22',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clearButtonText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  sequenceArea: {
    minHeight: 80,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  sequenceAreaEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySequenceText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sequenceBlocks: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  availableSection: { gap: 8 },
  availableBlocks: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  codeBlock: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  codeBlockInSequence: {
    borderWidth: 2,
    borderColor: Colors.white + '66',
  },
  blockStepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockStepText: { fontSize: 11, fontWeight: '800', color: Colors.white },
  blockEmoji: { fontSize: 18 },
  blockLabel: { fontSize: 12, fontWeight: '700', color: Colors.white },
  blockRemove: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  blockRemoveText: { fontSize: 10, color: Colors.white, fontWeight: '800' },

  runButton: {
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  runButtonDisabled: { opacity: 0.5 },
  runButtonText: { fontSize: 18, fontWeight: '800', color: Colors.white },
});
