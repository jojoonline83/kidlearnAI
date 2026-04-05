import React, { useRef, useEffect } from 'react';
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
 * Cross-platform pressable that avoids React hydration mismatches.
 *
 * On native (iOS/Android): renders Pressable.
 * On web (SSR + CSR): always renders a plain View so server and client
 *   HTML match perfectly. After hydration, useEffect attaches native DOM
 *   'click' and 'touchend' listeners directly on the element — these bypass
 *   the RNW responder system and fire reliably on all mobile browsers.
 */
export function Tap({ onPress, onPressIn, onPressOut, style, children, disabled }: TapProps) {
  const lastEventTime = useRef(0);
  const viewRef = useRef<any>(null);

  // Always call hooks unconditionally (Rules of Hooks)
  useEffect(() => {
    // Only attach DOM listeners on web (useEffect never runs during SSR)
    if (Platform.OS === 'ios' || Platform.OS === 'android') return;

    const el = viewRef.current;
    if (!el) return;

    const handler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastEventTime.current < 600) return; // debounce double-fire
      lastEventTime.current = now;
      if (!disabled && onPress) onPress();
    };

    // Attach both — touchend fires immediately on mobile, click is fallback for desktop
    el.addEventListener('touchend', handler, { passive: false });
    el.addEventListener('click', handler, { passive: false });

    return () => {
      el.removeEventListener('touchend', handler);
      el.removeEventListener('click', handler);
    };
  }, [onPress, disabled]);

  // Native: use Pressable
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
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

  // Web (and SSR): plain View — same on server and client, no hydration mismatch
  return (
    <View
      ref={viewRef}
      style={[
        {
          cursor: disabled ? 'default' : 'pointer',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as any,
        style,
      ]}
    >
      {children}
    </View>
  );
}
