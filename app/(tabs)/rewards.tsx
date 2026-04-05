import React, { useRef, useEffect, useState } from 'react';
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
import { BADGES, STAR_TITLES, getTitle } from '@/constants/rewardsData';
import { LESSONS } from '@/constants/lessons';
import { QUIZ_LEVELS } from '@/constants/quizData';
import { CODE_CHALLENGES } from '@/constants/codeData';
import { useGameStore } from '@/store/gameStore';
import RewardBadge from '@/components/RewardBadge';
import MascotCharacter from '@/components/MascotCharacter';
import ProgressBar from '@/components/ProgressBar';
import StarCounter from '@/components/StarCounter';

interface BadgeDetailModalProps {
  badge: typeof BADGES[0] | null;
  earned: boolean;
  onClose: () => void;
}

function BadgeDetailModal({ badge, earned, onClose }: BadgeDetailModalProps) {
  if (!badge) return null;
  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalCard}>
          <View style={[styles.modalBadgeCircle, { backgroundColor: earned ? badge.color : Colors.border }]}>
            <Text style={styles.modalBadgeEmoji}>{badge.emoji}</Text>
          </View>
          <Text style={styles.modalBadgeTitle}>{badge.title}</Text>
          <Text style={styles.modalBadgeDesc}>{badge.description}</Text>
          <View style={[styles.modalRequirement, { borderColor: earned ? Colors.green : Colors.border }]}>
            <Text style={[styles.modalRequirementText, { color: earned ? Colors.greenDark : Colors.textMuted }]}>
              {earned ? '✅ Achieved: ' : '🎯 Goal: '}
              {badge.requirement}
            </Text>
          </View>
          {!earned && (
            <Text style={styles.modalMotivation}>Keep going! You can do it! 💪</Text>
          )}
          <Pressable onPress={onClose} style={[styles.modalCloseBtn, { backgroundColor: badge.color }]}>
            <Text style={styles.modalCloseBtnText}>Got it! 👍</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function RewardsScreen() {
  const { stars, completedLessons, completedQuizzes, completedChallenges, earnedBadgeIds } =
    useGameStore();

  const [selectedBadge, setSelectedBadge] = useState<typeof BADGES[0] | null>(null);

  const isWeb = Platform.OS === 'web';
  const headerAnim = useRef(new Animated.Value(isWeb ? 1 : 0)).current;
  const headerScale = useRef(new Animated.Value(isWeb ? 1 : 0.9)).current;

  useEffect(() => {
    if (isWeb) return;
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: Platform.OS !== 'web' }),
      Animated.spring(headerScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  }, []);

  const titleInfo = getTitle(stars);
  const earnedCount = earnedBadgeIds.length;

  // Stats
  const totalActivities = LESSONS.length + QUIZ_LEVELS.length + CODE_CHALLENGES.length;
  const completedActivities = completedLessons.length + completedQuizzes.length + completedChallenges.length;

  // Next title level
  const currentTitleIdx = STAR_TITLES.findIndex((t) => t.title === titleInfo.title);
  const nextTitle = STAR_TITLES[currentTitleIdx + 1];
  const starsToNext = nextTitle ? nextTitle.min - stars : null;

  const mascotMood = stars >= 50 ? 'celebrating' : earnedCount >= 5 ? 'excited' : 'happy';

  return (
    <SafeAreaView style={styles.safeArea}>
      <BadgeDetailModal
        badge={selectedBadge}
        earned={selectedBadge ? earnedBadgeIds.includes(selectedBadge.id) : false}
        onClose={() => setSelectedBadge(null)}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#34D399', '#22B87E']} style={styles.header}>
          <Animated.View style={{ opacity: headerAnim, transform: [{ scale: headerScale }] }}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>🏆 My Rewards</Text>
                <Text style={styles.headerSubtitle}>Your amazing achievements!</Text>

                {/* Current title */}
                <View style={styles.titleCard}>
                  <Text style={styles.titleCardEmoji}>{titleInfo.emoji}</Text>
                  <View>
                    <Text style={styles.titleCardLabel}>Your Title</Text>
                    <Text style={styles.titleCardTitle}>{titleInfo.title}</Text>
                  </View>
                </View>
              </View>
              <MascotCharacter mood={mascotMood} size="medium" animate />
            </View>

            {/* Stars display */}
            <View style={styles.starsDisplay}>
              <StarCounter count={stars} size="large" showLabel animate />
              {nextTitle && (
                <Text style={styles.nextTitleText}>
                  {starsToNext} more ⭐ to become {nextTitle.title} {nextTitle.emoji}
                </Text>
              )}
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Your Progress</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: Colors.secondary, borderLeftWidth: 4 }]}>
              <Text style={styles.statEmoji}>📚</Text>
              <Text style={styles.statNumber}>{completedLessons.length}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
              <ProgressBar
                progress={completedLessons.length / LESSONS.length}
                color={Colors.secondary}
                height={6}
              />
            </View>
            <View style={[styles.statCard, { borderLeftColor: Colors.purple, borderLeftWidth: 4 }]}>
              <Text style={styles.statEmoji}>🧠</Text>
              <Text style={styles.statNumber}>{completedQuizzes.length}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
              <ProgressBar
                progress={completedQuizzes.length / QUIZ_LEVELS.length}
                color={Colors.purple}
                height={6}
              />
            </View>
            <View style={[styles.statCard, { borderLeftColor: Colors.orange, borderLeftWidth: 4 }]}>
              <Text style={styles.statEmoji}>💻</Text>
              <Text style={styles.statNumber}>{completedChallenges.length}</Text>
              <Text style={styles.statLabel}>Coding</Text>
              <ProgressBar
                progress={completedChallenges.length / CODE_CHALLENGES.length}
                color={Colors.orange}
                height={6}
              />
            </View>
            <View style={[styles.statCard, { borderLeftColor: Colors.green, borderLeftWidth: 4 }]}>
              <Text style={styles.statEmoji}>🏅</Text>
              <Text style={styles.statNumber}>{earnedCount}</Text>
              <Text style={styles.statLabel}>Badges</Text>
              <ProgressBar
                progress={earnedCount / BADGES.length}
                color={Colors.green}
                height={6}
              />
            </View>
          </View>

          {/* Overall progress */}
          <View style={styles.overallCard}>
            <Text style={styles.overallTitle}>Overall Journey</Text>
            <ProgressBar
              progress={completedActivities / totalActivities}
              color={Colors.primary}
              height={14}
              showLabel
            />
            <Text style={styles.overallSubText}>
              {completedActivities} of {totalActivities} activities completed!
            </Text>
          </View>
        </View>

        {/* Title Ladder */}
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>⭐ Title Levels</Text>
          <View style={styles.titleLadder}>
            {STAR_TITLES.map((level, i) => {
              const reached = stars >= level.min;
              const isCurrent = titleInfo.title === level.title;
              return (
                <View
                  key={level.title}
                  style={[
                    styles.titleLevel,
                    reached && styles.titleLevelReached,
                    isCurrent && styles.titleLevelCurrent,
                  ]}
                >
                  <Text style={[styles.titleLevelEmoji, !reached && { opacity: 0.4 }]}>
                    {level.emoji}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.titleLevelName, !reached && { color: Colors.textMuted }]}>
                      {level.title}
                    </Text>
                    <Text style={styles.titleLevelReq}>
                      {level.min === 0 ? 'Starting level' : `${level.min} stars needed`}
                    </Text>
                  </View>
                  {isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>You!</Text>
                    </View>
                  )}
                  {reached && !isCurrent && <Text style={styles.checkMark}>✅</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgesSection}>
          <View style={styles.badgesHeader}>
            <Text style={styles.sectionTitle}>🏅 Badge Collection</Text>
            <Text style={styles.badgeCount}>{earnedCount}/{BADGES.length}</Text>
          </View>
          <Text style={styles.badgesHint}>Tap a badge to learn more!</Text>
          <View style={styles.badgesGrid}>
            {BADGES.map((badge) => (
              <RewardBadge
                key={badge.id}
                badge={badge}
                earned={earnedBadgeIds.includes(badge.id)}
                onPress={() => setSelectedBadge(badge)}
                showTitle
              />
            ))}
          </View>
        </View>

        {/* Motivational footer */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>
            {completedActivities === totalActivities ? '🏆' : '🚀'}
          </Text>
          <Text style={styles.motivationText}>
            {completedActivities === totalActivities
              ? 'You completed everything! You\'re an AI Champion!'
              : stars === 0
              ? 'Start your journey! Complete lessons to earn stars and badges!'
              : `You're doing amazing! Keep learning to unlock more badges!`}
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },

  header: { padding: 24, paddingTop: 16 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerLeft: { flex: 1, gap: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.white },
  headerSubtitle: { fontSize: 14, color: Colors.white + 'DD', fontWeight: '500' },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white + '33',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  titleCardEmoji: { fontSize: 20 },
  titleCardLabel: { fontSize: 10, color: Colors.white + 'BB', fontWeight: '600' },
  titleCardTitle: { fontSize: 14, fontWeight: '800', color: Colors.white },
  starsDisplay: { gap: 8 },
  nextTitleText: { fontSize: 12, color: Colors.white + 'CC', fontWeight: '600' },

  statsSection: { padding: 20, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statEmoji: { fontSize: 22 },
  statNumber: { fontSize: 28, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  overallCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  overallTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  overallSubText: { fontSize: 13, color: Colors.textLight, fontWeight: '500' },

  titleSection: { paddingHorizontal: 20, paddingBottom: 20 },
  titleLadder: { gap: 8, marginTop: 4 },
  titleLevel: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  titleLevelReached: { borderColor: Colors.green + '66' },
  titleLevelCurrent: {
    borderColor: Colors.green,
    backgroundColor: Colors.green + '0F',
  },
  titleLevelEmoji: { fontSize: 26 },
  titleLevelName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  titleLevelReq: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  currentBadge: {
    backgroundColor: Colors.green,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.white },
  checkMark: { fontSize: 20 },

  badgesSection: { paddingHorizontal: 20, paddingBottom: 20 },
  badgesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  badgeCount: { fontSize: 15, fontWeight: '800', color: Colors.textLight },
  badgesHint: { fontSize: 12, color: Colors.textMuted, marginBottom: 12, fontStyle: 'italic' },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },

  motivationCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary + '18',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: Colors.primary + '44',
  },
  motivationEmoji: { fontSize: 36 },
  motivationText: { flex: 1, fontSize: 14, color: Colors.text, fontWeight: '600', lineHeight: 21 },

  // Badge detail modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalBadgeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalBadgeEmoji: { fontSize: 44 },
  modalBadgeTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  modalBadgeDesc: { fontSize: 14, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
  modalRequirement: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    backgroundColor: Colors.background,
  },
  modalRequirementText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  modalMotivation: { fontSize: 15, color: Colors.orange, fontWeight: '700', textAlign: 'center' },
  modalCloseBtn: {
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 4,
  },
  modalCloseBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white },
});
