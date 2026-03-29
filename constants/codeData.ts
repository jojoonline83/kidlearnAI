export interface CodeBlock {
  id: string;
  label: string;
  emoji: string;
  color: string;
  category: 'move' | 'turn' | 'repeat' | 'condition' | 'say' | 'action';
}

export interface CodeChallenge {
  id: string;
  title: string;
  story: string;
  goal: string;
  emoji: string;
  color: string;
  availableBlocks: CodeBlock[];
  solution: string[];
  hint: string;
  stars: number;
}

export const ALL_CODE_BLOCKS: CodeBlock[] = [
  { id: 'move_forward', label: 'Move Forward', emoji: '⬆️', color: '#4ECDC4', category: 'move' },
  { id: 'move_back', label: 'Move Back', emoji: '⬇️', color: '#4ECDC4', category: 'move' },
  { id: 'turn_left', label: 'Turn Left', emoji: '⬅️', color: '#A78BFA', category: 'turn' },
  { id: 'turn_right', label: 'Turn Right', emoji: '➡️', color: '#A78BFA', category: 'turn' },
  { id: 'jump', label: 'Jump', emoji: '🦘', color: '#34D399', category: 'action' },
  { id: 'pick_up', label: 'Pick Up', emoji: '🤏', color: '#34D399', category: 'action' },
  { id: 'say_hello', label: 'Say Hello', emoji: '👋', color: '#FFE66D', category: 'say' },
  { id: 'say_thanks', label: 'Say Thanks', emoji: '🙏', color: '#FFE66D', category: 'say' },
  { id: 'repeat_x2', label: 'Repeat × 2', emoji: '🔁', color: '#FB923C', category: 'repeat' },
  { id: 'repeat_x3', label: 'Repeat × 3', emoji: '🔄', color: '#FB923C', category: 'repeat' },
  { id: 'if_star', label: 'If ⭐ → Pick Up', emoji: '🌟', color: '#FF6B6B', category: 'condition' },
  { id: 'if_wall', label: 'If Wall → Turn', emoji: '🧱', color: '#FF6B6B', category: 'condition' },
];

export const CODE_CHALLENGES: CodeChallenge[] = [
  {
    id: 'hello-sparky',
    title: 'Wake Up Sparky!',
    story: 'Sparky the robot just woke up and doesn\'t know what to do. Help Sparky say hello to everyone!',
    goal: 'Make Sparky say hello',
    emoji: '👋',
    color: '#FFE66D',
    stars: 10,
    availableBlocks: [
      { id: 'say_hello', label: 'Say Hello', emoji: '👋', color: '#FFE66D', category: 'say' },
      { id: 'move_forward', label: 'Move Forward', emoji: '⬆️', color: '#4ECDC4', category: 'move' },
      { id: 'jump', label: 'Jump', emoji: '🦘', color: '#34D399', category: 'action' },
      { id: 'turn_left', label: 'Turn Left', emoji: '⬅️', color: '#A78BFA', category: 'turn' },
    ],
    solution: ['say_hello'],
    hint: 'Sparky just needs ONE block to say hello to everyone!',
  },
  {
    id: 'reach-the-star',
    title: 'Reach the Star!',
    story: 'There\'s a shiny star ahead of Sparky! Help Sparky move forward to pick it up.',
    goal: 'Move forward then pick up the star',
    emoji: '⭐',
    color: '#4ECDC4',
    stars: 10,
    availableBlocks: [
      { id: 'move_forward', label: 'Move Forward', emoji: '⬆️', color: '#4ECDC4', category: 'move' },
      { id: 'pick_up', label: 'Pick Up', emoji: '🤏', color: '#34D399', category: 'action' },
      { id: 'turn_right', label: 'Turn Right', emoji: '➡️', color: '#A78BFA', category: 'turn' },
      { id: 'say_hello', label: 'Say Hello', emoji: '👋', color: '#FFE66D', category: 'say' },
      { id: 'jump', label: 'Jump', emoji: '🦘', color: '#34D399', category: 'action' },
    ],
    solution: ['move_forward', 'pick_up'],
    hint: 'First move to the star, then pick it up!',
  },
  {
    id: 'find-the-treasure',
    title: 'Find the Treasure!',
    story: 'The treasure box is around the corner! Sparky needs to move forward, turn right, then move again to reach it.',
    goal: 'Navigate around the corner to the treasure',
    emoji: '💎',
    color: '#A78BFA',
    stars: 15,
    availableBlocks: [
      { id: 'move_forward', label: 'Move Forward', emoji: '⬆️', color: '#4ECDC4', category: 'move' },
      { id: 'turn_right', label: 'Turn Right', emoji: '➡️', color: '#A78BFA', category: 'turn' },
      { id: 'turn_left', label: 'Turn Left', emoji: '⬅️', color: '#A78BFA', category: 'turn' },
      { id: 'pick_up', label: 'Pick Up', emoji: '🤏', color: '#34D399', category: 'action' },
      { id: 'jump', label: 'Jump', emoji: '🦘', color: '#34D399', category: 'action' },
    ],
    solution: ['move_forward', 'turn_right', 'move_forward', 'pick_up'],
    hint: 'Move, turn right, move again, then pick it up!',
  },
  {
    id: 'loop-patrol',
    title: 'Patrol the Garden!',
    story: 'Sparky needs to water 3 flowers! Instead of watering each one separately, use REPEAT to do it 3 times!',
    goal: 'Water 3 flowers using repeat',
    emoji: '🌸',
    color: '#FB923C',
    stars: 15,
    availableBlocks: [
      { id: 'repeat_x3', label: 'Repeat × 3', emoji: '🔄', color: '#FB923C', category: 'repeat' },
      { id: 'move_forward', label: 'Move Forward', emoji: '⬆️', color: '#4ECDC4', category: 'move' },
      { id: 'pick_up', label: 'Water Flower', emoji: '💧', color: '#34D399', category: 'action' },
      { id: 'repeat_x2', label: 'Repeat × 2', emoji: '🔁', color: '#FB923C', category: 'repeat' },
      { id: 'say_hello', label: 'Say Hello', emoji: '👋', color: '#FFE66D', category: 'say' },
    ],
    solution: ['repeat_x3', 'move_forward', 'pick_up'],
    hint: 'Use Repeat × 3 first, then the actions inside the loop!',
  },
  {
    id: 'smart-decision',
    title: 'Smart Sparky!',
    story: 'Sparky is looking for stars. If there\'s a star, pick it up! Sparky needs to make a smart decision.',
    goal: 'Use a condition to pick up stars',
    emoji: '🌟',
    color: '#34D399',
    stars: 20,
    availableBlocks: [
      { id: 'if_star', label: 'If ⭐ → Pick Up', emoji: '🌟', color: '#FF6B6B', category: 'condition' },
      { id: 'move_forward', label: 'Move Forward', emoji: '⬆️', color: '#4ECDC4', category: 'move' },
      { id: 'say_thanks', label: 'Say Thanks', emoji: '🙏', color: '#FFE66D', category: 'say' },
      { id: 'pick_up', label: 'Pick Up', emoji: '🤏', color: '#34D399', category: 'action' },
      { id: 'if_wall', label: 'If Wall → Turn', emoji: '🧱', color: '#FF6B6B', category: 'condition' },
    ],
    solution: ['move_forward', 'if_star', 'say_thanks'],
    hint: 'Move to the area, check IF there\'s a star, then say thanks!',
  },
];
