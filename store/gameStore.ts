import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BADGES, Badge } from '@/constants/rewardsData';

const STORAGE_KEY = '@kidlearnai_progress';

interface GameProgress {
  stars: number;
  completedLessons: string[];
  completedQuizzes: string[];
  completedChallenges: string[];
  earnedBadgeIds: string[];
}

interface GameStore extends GameProgress {
  isLoaded: boolean;
  addStars: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (quizId: string) => void;
  completeChallenge: (challengeId: string) => void;
  getEarnedBadges: () => Badge[];
  checkAndAwardBadges: () => Badge[];
  loadProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

const defaultProgress: GameProgress = {
  stars: 0,
  completedLessons: [],
  completedQuizzes: [],
  completedChallenges: [],
  earnedBadgeIds: [],
};

function checkBadges(progress: GameProgress): string[] {
  const newBadgeIds: string[] = [];

  for (const badge of BADGES) {
    if (progress.earnedBadgeIds.includes(badge.id)) continue;

    let earned = false;
    switch (badge.requirementType) {
      case 'stars':
        earned = progress.stars >= badge.requirementCount;
        break;
      case 'lessons':
        earned = progress.completedLessons.length >= badge.requirementCount;
        break;
      case 'quizzes':
        earned = progress.completedQuizzes.length >= badge.requirementCount;
        break;
      case 'challenges':
        earned = progress.completedChallenges.length >= badge.requirementCount;
        break;
    }

    if (earned) {
      newBadgeIds.push(badge.id);
    }
  }

  return newBadgeIds;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...defaultProgress,
  isLoaded: false,

  addStars: (amount: number) => {
    set((state) => ({ stars: state.stars + amount }));
    get().checkAndAwardBadges();
    get().saveProgress();
  },

  completeLesson: (lessonId: string) => {
    const { completedLessons } = get();
    if (!completedLessons.includes(lessonId)) {
      set((state) => ({
        completedLessons: [...state.completedLessons, lessonId],
      }));
      get().checkAndAwardBadges();
      get().saveProgress();
    }
  },

  completeQuiz: (quizId: string) => {
    const { completedQuizzes } = get();
    if (!completedQuizzes.includes(quizId)) {
      set((state) => ({
        completedQuizzes: [...state.completedQuizzes, quizId],
      }));
      get().checkAndAwardBadges();
      get().saveProgress();
    }
  },

  completeChallenge: (challengeId: string) => {
    const { completedChallenges } = get();
    if (!completedChallenges.includes(challengeId)) {
      set((state) => ({
        completedChallenges: [...state.completedChallenges, challengeId],
      }));
      get().checkAndAwardBadges();
      get().saveProgress();
    }
  },

  getEarnedBadges: () => {
    const { earnedBadgeIds } = get();
    return BADGES.filter((b) => earnedBadgeIds.includes(b.id));
  },

  checkAndAwardBadges: () => {
    const state = get();
    const newIds = checkBadges(state);
    if (newIds.length > 0) {
      set((prev) => ({
        earnedBadgeIds: [...prev.earnedBadgeIds, ...newIds],
      }));
      get().saveProgress();
      return BADGES.filter((b) => newIds.includes(b.id));
    }
    return [];
  },

  loadProgress: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: GameProgress = JSON.parse(data);
        set({ ...parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  saveProgress: async () => {
    try {
      const { stars, completedLessons, completedQuizzes, completedChallenges, earnedBadgeIds } =
        get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ stars, completedLessons, completedQuizzes, completedChallenges, earnedBadgeIds })
      );
    } catch {
      // silently fail
    }
  },

  resetProgress: async () => {
    set({ ...defaultProgress, isLoaded: true });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
}));
