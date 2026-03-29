export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  emoji: string;
}

export interface QuizLevel {
  id: string;
  title: string;
  emoji: string;
  color: string;
  questions: QuizQuestion[];
  starsReward: number;
}

export const QUIZ_LEVELS: QuizLevel[] = [
  {
    id: 'ai-basics',
    title: 'AI Basics',
    emoji: '🤖',
    color: '#FF6B6B',
    starsReward: 15,
    questions: [
      {
        id: 'q1',
        question: 'What does AI stand for?',
        options: [
          'Awesome Intelligence',
          'Artificial Intelligence',
          'Animal Instinct',
          'Amazing Internet',
        ],
        correct: 1,
        explanation: 'AI stands for Artificial Intelligence — a computer brain that can think and learn!',
        emoji: '🧠',
      },
      {
        id: 'q2',
        question: 'How does AI get smarter?',
        options: [
          'By sleeping a lot',
          'By watching TV',
          'By learning from examples',
          'By eating electricity',
        ],
        correct: 2,
        explanation: 'AI learns from examples! The more examples it sees, the smarter it becomes!',
        emoji: '📚',
      },
      {
        id: 'q3',
        question: 'Which of these uses AI?',
        options: [
          'A regular pencil',
          'A voice assistant like Siri',
          'A regular chair',
          'A simple clock',
        ],
        correct: 1,
        explanation: 'Voice assistants use AI to understand your voice and answer questions!',
        emoji: '🎙️',
      },
      {
        id: 'q4',
        question: 'What is training in AI?',
        options: [
          'Going to the gym',
          'Teaching AI with lots of examples',
          'Running a race',
          'Drawing pictures',
        ],
        correct: 1,
        explanation: 'Training is when we teach AI by showing it many examples — like going to school!',
        emoji: '🏫',
      },
      {
        id: 'q5',
        question: 'What is "data" in AI?',
        options: [
          'A type of food',
          'Information like pictures, words, or numbers',
          'A new dance move',
          'A planet in space',
        ],
        correct: 1,
        explanation: 'Data is information! AI learns from data — pictures, words, numbers, and more!',
        emoji: '💾',
      },
    ],
  },
  {
    id: 'ai-vision',
    title: 'AI Super Eyes',
    emoji: '👁️',
    color: '#A78BFA',
    starsReward: 15,
    questions: [
      {
        id: 'v1',
        question: 'What is Computer Vision?',
        options: [
          'A type of glasses for computers',
          'When AI can see and understand pictures',
          'A vision test for robots',
          'A computer screen',
        ],
        correct: 1,
        explanation: 'Computer Vision lets AI understand pictures and videos — like giving computers eyes!',
        emoji: '📸',
      },
      {
        id: 'v2',
        question: 'How does your phone recognize your face?',
        options: [
          'It guesses randomly',
          'A person looks through the camera',
          'AI learned what your face looks like',
          'It just remembers your name',
        ],
        correct: 2,
        explanation: 'Your phone uses AI! It learned your face and recognizes you every time!',
        emoji: '😊',
      },
      {
        id: 'v3',
        question: 'What helps self-driving cars see?',
        options: [
          'A driver with binoculars',
          'Magic spells',
          'Cameras and AI',
          'Very bright headlights',
        ],
        correct: 2,
        explanation: 'Self-driving cars use cameras and AI to see the road and drive safely!',
        emoji: '🚗',
      },
      {
        id: 'v4',
        question: 'How do doctors use AI vision?',
        options: [
          'To see patients better without glasses',
          'To look at X-rays and scans',
          'To watch medical shows',
          'To check the weather',
        ],
        correct: 1,
        explanation: 'Doctors use AI to analyze X-rays and medical scans to help patients!',
        emoji: '🔬',
      },
      {
        id: 'v5',
        question: 'If you show AI 1000 dog pictures, what can it do?',
        options: [
          'Become a dog',
          'Bark at strangers',
          'Recognize dogs in new pictures',
          'Nothing — computers can\'t learn',
        ],
        correct: 2,
        explanation: 'After seeing 1000 dogs, AI learns what dogs look like and can spot them anywhere!',
        emoji: '🐕',
      },
    ],
  },
  {
    id: 'ai-language',
    title: 'Word Wizard',
    emoji: '💬',
    color: '#FB923C',
    starsReward: 15,
    questions: [
      {
        id: 'l1',
        question: 'What does AI use to understand our words?',
        options: [
          'Magic crystals',
          'Natural Language Processing',
          'A giant dictionary',
          'Mind reading',
        ],
        correct: 1,
        explanation: 'Natural Language Processing (NLP) helps AI understand human language!',
        emoji: '📝',
      },
      {
        id: 'l2',
        question: 'How many languages can AI translate?',
        options: [
          'Only 2',
          'About 10',
          'Over 100 languages',
          'Just English',
        ],
        correct: 2,
        explanation: 'AI can translate over 100 languages! It\'s like having the world\'s best translator!',
        emoji: '🌍',
      },
      {
        id: 'l3',
        question: 'If you ask Alexa "What\'s the weather?", what does AI do?',
        options: [
          'Goes outside to check',
          'Makes up an answer',
          'Understands your question and finds the answer',
          'Ignores you',
        ],
        correct: 2,
        explanation: 'Alexa uses AI to understand your words and find the right answer!',
        emoji: '🎙️',
      },
      {
        id: 'l4',
        question: 'How did AI learn to understand words?',
        options: [
          'It was born knowing all words',
          'By reading millions of books and texts',
          'A teacher taught it one word at a time',
          'By watching cartoons',
        ],
        correct: 1,
        explanation: 'AI read millions of books, articles, and websites to learn about language!',
        emoji: '📖',
      },
      {
        id: 'l5',
        question: 'What CAN AI that understands language do?',
        options: [
          'Only listen to music',
          'Write stories, answer questions, and translate',
          'Only say "Hello"',
          'Play video games',
        ],
        correct: 1,
        explanation: 'Language AI can write stories, answer questions, translate, and so much more!',
        emoji: '✍️',
      },
    ],
  },
  {
    id: 'ai-daily-life',
    title: 'AI Champion',
    emoji: '🏆',
    color: '#34D399',
    starsReward: 20,
    questions: [
      {
        id: 'd1',
        question: 'When YouTube suggests a video you might like, what is happening?',
        options: [
          'A person picked it for you',
          'AI is recommending it based on what you like',
          'The video appeared by accident',
          'Your friend shared it',
        ],
        correct: 1,
        explanation: 'YouTube uses AI to learn what you enjoy and suggest videos you\'ll love!',
        emoji: '📺',
      },
      {
        id: 'd2',
        question: 'How does AI in games work?',
        options: [
          'A person plays all the characters',
          'The characters are pre-programmed with no AI',
          'AI controls the computer players to make them smart',
          'Magic controls the game',
        ],
        correct: 2,
        explanation: 'AI controls the computer players in games, making them challenging to play against!',
        emoji: '🎮',
      },
      {
        id: 'd3',
        question: 'What is a spam filter?',
        options: [
          'A filter for your fish tank',
          'AI that stops bad emails from reaching you',
          'A type of food',
          'A way to clean your computer',
        ],
        correct: 1,
        explanation: 'Spam filters use AI to identify and block junk emails before they reach you!',
        emoji: '📧',
      },
      {
        id: 'd4',
        question: 'How do weather apps predict the weather?',
        options: [
          'They look out the window',
          'They guess randomly',
          'AI studies weather patterns to predict what\'s coming',
          'A magic 8-ball decides',
        ],
        correct: 2,
        explanation: 'AI analyzes weather data and patterns to make accurate predictions!',
        emoji: '⛅',
      },
      {
        id: 'd5',
        question: 'What is the BEST description of AI?',
        options: [
          'A robot that does housework',
          'A computer system that learns and helps solve problems',
          'An expensive video game',
          'A type of internet connection',
        ],
        correct: 1,
        explanation: 'AI is a computer system that learns from data and helps solve all kinds of problems!',
        emoji: '🤖',
      },
    ],
  },
];
