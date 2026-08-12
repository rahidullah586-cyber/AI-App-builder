import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay,
  Easing, FadeIn,
} from 'react-native-reanimated';
import AnimatedLogo from '../components/AnimatedLogo';
import { useTheme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors, isDark } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) });
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, []);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#06060C' : '#F0F0FA' }] }>
      <View style={styles.center}>
        <AnimatedLogo size={100} showText={false} animate={true} />
      </View>
      <Animated.View entering={FadeIn.delay(400).duration(600)} style={styles.brandSection}>
        <Text style={[styles.brandName, { color: isDark ? '#F0F0FF' : '#1A1A2E' }]}>Z AI</Text>
        <Text style={[styles.tagline, { color: colors.textTertiary }]}>Your Agentic Intelligence</Text>
      </Animated.View>
      <View style={styles.bottomSection}>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1A1A2E' : '#E0E0EA' }] }>
          <Animated.View style={[styles.progressFill, { backgroundColor: colors.primary }, progressStyle]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  brandSection: { marginTop: 32, alignItems: 'center' },
  brandName: { fontSize: 32, fontWeight: '800', letterSpacing: 4 },
  tagline: { fontSize: 14, fontWeight: '500', letterSpacing: 2, marginTop: 6, textTransform: 'uppercase' as const },
  bottomSection: { position: 'absolute', bottom: 60, alignItems: 'center', width: '100%', paddingHorizontal: 60 },
  progressTrack: { width: '100%', height: 3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
