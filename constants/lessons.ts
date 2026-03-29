export interface LessonPage {
  title: string;
  text: string;
  emoji: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  pages: LessonPage[];
  stars: number;
}

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-ai',
    title: 'What is AI?',
    subtitle: 'Meet your robot friend!',
    emoji: '🤖',
    color: '#FF6B6B',
    stars: 10,
    pages: [
      {
        title: 'Hello, I am AI!',
        text: 'AI stands for Artificial Intelligence. Think of AI as a super-smart computer brain that can learn and think — kind of like YOU!',
        emoji: '🧠',
      },
      {
        title: 'AI is Everywhere!',
        text: 'AI is in your phone, your games, and even in toys! When you talk to a voice assistant, that\'s AI listening and understanding you.',
        emoji: '📱',
      },
      {
        title: 'AI Can Learn!',
        text: 'Just like you learn at school, AI learns from examples. The more examples it sees, the smarter it gets! Pretty cool, right?',
        emoji: '📚',
      },
      {
        title: 'AI Helps People',
        text: 'AI helps doctors find sicknesses, helps scientists discover new things, and even helps artists make amazing pictures!',
        emoji: '🩺',
      },
      {
        title: 'You Did It! 🎉',
        text: 'Amazing job! You now know what AI is! AI is a computer brain that learns from examples and helps people in many ways.',
        emoji: '🌟',
      },
    ],
  },
  {
    id: 'how-ai-learns',
    title: 'How AI Learns',
    subtitle: 'Training a robot brain!',
    emoji: '🎓',
    color: '#4ECDC4',
    stars: 10,
    pages: [
      {
        title: 'Learning from Examples',
        text: 'Imagine showing a friend 1000 pictures of cats and saying "This is a cat!" After seeing so many cats, your friend can recognize cats anywhere!',
        emoji: '🐱',
      },
      {
        title: 'This is called Training!',
        text: 'When we teach AI with lots of examples, we call it TRAINING. It\'s like going to school, but for computers!',
        emoji: '🏫',
      },
      {
        title: 'Machine Learning',
        text: 'Machine Learning is when computers learn by themselves from lots of data. Data is just information — like pictures, words, or numbers!',
        emoji: '💻',
      },
      {
        title: 'Making Mistakes',
        text: 'AI makes mistakes too! But each mistake helps it learn and get better. Just like when you practice riding a bike!',
        emoji: '🚲',
      },
      {
        title: 'Super Smart Now! 🎉',
        text: 'Fantastic! You learned how AI gets smarter! It looks at lots of examples, practices, and gets better each time — just like YOU!',
        emoji: '⭐',
      },
    ],
  },
  {
    id: 'ai-can-see',
    title: 'AI Can See!',
    subtitle: 'Computer eyes are amazing',
    emoji: '👁️',
    color: '#A78BFA',
    stars: 10,
    pages: [
      {
        title: 'Computer Vision',
        text: 'AI can look at pictures and understand what\'s in them! This is called Computer Vision. It\'s like giving computers eyes!',
        emoji: '📸',
      },
      {
        title: 'Recognizing Faces',
        text: 'Have you noticed your phone can recognize YOUR face to unlock? That\'s AI using computer vision! It learned what your face looks like.',
        emoji: '😊',
      },
      {
        title: 'Self-Driving Cars',
        text: 'Some cars can drive themselves! They use cameras and AI to see the road, other cars, and traffic lights — all by themselves!',
        emoji: '🚗',
      },
      {
        title: 'Helping Doctors',
        text: 'Doctors use AI to look at X-rays and scans. AI can spot things that might be hard for humans to see. It helps keep people healthy!',
        emoji: '🔬',
      },
      {
        title: 'Amazing Eyes! 🎉',
        text: 'Wow, you\'re so smart! AI eyes (computer vision) can recognize faces, help cars drive, and even help doctors. So cool!',
        emoji: '🏆',
      },
    ],
  },
  {
    id: 'ai-understands-words',
    title: 'AI Understands Words',
    subtitle: 'Talking to computers!',
    emoji: '💬',
    color: '#FB923C',
    stars: 10,
    pages: [
      {
        title: 'Understanding Language',
        text: 'AI can read and understand words! When you type a question and get an answer back, that\'s AI understanding your language!',
        emoji: '📝',
      },
      {
        title: 'Voice Assistants',
        text: 'Have you ever asked Siri, Alexa, or Google a question? They use AI to hear your voice and understand what you\'re asking!',
        emoji: '🎙️',
      },
      {
        title: 'Translation Magic',
        text: 'AI can translate words from one language to another! It can turn English into Spanish, French, Japanese, and over 100 other languages!',
        emoji: '🌍',
      },
      {
        title: 'Writing Stories',
        text: 'Some AI can even write stories, poems, and songs! It learned from reading millions of books and uses that knowledge to create new things.',
        emoji: '✍️',
      },
      {
        title: 'Word Wizard! 🎉',
        text: 'Excellent work! AI understands our words, answers questions, translates languages, and can even write stories. Language AI is magical!',
        emoji: '🌈',
      },
    ],
  },
  {
    id: 'ai-in-daily-life',
    title: 'AI in Daily Life',
    subtitle: 'AI is your helpful friend!',
    emoji: '🌟',
    color: '#34D399',
    stars: 10,
    pages: [
      {
        title: 'AI Recommends Things',
        text: 'When YouTube suggests a video you might like, or Netflix shows you a movie — that\'s AI! It learns what YOU enjoy and finds more like it.',
        emoji: '📺',
      },
      {
        title: 'AI in Games',
        text: 'In video games, AI controls the computer players! That\'s why they can play chess, fight in battle games, or race against you!',
        emoji: '🎮',
      },
      {
        title: 'Keeping Us Safe',
        text: 'Email spam filters use AI to stop bad emails from reaching you. AI also helps detect fraud to keep your family\'s money safe!',
        emoji: '🛡️',
      },
      {
        title: 'Weather Forecasting',
        text: 'Weather apps use AI to predict rain, sunshine, and storms. AI studies patterns in weather data to guess what\'s coming next!',
        emoji: '⛅',
      },
      {
        title: 'AI Champion! 🎉',
        text: 'You finished all 5 lessons! You are now an AI expert! AI is in games, videos, weather apps, and everywhere around us. Amazing!',
        emoji: '🏆',
      },
    ],
  },
];
