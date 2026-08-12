import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './index';

interface GradientViewProps {
  height?: number;
  width?: string | number;
  style?: any;
  children?: React.ReactNode;
  opacity?: number;
}

/**
 * Lightweight gradient view using two overlapping semi-transparent layers.
 * No extra dependencies needed.
 */
export function GradientView({ height = 3, width = '100%', style, children, opacity = 1 }: GradientViewProps) {
  const { gradientStart, gradientEnd } = useTheme();

  return (
    <View style={[{ height, width, overflow: 'hidden', flexDirection: 'row' }, style]}>
      {/* Left half - start color fading to middle */}
      <View style={{ flex: 1, backgroundColor: gradientStart, opacity }} />
      {/* Middle blend - overlap creates gradient effect */}
      <View style={{ flex: 1, backgroundColor: gradientEnd, opacity: opacity * 0.7, position: 'absolute', left: '25%', right: '25%' }} />
      {/* Right half - end color fading */}
      <View style={{ flex: 1, backgroundColor: gradientEnd, opacity }} />
      {children}
    </View>
  );
}

/**
 * Multi-stop gradient bar using multiple thin slices.
 */
export function GradientBar({ height = 3, style }: { height?: number; style?: any }) {
  const { gradientStart, gradientEnd } = useTheme();
  const steps = 20;

  return (
    <View style={[{ flexDirection: 'row', height }, style]}>
      {Array.from({ length: steps }).map((_, i) => {
        const t = i / (steps - 1);
        const opacity = Math.sin(t * Math.PI) * 0.8 + 0.2;
        const isStart = t < 0.5;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              backgroundColor: isStart ? gradientStart : gradientEnd,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}

/**
 * Glow orb background effect.
 */
export function GlowOrb({ size = 200, style }: { size?: number; style?: any }) {
  const { glowColor, colors } = useTheme();

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          opacity: 0.08,
          position: 'absolute',
        },
        style,
      ]}
    />
  );
}