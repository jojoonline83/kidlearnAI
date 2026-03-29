# KidLearnAI 🤖

A mobile application that teaches children aged 7–10 about Artificial Intelligence through interactive lessons, quizzes, block-based coding, and a reward system.

## Features

### 📚 Learn AI
Five engaging lesson modules, each with 5 illustrated pages:
- **What is AI?** — Introduction to Artificial Intelligence
- **How AI Learns** — Machine Learning explained simply
- **AI Can See!** — Computer Vision basics
- **AI Understands Words** — Natural Language Processing
- **AI in Daily Life** — Real-world AI applications

### 🧠 Quiz Time
Four quiz levels testing AI knowledge:
- AI Basics (5 questions · 15 stars)
- AI Super Eyes (5 questions · 15 stars)
- Word Wizard (5 questions · 15 stars)
- AI Champion (5 questions · 20 stars)

Features instant feedback, explanations, and animated results.

### 💻 Coding Fun
Five block-based coding challenges where kids build programs for Sparky the robot:
1. Wake Up Sparky! — sequence basics
2. Reach the Star! — multi-step sequences
3. Find the Treasure! — navigation
4. Patrol the Garden! — loops (repeat)
5. Smart Sparky! — conditionals (if/then)

Tap code blocks to build a program, then press **Run** to see Sparky execute it!

### 🏆 Rewards
- **Stars** — earn stars for completing activities; more correct answers = more stars
- **10 Badges** — unlocked automatically based on progress
- **5 Title Levels** — Sparky's Friend → AI Explorer → AI Student → AI Wizard → AI Champion
- **Progress Tracking** — see completion rates for lessons, quizzes, and coding

### 🤖 Sparky the Robot
An animated mascot that bounces, celebrates, and reacts to the child's progress throughout the app.

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo SDK 51 | Cross-platform mobile framework |
| Expo Router | File-based navigation |
| Zustand | State management |
| AsyncStorage | Persistent local storage |
| Expo Linear Gradient | Beautiful UI gradients |
| React Native Animated API | Smooth animations |
| TypeScript | Type safety |

## Running on Your Phone

### Option A — Expo Go (fastest, no build needed)

This is the easiest way to run the app on any Android or iPhone **right now**.

1. **Install Expo Go** on your phone:
   - Android: [Google Play Store → "Expo Go"](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iPhone: [App Store → "Expo Go"](https://apps.apple.com/app/expo-go/id982107779)

2. **Clone & install** on your computer:
   ```bash
   git clone <repo-url> && cd kidlearnAI
   npm install
   ```

3. **Generate image assets** (first time only):
   ```bash
   npm run generate-assets
   ```

4. **Start the dev server:**
   ```bash
   npm start
   # or if on a different network:
   npm run start:tunnel
   ```

5. **Scan the QR code** with:
   - **Android** → open Expo Go and tap "Scan QR code"
   - **iPhone** → open the default Camera app and point at the QR code

The app will load on your phone instantly. Any code changes you make will refresh live.

---

### Option B — Build an APK / IPA (install directly, no Expo Go needed)

Use [EAS Build](https://docs.expo.dev/build/introduction/) to compile a standalone app.

**Prerequisites:** free account at [expo.dev](https://expo.dev)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build Android APK (share & install on any Android phone)
npm run build:android

# Build iOS IPA (requires Apple Developer account)
npm run build:ios
```

EAS builds in the cloud — no Xcode or Android Studio needed. When the build finishes, you'll get a download link for the `.apk` / `.ipa` file.

**Install the APK on Android:**
1. Download the `.apk` from the build link
2. On your phone go to **Settings → Apps → Install unknown apps** and allow your browser
3. Open the downloaded `.apk` to install

---

### Option C — Run on simulator/emulator

```bash
# Android emulator (requires Android Studio)
npm run android

# iOS simulator (requires Xcode on macOS)
npm run ios
```

## Project Structure

```
kidlearnAI/
├── app/
│   ├── _layout.tsx          # Root layout + data loading
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar navigation
│       ├── index.tsx        # 🏠 Home screen
│       ├── learn.tsx        # 📚 Lessons screen
│       ├── quiz.tsx         # 🧠 Quiz screen
│       ├── code.tsx         # 💻 Coding screen
│       └── rewards.tsx      # 🏆 Rewards screen
├── components/
│   ├── MascotCharacter.tsx  # Sparky the robot
│   ├── ProgressBar.tsx      # Animated progress bar
│   ├── StarCounter.tsx      # Star display
│   ├── RewardBadge.tsx      # Badge component
│   └── ConfettiEffect.tsx   # Celebration confetti
├── constants/
│   ├── Colors.ts            # Design system colors
│   ├── lessons.ts           # Lesson content
│   ├── quizData.ts          # Quiz questions
│   ├── codeData.ts          # Coding challenges
│   └── rewardsData.ts       # Badges & titles
└── store/
    └── gameStore.ts         # Zustand state + AsyncStorage
```

## Design Principles

- **Large touch targets** (48px+) — easy for small fingers
- **Bright, colorful** UI — engaging for 7–10 year olds
- **Simple language** — short sentences, no jargon
- **Immediate feedback** — instant correct/wrong response
- **Progress visibility** — stars and badges always visible
- **Encouraging tone** — positive reinforcement throughout
