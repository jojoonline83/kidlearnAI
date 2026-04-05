import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { LESSONS, Lesson, LessonPage } from '@/constants/lessons';
import { useGameStore } from '@/store/gameStore';
import MascotCharacter from '@/components/MascotCharacter';
import ProgressBar from '@/components/ProgressBar';
import ConfettiEffect from '@/components/ConfettiEffect';
import { Tap } from '@/components/Tap';

const { width } = Dimensions.get('window');

interface LessonCardProps {
  lesson: Lesson;
  completed: boolean;
  onStart: () => void;
  index: number;
}

function LessonCard({ lesson, completed, onStart, index }: LessonCardProps) {
  const isWeb = Platform.OS === 'web';
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(isWeb ? 0 : 50)).current;
  const opacityAnim = useRef(new Animated.Value(isWeb ? 1 : 0)).current;

  React.useEffect(() => {
    if (isWeb) return;
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, []);

  const cardInner = (
    <LinearGradient
      colors={[lesson.color, lesson.color + 'BB']}
      style={styles.lessonCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.lessonCardLeft}>
        <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
      </View>
      <View style={styles.lessonCardContent}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
        <View style={styles.lessonMeta}>
          <Text style={styles.lessonPages}>{lesson.pages.length} pages</Text>
          <Text style={styles.lessonStars}>⭐ {lesson.stars} stars</Text>
        </View>
      </View>
      <View style={styles.lessonCardRight}>
        {completed ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✅</Text>
            <Text style={styles.doneText}>Done!</Text>
          </View>
        ) : (
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>▶</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  if (isWeb) {
    return (
      <View onClick={onStart as any} style={{ cursor: 'pointer' } as any}>
        {cardInner}
      </View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }, { scale: scaleAnim }], opacity: opacityAnim }}>
      <Pressable
        onPress={onStart}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      >
        {cardInner}
      </Pressable>
    </Animated.View>
  );
}

interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

function LessonViewer({ lesson, onComplete, onClose }: LessonViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const page = lesson.pages[currentPage];
  const isLast = currentPage === lesson.pages.length - 1;

  const goNext = () => {
    if (isLast) {
      setCompleted(true);
      onComplete();
      return;
    }
    // Slide out current
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -width, duration: 200, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => {
      setCurrentPage((p) => p + 1);
      slideAnim.setValue(width);
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: Platform.OS !== 'web' }).start();
    });
  };

  const goPrev = () => {
    if (currentPage === 0) return;
    Animated.timing(slideAnim, { toValue: width, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start(() => {
      setCurrentPage((p) => p - 1);
      slideAnim.setValue(-width);
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: Platform.OS !== 'web' }).start();
    });
  };

  const progress = (currentPage + 1) / lesson.pages.length;

  return (
    <View style={styles.lessonViewer}>
      {/* Header */}
      <LinearGradient colors={[lesson.color, lesson.color + 'BB']} style={styles.viewerHeader}>
        <Tap onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Tap>
        <Text style={styles.viewerTitle}>{lesson.title}</Text>
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentPage + 1} / {lesson.pages.length}
          </Text>
        </View>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.viewerProgress}>
        <ProgressBar progress={progress} color={lesson.color} height={10} />
      </View>

      {/* Page content */}
      <Animated.View style={[styles.pageContent, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.pageEmojiContainer}>
          <Text style={styles.pageEmoji}>{page.emoji}</Text>
        </View>
        <Text style={styles.pageTitle}>{page.title}</Text>
        <Text style={styles.pageText}>{page.text}</Text>

        {/* Mascot at the end */}
        {isLast && (
          <View style={styles.completionMascot}>
            <MascotCharacter mood="celebrating" size="large" animate />
            <Text style={styles.completionMessage}>Amazing! You finished this lesson!</Text>
            <Text style={styles.starsEarned}>You earned ⭐ {lesson.stars} stars!</Text>
          </View>
        )}
      </Animated.View>

      {/* Navigation buttons */}
      <View style={styles.navButtons}>
        <Tap
          onPress={goPrev}
          style={[styles.navButton, styles.navButtonBack, currentPage === 0 && styles.navButtonDisabled]}
          disabled={currentPage === 0}
        >
          <Text style={styles.navButtonText}>← Back</Text>
        </Tap>
        <View style={styles.dotIndicators}>
          {lesson.pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentPage ? lesson.color : Colors.border },
                i <= currentPage && { backgroundColor: lesson.color + '88' },
                i === currentPage && { width: 20 },
              ]}
            />
          ))}
        </View>
        <Tap onPress={goNext} style={[styles.navButton, { backgroundColor: lesson.color }]}>
          <Text style={styles.navButtonText}>{isLast ? '🎉 Finish!' : 'Next →'}</Text>
        </Tap>
      </View>
    </View>
  );
}

