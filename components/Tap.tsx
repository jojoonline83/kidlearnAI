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
 * Cross-platform pressable. On web uses View+onClick (standard DOM event),
 * on native uses Pressable (responder system).
 */
export function Tap({ onPress, onPressIn, onPressOut, style, children, disabled }: TapProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        onClick={disabled ? undefined : (onPress as any)}
        style={[style, { cursor: disabled ? 'default' : 'pointer' } as any]}
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
