export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  requirement: string;
  requirementType: 'stars' | 'lessons' | 'quizzes' | 'challenges' | 'streak';
  requirementCount: number;
}

export const BADGES: Badge[] = [
  {
    id: 'first-star',
    title: 'First Star!',
    description: 'You earned your very first star!',
    emoji: '⭐',
    color: '#FFE66D',
    requirement: 'Earn 1 star',
    requirementType: 'stars',
    requirementCount: 1,
  },
  {
    id: 'star-collector',
    title: 'Star Collector',
    description: 'You collected 25 stars — awesome!',
    emoji: '🌟',
    color: '#FFD700',
    requirement: 'Earn 25 stars',
    requirementType: 'stars',
    requirementCount: 25,
  },
  {
    id: 'star-master',
    title: 'Star Master',
    description: 'You collected 50 stars — incredible!',
    emoji: '💫',
    color: '#FFA500',
    requirement: 'Earn 50 stars',
    requirementType: 'stars',
    requirementCount: 50,
  },
  {
    id: 'ai-curious',
    title: 'AI Curious',
    description: 'You completed your first AI lesson!',
    emoji: '🔍',
    color: '#4ECDC4',
    requirement: 'Complete 1 lesson',
    requirementType: 'lessons',
    requirementCount: 1,
  },
  {
    id: 'ai-student',
    title: 'AI Student',
    description: 'You completed 3 AI lessons. Keep learning!',
    emoji: '🎒',
    color: '#FF6B6B',
    requirement: 'Complete 3 lessons',
    requirementType: 'lessons',
    requirementCount: 3,
  },
  {
    id: 'ai-expert',
    title: 'AI Expert',
    description: 'You completed ALL AI lessons. You\'re an expert!',
    emoji: '🎓',
    color: '#A78BFA',
    requirement: 'Complete 5 lessons',
    requirementType: 'lessons',
    requirementCount: 5,
  },
  {
    id: 'quiz-starter',
    title: 'Quiz Starter',
    description: 'You completed your first quiz!',
    emoji: '❓',
    color: '#FB923C',
    requirement: 'Complete 1 quiz',
    requirementType: 'quizzes',
    requirementCount: 1,
  },
  {
    id: 'quiz-champion',
    title: 'Quiz Champion',
    description: 'You completed all 4 quizzes. Champion!',
    emoji: '🏆',
    color: '#FFD700',
    requirement: 'Complete 4 quizzes',
    requirementType: 'quizzes',
    requirementCount: 4,
  },
  {
    id: 'first-code',
    title: 'Code Starter',
    description: 'You wrote your first program!',
    emoji: '💻',
    color: '#34D399',
    requirement: 'Complete 1 coding challenge',
    requirementType: 'challenges',
    requirementCount: 1,
  },
  {
    id: 'code-master',
    title: 'Code Master',
    description: 'You completed all coding challenges!',
    emoji: '🚀',
    color: '#A78BFA',
    requirement: 'Complete 5 coding challenges',
    requirementType: 'challenges',
    requirementCount: 5,
  },
];

export const STAR_TITLES = [
  { min: 0, title: 'Sparky\'s Friend', emoji: '🤖' },
  { min: 10, title: 'AI Explorer', emoji: '🔭' },
  { min: 25, title: 'AI Student', emoji: '📚' },
  { min: 50, title: 'AI Wizard', emoji: '🧙' },
  { min: 100, title: 'AI Champion', emoji: '🏆' },
];

export function getTitle(stars: number): { title: string; emoji: string } {
  const levels = [...STAR_TITLES].reverse();
  return levels.find((l) => stars >= l.min) ?? STAR_TITLES[0];
}
