import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Animated,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useGameStore } from '@/store/gameStore';
import { LESSONS } from '@/constants/lessons';
import { QUIZ_LEVELS } from '@/constants/quizData';
import { CODE_CHALLENGES } from '@/constants/codeData';
import { getTitle } from '@/constants/rewardsData';
import MascotCharacter from '@/components/MascotCharacter';
import ProgressBar from '@/components/ProgressBar';
import StarCounter from '@/components/StarCounter';

interface NavCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  gradientEnd: string;
  progress: number;
  onPress: () => void;
  delay?: number;
}

function NavCard({ emoji, title, subtitle, color, gradientEnd, progress, onPress, delay = 0 }: NavCardProps) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View
      style={{ transform: [{ translateY: slideAnim }, { scale: scaleAnim }], opacity: opacityAnim, flex: 1 }}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <LinearGradient
          colors={[color, gradientEnd]}
          style={styles.navCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.navCardEmoji}>{emoji}</Text>
          <Text style={styles.navCardTitle}>{title}</Text>
          <Text style={styles.navCardSubtitle}>{subtitle}</Text>
          <View style={styles.navCardProgress}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: Colors.white + 'CC' }]} />
            </View>
            <Text style={styles.progressLabel}>{Math.round(progress * 100)}%</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { stars, completedLessons, completedQuizzes, completedChallenges } = useGameStore();
  const titleInfo = getTitle(stars);

  const lessonProgress = completedLessons.length / LESSONS.length;
  const quizProgress = completedQuizzes.length / QUIZ_LEVELS.length;
  const codeProgress = completedChallenges.length / CODE_CHALLENGES.length;
  const totalProgress = (completedLessons.length + completedQuizzes.length + completedChallenges.length) /
    (LESSONS.length + QUIZ_LEVELS.length + CODE_CHALLENGES.length);

  const totalActivities = LESSONS.length + QUIZ_LEVELS.length + CODE_CHALLENGES.length;
  const completedActivities = completedLessons.length + completedQuizzes.length + completedChallenges.length;

  const headerScale = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const mascotMood = stars >= 50 ? 'celebrating' : stars >= 20 ? 'excited' : 'happy';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.headerContent, { transform: [{ scale: headerScale }], opacity: headerOpacity }]}>
            <View style={styles.headerTop}>
              <View style={styles.headerTextBlock}>
                <Text style={styles.greeting}>Hello, Explorer! 👋</Text>
                <Text style={styles.tagline}>Let's learn about AI today!</Text>
                <View style={styles.titleBadge}>
                  <Text style={styles.titleEmoji}>{titleInfo.emoji}</Text>
                  <Text style={styles.titleText}>{titleInfo.title}</Text>
                </View>
              </View>
              <MascotCharacter mood={mascotMood} size="medium" animate />
            </View>

            {/* Stars */}
            <View style={styles.statsRow}>
              <StarCounter count={stars} size="medium" showLabel animate />
              <View style={styles.progressInfo}>
                <Text style={styles.progressInfoText}>
                  {completedActivities} / {totalActivities} completed
                </Text>
                <ProgressBar progress={totalProgress} color={Colors.white} height={8} />
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Sparky Says */}
        <View style={styles.section}>
          <View style={styles.sparkySays}>
            <Text style={styles.sparkySaysText}>
              {stars === 0
                ? "👋 Hi! I'm Sparky! Ready to learn about AI? Let's start!"
                : stars < 20
                ? `🌟 Great job earning ${stars} stars! Keep going!`
                : stars < 50
                ? `🎉 Wow, ${stars} stars! You're amazing! Keep it up!`
                : `🏆 ${stars} stars! You're an AI superstar!`}
            </Text>
          </View>
        </View>

        {/* Navigation Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What do you want to do? 🚀</Text>
          <View style={styles.cardsRow}>
            <NavCard
              emoji="📚"
              title="Learn AI"
              subtitle={`${completedLessons.length}/${LESSONS.length} lessons`}
              color="#4ECDC4"
              gradientEnd="#34B5AC"
              progress={lessonProgress}
              onPress={() => router.push('/(tabs)/learn')}
              delay={100}
            />
            <NavCard
              emoji="🧠"
              title="Quiz Time"
              subtitle={`${completedQuizzes.length}/${QUIZ_LEVELS.length} quizzes`}
              color="#A78BFA"
              gradientEnd="#8B6FE8"
              progress={quizProgress}
              onPress={() => router.push('/(tabs)/quiz')}
              delay={200}
            />
          </View>
          <View style={styles.cardsRow}>
            <NavCard
              emoji="💻"
              title="Coding"
              subtitle={`${completedChallenges.length}/${CODE_CHALLENGES.length} puzzles`}
              color="#FB923C"
              gradientEnd="#E87520"
              progress={codeProgress}
              onPress={() => router.push('/(tabs)/code')}
              delay={300}
            />
            <NavCard
              emoji="🏆"
              title="Rewards"
              subtitle="See your badges!"
              color="#34D399"
              gradientEnd="#22B87E"
              progress={0}
              onPress={() => router.push('/(tabs)/rewards')}
              delay={400}
            />
          </View>
        </View>

        {/* Daily tip */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Did you know?</Text>
              <Text style={styles.tipText}>
                The word "Robot" comes from a Czech word "robota" meaning "hard work." AI robots can work non-stop!
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextBlock: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  tagline: {
    fontSize: 14,
    color: Colors.white + 'DD',
    fontWeight: '500',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white + '33',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  titleEmoji: {
    fontSize: 14,
  },
  titleText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressInfo: {
    flex: 1,
    gap: 4,
  },
  progressInfoText: {
    fontSize: 12,
    color: Colors.white + 'CC',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  sparkySays: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary + '44',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sparkySaysText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  navCard: {
    borderRadius: 20,
    padding: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  navCardEmoji: {
    fontSize: 32,
  },
  navCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  navCardSubtitle: {
    fontSize: 12,
    color: Colors.white + 'BB',
    fontWeight: '500',
  },
  navCardProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.white + '44',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    color: Colors.white + 'CC',
    fontWeight: '700',
    minWidth: 28,
  },
  tipCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.accent + '66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipContent: {
    flex: 1,
    gap: 4,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 19,
  },
});
