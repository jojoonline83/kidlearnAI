import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface MascotCharacterProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
  message?: string;
}

export default function MascotCharacter({
  mood = 'happy',
  size = 'medium',
  animate = true,
  message,
}: MascotCharacterProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) return;

    if (mood === 'celebrating') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -20, duration: 300, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: -15, duration: 250, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -8, duration: 800, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }

    if (mood === 'excited') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.08, duration: 400, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [mood, animate]);

  const dimensions = {
    small: { robot: 60, head: 36, eye: 7, pupil: 3, body: 28 },
    medium: { robot: 100, head: 60, eye: 12, pupil: 5, body: 48 },
    large: { robot: 140, head: 84, eye: 16, pupil: 7, body: 66 },
  }[size];

  const eyeExpression = mood === 'thinking' ? '^' : null;
  const mouthStyle = {
    happy: { width: dimensions.head * 0.4, height: dimensions.head * 0.15, borderRadius: 8 },
    excited: { width: dimensions.head * 0.45, height: dimensions.head * 0.18, borderRadius: 10 },
    thinking: { width: dimensions.head * 0.3, height: 3, borderRadius: 2 },
    celebrating: { width: dimensions.head * 0.5, height: dimensions.head * 0.2, borderRadius: 12 },
  }[mood];

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: bounceAnim }, { scale: scaleAnim }] },
      ]}
    >
      {/* Antenna */}
      <View style={[styles.antenna, { height: dimensions.head * 0.25, width: 4 }]} />
      <View style={[styles.antennaBall, { width: 10, height: 10, marginTop: -5 }]} />

      {/* Head */}
      <View
        style={[
          styles.head,
          {
            width: dimensions.head,
            height: dimensions.head,
            borderRadius: dimensions.head * 0.2,
          },
        ]}
      >
        {/* Eyes row */}
        <View style={styles.eyesRow}>
          {/* Left eye */}
          <View style={[styles.eye, { width: dimensions.eye, height: dimensions.eye, borderRadius: dimensions.eye / 2 }]}>
            {!eyeExpression && (
              <View style={[styles.pupil, { width: dimensions.pupil, height: dimensions.pupil, borderRadius: dimensions.pupil / 2 }]} />
            )}
            {eyeExpression && <Text style={{ fontSize: dimensions.eye * 0.8 }}>{eyeExpression}</Text>}
          </View>
          {/* Right eye */}
          <View style={[styles.eye, { width: dimensions.eye, height: dimensions.eye, borderRadius: dimensions.eye / 2 }]}>
            {!eyeExpression && (
              <View style={[styles.pupil, { width: dimensions.pupil, height: dimensions.pupil, borderRadius: dimensions.pupil / 2 }]} />
            )}
            {eyeExpression && <Text style={{ fontSize: dimensions.eye * 0.8 }}>{eyeExpression}</Text>}
          </View>
        </View>

        {/* Mouth */}
        <View style={[styles.mouth, mouthStyle]} />

        {/* Cheeks */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'excited') && (
          <View style={styles.cheeksRow}>
            <View style={[styles.cheek, { width: dimensions.eye * 1.2, height: dimensions.eye * 0.6 }]} />
            <View style={[styles.cheek, { width: dimensions.eye * 1.2, height: dimensions.eye * 0.6 }]} />
          </View>
        )}
      </View>

      {/* Body */}
      <View
        style={[
          styles.body,
          {
            width: dimensions.body,
            height: dimensions.body * 0.8,
            borderRadius: 8,
          },
        ]}
      >
        {/* Body light */}
        <View style={styles.bodyLight} />
      </View>

      {/* Arms */}
      <View style={[styles.arms, { bottom: dimensions.body * 0.4 }]}>
        <View
          style={[
            styles.arm,
            {
              width: dimensions.body * 0.2,
              height: dimensions.body * 0.55,
              borderRadius: 4,
              marginRight: dimensions.body + 4,
              transform: [{ rotate: mood === 'celebrating' ? '-30deg' : '15deg' }],
            },
          ]}
        />
        <View
          style={[
            styles.arm,
            {
              width: dimensions.body * 0.2,
              height: dimensions.body * 0.55,
              borderRadius: 4,
              transform: [{ rotate: mood === 'celebrating' ? '30deg' : '-15deg' }],
            },
          ]}
        />
      </View>

      {/* Message bubble */}
      {message && (
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.messageTail} />
        </View>
      )}

      {/* Celebrating sparkles */}
      {mood === 'celebrating' && (
        <>
          <Text style={[styles.sparkle, { top: -10, left: -15 }]}>✨</Text>
          <Text style={[styles.sparkle, { top: -5, right: -15 }]}>⭐</Text>
          <Text style={[styles.sparkle, { top: 20, right: -20 }]}>🌟</Text>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  antenna: {
    backgroundColor: '#9CA3AF',
    marginBottom: 2,
  },
  antennaBall: {
    backgroundColor: Colors.accent,
    borderRadius: 5,
    marginBottom: 4,
  },
  head: {
    backgroundColor: '#60A5FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  eye: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  pupil: {
    backgroundColor: '#1E3A5F',
  },
  mouth: {
    backgroundColor: '#1E3A5F',
  },
  cheeksRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
    position: 'absolute',
    bottom: 8,
  },
  cheek: {
    backgroundColor: '#FCA5A5',
    borderRadius: 10,
    opacity: 0.7,
  },
  body: {
    backgroundColor: '#3B82F6',
    marginTop: 3,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  bodyLight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  arms: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arm: {
    backgroundColor: '#60A5FA',
    borderWidth: 2,
    borderColor: '#3B82F6',
    position: 'absolute',
  },
  messageBubble: {
    position: 'absolute',
    top: -10,
    right: -100,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    maxWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  messageTail: {
    position: 'absolute',
    left: -8,
    top: 10,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.primary,
  },
  messageText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
  },
});
