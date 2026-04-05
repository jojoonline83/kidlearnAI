import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameStore } from '@/store/gameStore';

// GestureHandlerRootView swallows pointer events on web — use plain View instead
const AppWrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

export default function RootLayout() {
  const loadProgress = useGameStore((s) => s.loadProgress);

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <AppWrapper style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppWrapper>
  );
}
