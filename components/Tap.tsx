import React, { useRef } from 'react';
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
 * On web: uses both onTouchEnd (mobile) and onClick (desktop) on a View,
 *   with debounce to prevent double-fire. touch-action:manipulation disables
 *   scroll-gesture detection so taps fire immediately.
 * On native: Pressable.
 */
export function Tap({ onPress, onPressIn, onPressOut, style, children, disabled }: TapProps) {
  const lastEventTime = useRef(0);

  if (Platform.OS === 'web') {
    const handleInteraction = (e: any) => {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      const now = Date.now();
      if (now - lastEventTime.current < 600) return; // debounce double-fire
      lastEventTime.current = now;
      if (!disabled && onPress) onPress();
    };

    return (
      <View
        onTouchEnd={handleInteraction as any}
        onClick={handleInteraction as any}
        style={[
          {
            touchAction: 'manipulation',
            userSelect: 'none',
            cursor: disabled ? 'default' : 'pointer',
            WebkitTapHighlightColor: 'transparent',
          } as any,
          style,
        ]}
      >
        {children}
      </View>
    );
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
