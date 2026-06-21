import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';

import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Álbum</TabButton>
          </TabTrigger>
          <TabTrigger name="golazos" href="/golazos" asChild>
            <TabButton>Golazos</TabButton>
          </TabTrigger>
          <TabTrigger name="mundial" href="/mundial" asChild>
            <TabButton>Mundial</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabButtonView,
        isFocused && styles.tabButtonActive,
        pressed && styles.pressed,
      ]}>
      <ThemedText
        type="small"
        themeColor={isFocused ? 'text' : 'textSecondary'}
        style={isFocused ? styles.tabLabelActive : undefined}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.brand}>
          <View style={styles.brandDot}>
            <Text style={styles.brandDotText}>V</Text>
          </View>
          <Text style={styles.brandText}>
            VIT<Text style={styles.brandTextAccent}>NESS</Text>
          </Text>
        </View>

        <View style={styles.tabs}>{props.children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    backgroundColor: 'rgba(18,20,24,0.92)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginRight: 'auto',
    paddingLeft: Spacing.two,
  },
  brandDot: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: Brand.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDotText: {
    color: Brand.accentInk,
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 16,
  },
  brandText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  brandTextAccent: {
    color: Brand.accent,
    fontWeight: '800',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(22,196,127,0.16)',
  },
  tabLabelActive: {
    color: Brand.accent,
    fontWeight: '700',
  },
});
