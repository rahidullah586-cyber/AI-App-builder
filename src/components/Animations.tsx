import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideInLeft,
  ScaleIn,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

/**
 * Animated chat bubble entrance - slides in from side with spring physics
 */
export function AnimatedChatBubble({
  children,
  isUser,
  index,
}: {
  children: React.ReactNode;
  isUser: boolean;
  index: number;
}) {
  return (
    <Animated.View
      entering={
        isUser
          ? FadeInDown.duration(350).springify().damping(15).delay(index * 30)
          : FadeInUp.duration(350).springify().damping(15).delay(index * 30)
      }
    >
      {children}
    </Animated.View>
  );
}

/**
 * Typing indicator with three bouncing dots
 */
export function TypingIndicator() {
  const { colors } = useTheme();

  return (
    <View style={[styles.typingRow, { marginHorizontal: 16, marginBottom: 8 }]}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.typingBubble, { backgroundColor: colors.aiBubble, borderWidth: 1, borderColor: colors.border }]}
      >
        <View style={styles.typingDots}>
          {[0, 1, 2].map((i) => (
            <BounceDot key={i} index={i} color={colors.primary} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function BounceDot({ index, color }: { index: number; color: string }) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1, true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color }, style]}
    />
  );
}

/**
 * Animated FAB (Floating Action Button) with pulse ring
 */
export function AnimatedFAB({
  onPress,
  icon,
  color,
}: {
  onPress: () => void;
  icon: React.ReactNode;
  color: string;
}) {
  const pulseScale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.4);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 2500, easing: Easing.out(Easing.cubic) }),
        withTiming(1, { duration: 0 }),
      ),
      -1, false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2500, easing: Easing.out(Easing.cubic) }),
        withTiming(0.4, { duration: 0 }),
      ),
      -1, false,
    );
  }, []);

  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.fabContainer}>
      <Animated.View
        style={[styles.fabRing, { borderColor: color }, ringStyle]}
      />
      <Animated.View
        style={[styles.fab, { backgroundColor: color, shadowColor: color }, fabStyle]}
      >
        {icon}
      </Animated.View>
    </View>
  );
}

/**
 * Shimmer/skeleton loading placeholder
 */
export function ShimmerLine({ width = '80%', height = 14, style }: { width?: string | number; height?: number; style?: any }) {
  const { colors } = useTheme();
  const shimmer = useSharedValue(0);
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(400, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1, false,
    );
  }, []);

  const style2 = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.shimmerContainer, { height, borderRadius: height / 2, backgroundColor: colors.surfaceVariant }, style]}>
      <Animated.View
        style={[
          styles.shimmerSlide,
          { backgroundColor: colors.border },
          style2,
        ]}
      />
    </View>
  );
}

/**
 * Animated counter/number
 */
export function AnimatedNumber({ value, style }: { value: number; style?: any }) {
  const { colors } = useTheme();
  return (
    <Animated.Text
      entering={ScaleIn.duration(200)}
      style={[{ color: colors.text, fontWeight: '700', fontSize: 16 }, style]}
    >
      {value}
    </Animated.Text>
  );
}

/**
 * Success checkmark animation
 */
export function SuccessCheck({ size = 48, color = '#10B981' }: { size?: number; color?: string }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.successCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '20', borderColor: color, borderWidth: 2 }, containerStyle]}
    >
      <Text style={{ color, fontSize: size * 0.5, fontWeight: '700' }}>✓</Text>
    </Animated.View>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  typingRow: { flexDirection: 'row', alignItems: 'flex-start' },
  typingBubble: { borderRadius: 20, paddingHorizontal: 18, paddingVertical: 14 },
  typingDots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  fabContainer: { position: 'relative' },
  fab: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    zIndex: 2,
  },
  fabRing: {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, zIndex: 1,
  },
  shimmerContainer: { overflow: 'hidden', position: 'relative' },
  shimmerSlide: { position: 'absolute', top: 0, bottom: 0, width: 100, opacity: 0.4 },
  successCircle: { justifyContent: 'center', alignItems: 'center' },
});
