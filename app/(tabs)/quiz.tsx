import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { QUIZ_LEVELS, QuizLevel, QuizQuestion } from '@/constants/quizData';
import { useGameStore } from '@/store/gameStore';
import MascotCharacter from '@/components/MascotCharacter';
import ProgressBar from '@/components/ProgressBar';
import ConfettiEffect from '@/components/ConfettiEffect';

interface QuizLevelCardProps {
  level: QuizLevel;
  completed: boolean;
  onStart: () => void;
  index: number;
}

function QuizLevelCard({ level, completed, onStart, index }: QuizLevelCardProps) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;
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
        <View style={[styles.levelCard, { borderLeftColor: level.color, borderLeftWidth: 6 }]}>
          <View style={[styles.levelIconBox, { backgroundColor: level.color + '22' }]}>
            <Text style={styles.levelEmoji}>{level.emoji}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.levelMeta}>{level.questions.length} questions</Text>
            <View style={styles.levelStarsRow}>
              <Text style={styles.levelStars}>⭐ {level.starsReward} stars to win</Text>
            </View>
          </View>
          <View style={styles.levelAction}>
            {completed ? (
              <View style={[styles.completedBadge, { backgroundColor: Colors.green + '22' }]}>
                <Text style={styles.completedEmoji}>✅</Text>
                <Text style={[styles.completedText, { color: Colors.green }]}>Done!</Text>
              </View>
            ) : (
              <View style={[styles.playButton, { backgroundColor: level.color }]}>
                <Text style={styles.playButtonText}>Play!</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface QuizPlayerProps {
  level: QuizLevel;
  onComplete: (score: number) => void;
  onClose: () => void;
}

function QuizPlayer({ level, onComplete, onClose }: QuizPlayerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [collectPressed, setCollectPressed] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const question = level.questions[currentQ];
  const isLast = currentQ === level.questions.length - 1;

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(1)).current;

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);

    const correct = idx === question.correct;
    if (correct) {
      setScore((s) => s + 1);
      Animated.sequence([
        Animated.timing(successScale, { toValue: 1.08, duration: 150, useNativeDriver: true }),
        Animated.spring(successScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else {
      setWrongCount((w) => w + 1);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }

    // Scroll down so the feedback + Next button are always visible, even on small screens.
    // The delay lets React finish the render before we measure the new content height.
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentQ((q) => q + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    // Scroll back to top so the new question header is fully visible.
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const getOptionStyle = (idx: number) => {
    if (!showFeedback) return styles.option;
    if (idx === question.correct) return [styles.option, styles.optionCorrect];
    if (idx === selectedAnswer && idx !== question.correct) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDimmed];
  };

  const getOptionTextStyle = (idx: number) => {
    if (!showFeedback) return styles.optionText;
    if (idx === question.correct) return [styles.optionText, styles.optionTextCorrect];
    if (idx === selectedAnswer && idx !== question.correct) return [styles.optionText, styles.optionTextWrong];
    return [styles.optionText, styles.optionTextDimmed];
  };

  const mascotMood = !showFeedback
    ? 'thinking'
    : selectedAnswer === question.correct
    ? 'celebrating'
    : 'happy';

  const percentage = Math.round((score / level.questions.length) * 100);

  if (finished) {
    return (
      <View style={styles.quizPlayer}>
        <LinearGradient colors={[level.color, level.color + 'BB']} style={styles.finishedHeader}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
          <Text style={styles.finishedHeaderTitle}>Quiz Complete!</Text>
        </LinearGradient>
        <View style={styles.finishedContent}>
          <MascotCharacter mood={score >= level.questions.length * 0.6 ? 'celebrating' : 'happy'} size="large" animate />
          <Text style={styles.scoreEmoji}>
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '💪'}
          </Text>
          <Text style={styles.scoreTitle}>
            {percentage >= 80 ? 'Amazing!' : percentage >= 60 ? 'Great job!' : 'Keep practicing!'}
          </Text>
          <Text style={styles.scoreText}>
            You got {score} out of {level.questions.length} correct!
          </Text>
          <View style={[styles.scoreBadge, { backgroundColor: level.color + '22', borderColor: level.color }]}>
            <Text style={[styles.scoreBadgeText, { color: level.color }]}>{percentage}% correct</Text>
          </View>
          {score > 0 && (
            <Text style={styles.starsEarned}>
              ⭐ +{Math.round((score / level.questions.length) * level.starsReward)} stars earned!
            </Text>
          )}
          <Pressable
            onPress={() => {
              if (collectPressed) return;
              setCollectPressed(true);
              onComplete(score);
            }}
            style={[styles.finishButton, { backgroundColor: level.color, opacity: collectPressed ? 0.6 : 1 }]}
          >
            <Text style={styles.finishButtonText}>Collect Stars! 🎉</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.quizPlayer}>
      {/* Header */}
      <LinearGradient colors={[level.color, level.color + 'BB']} style={styles.playerHeader}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.playerHeaderTitle}>{level.title}</Text>
        <Text style={styles.questionCounter}>
          {currentQ + 1}/{level.questions.length}
        </Text>
      </LinearGradient>

      {/* Progress bar */}
      <View style={styles.progressWrapper}>
        <ProgressBar progress={(currentQ + 1) / level.questions.length} color={level.color} height={8} />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.questionContent}>
        {/* Mascot + score */}
        <View style={styles.questionHeader}>
          <MascotCharacter mood={mascotMood} size="small" animate />
          <View style={styles.liveScore}>
            <Text style={styles.liveScoreText}>⭐ {score} / {currentQ + (showFeedback ? 1 : 0)}</Text>
          </View>
        </View>

        {/* Question */}
        <Animated.View style={[styles.questionBox, { transform: [{ translateX: shakeAnim }, { scale: successScale }] }]}>
          <Text style={styles.questionEmoji}>{question.emoji}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => (
            <Pressable key={idx} onPress={() => handleAnswer(idx)} style={getOptionStyle(idx)} disabled={showFeedback}>
              <View style={styles.optionIndex}>
                <Text style={styles.optionIndexText}>
                  {showFeedback && idx === question.correct ? '✅' : showFeedback && idx === selectedAnswer ? '❌' : String.fromCharCode(65 + idx)}
                </Text>
              </View>
              <Text style={getOptionTextStyle(idx)} numberOfLines={2}>{option}</Text>
            </Pressable>
          ))}
        </View>

        {/* Feedback */}
        {showFeedback && (
          <Animated.View style={[
            styles.feedbackBox,
            selectedAnswer === question.correct ? styles.feedbackCorrect : styles.feedbackWrong
          ]}>
            <Text style={styles.feedbackEmoji}>
              {selectedAnswer === question.correct ? '🎉' : '😅'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.feedbackTitle}>
                {selectedAnswer === question.correct ? 'Correct! Amazing!' : 'Not quite!'}
              </Text>
              <Text style={styles.feedbackText}>{question.explanation}</Text>
            </View>
          </Animated.View>
        )}

        {showFeedback && (
          <Pressable
            onPress={handleNext}
            style={[styles.nextButton, { backgroundColor: level.color }]}
          >
            <Text style={styles.nextButtonText}>{isLast ? '🏁 See Results!' : 'Next Question →'}</Text>
          </Pressable>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

export default function QuizScreen() {
  const { completedQuizzes, addStars, completeQuiz } = useGameStore();
  const [activeLevel, setActiveLevel] = useState<QuizLevel | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completedCount = completedQuizzes.length;

  const closeQuiz = useCallback(() => {
    if (confettiTimer.current) {
      clearTimeout(confettiTimer.current);
      confettiTimer.current = null;
    }
    setShowConfetti(false);
    setActiveLevel(null);
  }, []);

  const handleComplete = (score: number) => {
    if (!activeLevel) return;
    const alreadyDone = completedQuizzes.includes(activeLevel.id);
    const starsEarned = Math.round((score / activeLevel.questions.length) * activeLevel.starsReward);
    if (starsEarned > 0) addStars(starsEarned);
    if (!alreadyDone && score > 0) completeQuiz(activeLevel.id);
    setShowConfetti(true);
    confettiTimer.current = setTimeout(closeQuiz, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ConfettiEffect active={showConfetti} />

      <Modal visible={!!activeLevel} animationType="slide" presentationStyle="pageSheet">
        {activeLevel && (
          <QuizPlayer level={activeLevel} onComplete={handleComplete} onClose={closeQuiz} />
        )}
      </Modal>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#A78BFA', '#8B6FE8']} style={styles.header}>
          <Text style={styles.headerTitle}>🧠 Quiz Time!</Text>
          <Text style={styles.headerSubtitle}>Test your AI knowledge!</Text>
          <View style={styles.headerStatsRow}>
            <Text style={styles.headerStatText}>✅ {completedCount}/{QUIZ_LEVELS.length} quizzes done</Text>
          </View>
          <ProgressBar
            progress={completedCount / QUIZ_LEVELS.length}
            color={Colors.white}
            height={10}
          />
        </LinearGradient>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerEmoji}>💡</Text>
          <Text style={styles.infoBannerText}>
            Answer questions to earn ⭐ stars! The more you get right, the more stars you win!
          </Text>
        </View>

        {/* Levels */}
        <View style={styles.levelsContainer}>
          <Text style={styles.sectionTitle}>Pick a quiz! 🎯</Text>
          {QUIZ_LEVELS.map((level, i) => (
            <QuizLevelCard
              key={level.id}
              level={level}
              completed={completedQuizzes.includes(level.id)}
              onStart={() => setActiveLevel(level)}
              index={i}
            />
          ))}
        </View>

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
  infoBanner: {
    margin: 20,
    marginBottom: 0,
    backgroundColor: Colors.purple + '18',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.purple + '44',
  },
  infoBannerEmoji: { fontSize: 24 },
  infoBannerText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 19, fontWeight: '500' },
  levelsContainer: { padding: 20, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  levelCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  levelIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelEmoji: { fontSize: 28 },
  levelInfo: { flex: 1, gap: 3 },
  levelTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  levelMeta: { fontSize: 12, color: Colors.textMuted },
  levelStarsRow: { flexDirection: 'row', marginTop: 2 },
  levelStars: { fontSize: 12, color: Colors.orange, fontWeight: '700' },
  levelAction: { alignItems: 'center' },
  completedBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 2,
  },
  completedEmoji: { fontSize: 20 },
  completedText: { fontSize: 11, fontWeight: '700' },
  playButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  playButtonText: { fontSize: 14, fontWeight: '800', color: Colors.white },

  // Quiz Player
  quizPlayer: { flex: 1, backgroundColor: Colors.background },
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
  playerHeaderTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Colors.white },
  questionCounter: {
    backgroundColor: Colors.white + '33',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  progressWrapper: { paddingHorizontal: 20, paddingVertical: 10 },
  questionContent: { padding: 20, gap: 16 },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveScore: {
    backgroundColor: Colors.accent + '33',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Colors.accentDark,
  },
  liveScoreText: { fontSize: 16, fontWeight: '800', color: Colors.text },
  questionBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  questionEmoji: { fontSize: 48 },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  optionsContainer: { gap: 10 },
  option: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCorrect: {
    backgroundColor: Colors.green + '18',
    borderColor: Colors.green,
  },
  optionWrong: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  optionDimmed: {
    opacity: 0.5,
  },
  optionIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: { fontSize: 16, fontWeight: '800', color: Colors.text },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text, lineHeight: 22 },
  optionTextCorrect: { color: Colors.greenDark },
  optionTextWrong: { color: Colors.primaryDark },
  optionTextDimmed: { color: Colors.textMuted },
  feedbackBox: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 2,
  },
  feedbackCorrect: {
    backgroundColor: Colors.green + '18',
    borderColor: Colors.green,
  },
  feedbackWrong: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  feedbackEmoji: { fontSize: 28 },
  feedbackTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  feedbackText: { fontSize: 13, color: Colors.textLight, lineHeight: 19 },
  nextButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: { fontSize: 16, fontWeight: '800', color: Colors.white },

  // Finished screen
  finishedHeader: {
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  finishedHeaderTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  finishedContent: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    gap: 14,
    justifyContent: 'center',
  },
  scoreEmoji: { fontSize: 56 },
  scoreTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  scoreText: { fontSize: 17, color: Colors.textLight, textAlign: 'center', fontWeight: '500' },
  scoreBadge: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
  },
  scoreBadgeText: { fontSize: 18, fontWeight: '800' },
  starsEarned: { fontSize: 20, fontWeight: '700', color: Colors.orange },
  finishButton: {
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
  },
  finishButtonText: { fontSize: 18, fontWeight: '800', color: Colors.white },
});
