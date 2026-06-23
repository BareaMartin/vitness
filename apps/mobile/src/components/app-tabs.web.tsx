import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

import { ThemedText } from './themed-text';

import { Brand, MaxContentWidth, Spacing } from '@/constants/theme';

type GlyphName = 'home' | 'album' | 'golazos';

/** Monochrome line icons for the web top-nav, tinted to match the label. */
function TabGlyph({ name, color }: { name: GlyphName; color: string }) {
  const common = { stroke: color, strokeWidth: 1.8, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      {name === 'home' && <Path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" {...common} />}
      {name === 'album' && (
        <Path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" {...common} />
      )}
      {name === 'golazos' && (
        <>
          <Circle cx={12} cy={12} r={8} {...common} />
          <Path d="M12 7.5l3.2 2.3-1.2 3.7h-4l-1.2-3.7z" {...common} />
        </>
      )}
    </Svg>
  );
}

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton glyph="home">Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton glyph="album">Álbum</TabButton>
          </TabTrigger>
          <TabTrigger name="golazos" href="/golazos" asChild>
            <TabButton glyph="golazos">Golazos</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  glyph,
  ...props
}: TabTriggerSlotProps & { glyph?: GlyphName }) {
  const tint = isFocused ? Brand.accent : '#9BA1A8';
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabButtonView,
        isFocused && styles.tabButtonActive,
        pressed && styles.pressed,
      ]}>
      {glyph ? <TabGlyph name={glyph} color={tint} /> : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
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
