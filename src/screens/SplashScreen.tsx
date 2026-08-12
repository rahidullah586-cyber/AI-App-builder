import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
  FadeOut,
  SlideInUp,
} from 'react-native-reanimated';
import AnimatedLogo from '../components/AnimatedLogo';
import { useTheme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors, isDark } = useTheme();
  const progress = useSharedValue(0);
  const dotsOpacity = useSharedValue(0);
  const particleOpacity = useSharedValue(0);

  useEffect(() => {
    // Progress bar animation
    progress.value = withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) });

    // Loading dots
    dotsOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));

    // Particles
    particleOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));

    // Finish splash
    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const dotsStyle = useAnimatedStyle(() => ({ opacity: dotsOpacity.value }));
  const particlesStyle = useAnimatedStyle(() => ({ opacity: particleOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#06060C' : '#F0F0FA' }] }>
      {/* Animated background particles */}
      <Animated.View style={[styles.particles, particlesStyle]}>
        {[...Array(6)].map((_, i) => (
          <FloatingParticle key={i} index={i} color={colors.primary} delay={i * 300} />
        ))}
      </Animated.View>

      {/* Central content */}
      <View style={styles.center}>
        <AnimatedLogo size={100} showText={false} animate={true} />
      </View>

      {/* App name with animation */}
      <Animated.View
        entering={FadeIn.delay(500).duration(800)}
        style={styles.brandSection}
      >
        <Text style={[styles.brandName, { color: isDark ? '#F0F0FF' : '#1A1A2E' }] }>
          Z AI
        </Text>
        <Text style={[styles.tagline, { color: colors.textTertiary }]}>
          Your Agentic Intelligence
        </Text>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.bottomSection, dotsStyle]}>
        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: isDark ? '#1A1A2E' : '#E0E0EA' }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary },
              progressStyle,
            ]}
          />
        </View>

        {/* Loading dots */}
        <Animated.View entering={SlideInUp.delay(800).duration(500)} style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <BouncingDot key={i} index={i} color={colors.primary} />
          ))}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// Floating particle component
function FloatingParticle({ index, color, delay }: { index: number; color: string; delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue((index % 3 - 1) * 80);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const startY = 200 + (index % 3) * 100;
    translateY.value = startY;

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-400, { duration: 4000 + index * 500, easing: Easing.inOut(Easing.sin) }),
          withTiming(startY, { duration: 0 }),
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500 }),
          withTiming(0, { duration: 2500 }),
        ),
        -1,
        false
      )
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value + Math.sin(translateY.value / 100) * 20 },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const size = 4 + (index % 3) * 2;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size, height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

// Bouncing dot for loading indicator
function BouncingDot({ index, color }: { index: number; color: string }) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 400, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: color, opacity: 0.4 + index * 0.2 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 6,
    textTransform: 'uppercase' as const,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 60,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
