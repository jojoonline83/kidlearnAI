import React from 'react';
import { View, Pressable, Platform } from 'react-native';

interface TapProps {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: any;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * Cross-platform pressable.
 * On web: renders as <a href="#"> — a native browser interactive element
 *   that fires onClick reliably on ALL mobile browsers without any
 *   gesture system interference.
 * On native: renders as Pressable.
 */
export function Tap({ onPress, onPressIn, onPressOut, style, children, disabled }: TapProps) {
  if (Platform.OS === 'web') {
    const handleClick = (e: any) => {
      e.preventDefault();
      if (!disabled && onPress) onPress();
    };

    // Use <a href="#"> — works natively on all mobile browsers
    // Wrap in View if style is provided to preserve RN styling
    const inner = style
      ? React.createElement(View, { style }, children)
      : children;

    return React.createElement('a', {
      href: '#',
      onClick: handleClick,
      style: {
        display: 'block',
        textDecoration: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }
    }, inner);
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={style}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
}
