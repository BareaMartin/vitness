import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Onboarding } from '@/components/onboarding';
import { useOnboarding } from '@/hooks/use-onboarding';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { ready, seen, dismiss } = useOnboarding();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
        {ready && !seen ? <Onboarding onDone={dismiss} /> : null}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