export default function LearnScreen() {
  const { completedLessons, addStars, completeLesson } = useGameStore();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const completedCount = completedLessons.length;

  const handleComplete = () => {
    if (!selectedLesson) return;
    const alreadyDone = completedLessons.includes(selectedLesson.id);
    if (!alreadyDone) {
      addStars(selectedLesson.stars);
      completeLesson(selectedLesson.id);
    }
    setShowConfetti(true);
    setJustCompletedId(selectedLesson.id);
    setTimeout(() => {
      setShowConfetti(false);
      setSelectedLesson(null);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ConfettiEffect active={showConfetti} />

      {/* Modal for lesson viewer */}
      <Modal visible={!!selectedLesson} animationType="slide">
        {selectedLesson && (
          <LessonViewer
            lesson={selectedLesson}
            onComplete={handleComplete}
            onClose={() => setSelectedLesson(null)}
          />
        )}
      </Modal>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#4ECDC4', '#34B5AC']} style={styles.header}>
          <Text style={styles.headerTitle}>📚 AI Lessons</Text>
          <Text style={styles.headerSubtitle}>Learn amazing things about AI!</Text>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatText}>
              ✅ {completedCount} / {LESSONS.length} completed
            </Text>
          </View>
          <ProgressBar
            progress={completedCount / LESSONS.length}
            color={Colors.white}
            height={10}
          />
        </LinearGradient>

        {/* Lessons List */}
        <View style={styles.lessonsContainer}>
          <Text style={styles.sectionTitle}>Choose a lesson 👇</Text>
          {LESSONS.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={completedLessons.includes(lesson.id)}
              onStart={() => setSelectedLesson(lesson)}
              index={i}
            />
          ))}
        </View>

        {/* Completion Banner */}
        {completedCount === LESSONS.length && (
          <View style={styles.allDoneBanner}>
            <Text style={styles.allDoneEmoji}>🎓</Text>
            <Text style={styles.allDoneTitle}>All Lessons Complete!</Text>
            <Text style={styles.allDoneText}>You're an AI expert! Go take the quiz!</Text>
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
  header: {
    padding: 24,
    paddingTop: 16,
    gap: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.white + 'DD',
    fontWeight: '500',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerStatText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '700',
  },
  lessonsContainer: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  lessonCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  lessonCardLeft: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.white + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmoji: {
    fontSize: 28,
  },
  lessonCardContent: {
    flex: 1,
    gap: 3,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
  },
  lessonSubtitle: {
    fontSize: 12,
    color: Colors.white + 'CC',
    fontWeight: '500',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  lessonPages: {
    fontSize: 11,
    color: Colors.white + 'BB',
    fontWeight: '600',
  },
  lessonStars: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
  lessonCardRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    alignItems: 'center',
    gap: 2,
  },
  completedText: {
    fontSize: 22,
  },
  doneText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  startButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    color: Colors.white,
  },
  allDoneBanner: {
    margin: 20,
    backgroundColor: Colors.accent + '33',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.accentDark,
  },
  allDoneEmoji: { fontSize: 48 },
  allDoneTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  allDoneText: { fontSize: 14, color: Colors.textLight, textAlign: 'center' },

  // Lesson Viewer
  lessonViewer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  viewerHeader: {
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
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  viewerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  pageIndicator: {
    backgroundColor: Colors.white + '33',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pageIndicatorText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  viewerProgress: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  pageContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  pageEmojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  pageEmoji: {
    fontSize: 64,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  pageText: {
    fontSize: 17,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  completionMascot: {
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  completionMessage: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  starsEarned: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.orange,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 34,
    gap: 12,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  navButtonBack: {
    backgroundColor: Colors.border,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  dotIndicators: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
