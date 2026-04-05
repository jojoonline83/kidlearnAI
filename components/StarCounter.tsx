import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

interface StarCounterProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animate?: boolean;
}

export default function StarCounter({
  count,
  size = 'medium',
  showLabel = true,
  animate = false,
}: StarCounterProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(count);

  useEffect(() => {
    if (animate && count > prevCount.current) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.4, duration: 200, useNativeDriver: Platform.OS !== 'web' }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    }
    prevCount.current = count;
  }, [count, animate]);

  const fontSize = { small: 16, medium: 22, large: 32 }[size];
  const starSize = { small: 14, medium: 20, large: 28 }[size];

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={{ fontSize: starSize }}>⭐</Text>
      <Text style={[styles.count, { fontSize }]}>{count}</Text>
      {showLabel && <Text style={[styles.label, { fontSize: fontSize - 6 }]}>Stars</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '33',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.accentDark,
  },
  count: {
    fontWeight: '800',
    color: Colors.text,
  },
  label: {
    color: Colors.textLight,
    fontWeight: '600',
  },
});
