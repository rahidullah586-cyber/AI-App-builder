import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from './colors';
import { THEMES, ThemePreset } from './themes';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  themePreset: ThemePreset;
  setThemePreset: (preset: ThemePreset) => void;
  gradientStart: string;
  gradientEnd: string;
  glowColor: string;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: darkColors,
  isDark: true,
  themeMode: 'system',
  setThemeMode: () => {},
  themePreset: THEMES[0],
  setThemePreset: () => {},
  gradientStart: '#4F46E5',
  gradientEnd: '#06B6D4',
  glowColor: 'rgba(129, 140, 248, 0.3)',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [themePreset, setThemePreset] = useState<ThemePreset>(THEMES[0]);

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const presetColors = isDark ? themePreset.dark : themePreset.light;
  const fallbackColors = isDark ? darkColors : lightColors;
  const colors = presetColors || fallbackColors;

  const gradientStart = isDark ? themePreset.dark.gradientStart : themePreset.light.gradientStart;
  const gradientEnd = isDark ? themePreset.dark.gradientEnd : themePreset.light.gradientEnd;
  const glowColor = isDark ? themePreset.dark.glowColor : themePreset.light.glowColor;

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode, themePreset, setThemePreset, gradientStart, gradientEnd, glowColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);