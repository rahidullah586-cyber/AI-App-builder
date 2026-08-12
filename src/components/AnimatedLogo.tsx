import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

interface AnimatedLogoProps {
  size?: number;
  showText?: boolean;
  animate?: boolean;
}

export default function AnimatedLogo({ size = 80, showText = true, animate = true }: AnimatedLogoProps) {
  const { colors } = useTheme();

  // Animation values
  const scale = useSharedValue(animate ? 0.3 : 1);
  const opacity = useSharedValue(animate ? 0 : 1);
  const rotation = useSharedValue(0);
  const glowIntensity = useSharedValue(0.5);
  const textOpacity = useSharedValue(animate ? 0 : 1);
  const textTranslateY = useSharedValue(animate ? 20 : 0);
  const pulseScale = useSharedValue(1);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (!animate) return;

    // Main entrance
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    rotation.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) });

    // Text entrance with delay
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));

    // Glow pulse (continuous)
    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true
    );

    // Subtle pulse
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.97, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true
    );

    // Ring expansion
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 3000, easing: Easing.out(Easing.cubic) }),
        withTiming(0.8, { duration: 0 }),
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 3000, easing: Easing.out(Easing.cubic) }),
        withTiming(0.6, { duration: 0 }),
      ),
      -1,
      false
    );
  }, [animate]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const logoContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowIntensity.value,
    transform: [{ scale: 1 + glowIntensity.value * 0.3 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const letterSize = size * 0.5;

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <Animated.View style={logoContainerStyle}>
        {/* Outer pulse ring */}
        <Animated.View
          style={[styles.ring, { width: size * 1.5, height: size * 1.5, borderRadius: size * 0.75 }, ringStyle]}
        />

        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            { width: size * 1.2, height: size * 1.2, borderRadius: size * 0.6 },
            glowStyle,
          ]}
        />

        {/* Main circle */}
        <View
          style={[
            styles.mainCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.surface,
              borderColor: colors.primary,
              borderWidth: 2,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            },
          ]}
        >
          {/* Gradient overlay (simulated with two semi-transparent views) */}
          <View
            style={[
              styles.gradientOverlay,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.primary,
                opacity: 0.12,
              },
            ]}
          />

          {/* Z Letter */}
          <Text
            style={[
              styles.letter,
              {
                fontSize: letterSize,
                color: colors.primary,
                textShadowColor: colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              },
            ]}
          >
            Z
          </Text>
        </View>

        {/* Orbiting dot */}
        <OrbitingDot size={size} color={colors.accent} />
      </Animated.View>

      {/* Text below */}
      {showText && (
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={[styles.title, { color: colors.text }]}>Z AI</Text>
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>Intelligent Agent</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// Orbiting dot component
function OrbitingDot({ size, color }: { size: number; color: string }) {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => {
    const rad = (angle.value * Math.PI) / 180;
    const radius = size * 0.65;
    return {
      transform: [
        { translateX: Math.cos(rad) * radius },
        { translateY: Math.sin(rad) * radius },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
        },
        dotStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0, left: 0,
  },
  letter: {
    fontWeight: '800',
    zIndex: 1,
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    top: -((80 * 1.2 - 80) / 2),
    left: -((80 * 1.2 - 80) / 2),
    opacity: 0,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    backgroundColor: 'transparent',
    top: -20,
    left: -20,
    opacity: 0,
  },
  dot: {
    position: 'absolute',
    top: 0, left: 0,
  },
  textContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    marginTop: 2,
  },
});
