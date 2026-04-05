import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Pressable, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Badge } from '@/constants/rewardsData';

interface RewardBadgeProps {
  badge: Badge;
  earned: boolean;
  onPress?: () => void;
  showTitle?: boolean;
}

export default function RewardBadge({ badge, earned, onPress, showTitle = true }: RewardBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (earned) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [earned]);

  const handlePress = () => {
    if (earned) {
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(rotateAnim, { toValue: -1, duration: 200, useNativeDriver: Platform.OS !== 'web' }),
        Animated.spring(rotateAnim, { toValue: 0, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    }
    onPress?.();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <Pressable onPress={handlePress} style={styles.wrapper}>
      <Animated.View
        style={[
          styles.badge,
          {
            backgroundColor: earned ? badge.color : Colors.border,
            transform: [{ scale: earned ? scaleAnim : 1 }, { rotate: rotation }],
            opacity: earned ? 1 : 0.4,
          },
        ]}
      >
        <Text style={styles.emoji}>{badge.emoji}</Text>
        {!earned && <View style={styles.lockedOverlay} />}
        {!earned && <Text style={styles.lockIcon}>🔒</Text>}
      </Animated.View>
      {showTitle && (
        <View style={styles.titleWrapper}>
          <Text style={[styles.title, { color: earned ? Colors.text : Colors.textMuted }]} numberOfLines={2}>
            {badge.title}
          </Text>
          {earned && <Text style={styles.earnedTag}>Earned!</Text>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 90,
    marginBottom: 8,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  emoji: {
    fontSize: 32,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 36,
  },
  lockIcon: {
    position: 'absolute',
    fontSize: 20,
  },
  titleWrapper: {
    marginTop: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  earnedTag: {
    fontSize: 10,
    color: Colors.green,
    fontWeight: '700',
    marginTop: 2,
  },
});
