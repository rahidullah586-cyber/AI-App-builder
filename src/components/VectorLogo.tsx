import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { useTheme } from '../theme';

/**
 * Lightweight pure-vector Z AI logo — no image files needed.
 * Renders as SVG, scales perfectly at any size.
 * File size impact: ~0KB (pure code, no assets).
 */
export default function VectorLogo({ size = 48, showGlow = true }: { size?: number; showGlow?: boolean }) {
  const { colors, gradientStart, gradientEnd } = useTheme();
  const pad = size * 0.05;
  const s = size - pad * 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="zGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientStart} />
            <Stop offset="100%" stopColor={gradientEnd} />
          </LinearGradient>
          <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.surface} />
            <Stop offset="100%" stopColor={colors.surfaceVariant} />
          </LinearGradient>
        </Defs>

        {/* Background circle */}
        <Circle cx="50" cy="50" r="48" fill="url(#bgGrad)" stroke={colors.primary} strokeWidth="2" />

        {/* Neural network dots (decorative) */}
        <Circle cx="20" cy="25" r="1.5" fill={colors.primary} opacity="0.3" />
        <Circle cx="80" cy="20" r="1" fill={gradientEnd} opacity="0.4" />
        <Circle cx="15" cy="75" r="1.2" fill={gradientEnd} opacity="0.3" />
        <Circle cx="85" cy="80" r="1.5" fill={colors.primary} opacity="0.3" />
        <Circle cx="25" cy="50" r="0.8" fill={colors.accent} opacity="0.2" />
        <Circle cx="75" cy="50" r="0.8" fill={colors.accent} opacity="0.2" />

        {/* Connection lines */}
        <Path d="M20 25 L35 40" stroke={colors.primary} strokeWidth="0.5" opacity="0.15" />
        <Path d="M80 20 L65 38" stroke={gradientEnd} strokeWidth="0.5" opacity="0.15" />
        <Path d="M15 75 L32 58" stroke={gradientEnd} strokeWidth="0.5" opacity="0.15" />
        <Path d="M85 80 L68 62" stroke={colors.primary} strokeWidth="0.5" opacity="0.15" />

        {/* Z letter path - clean, modern */}
        <Path
          d="M32 28 L32 34 L62 66 L32 66 L32 72 L70 72 L70 66 L40 34 L70 34 L70 28 Z"
          fill="url(#zGrad)"
        />

        {/* Glow circle (optional) */}
        {showGlow && (
          <Circle cx="50" cy="50" r="50" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.1" />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});
