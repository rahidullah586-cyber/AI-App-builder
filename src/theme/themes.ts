export interface ThemePreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  dark: {
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primaryLight: string;
    primaryBg: string;
    accent: string;
    accentBg: string;
    danger: string;
    dangerBg: string;
    border: string;
    inputBg: string;
    shadow: string;
    userBubble: string;
    userBubbleText: string;
    aiBubble: string;
    aiBubbleText: string;
    codeBg: string;
    codeText: string;
    gradientStart: string;
    gradientEnd: string;
    glowColor: string;
  };
  light: {
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primaryLight: string;
    primaryBg: string;
    accent: string;
    accentBg: string;
    danger: string;
    dangerBg: string;
    border: string;
    inputBg: string;
    shadow: string;
    userBubble: string;
    userBubbleText: string;
    aiBubble: string;
    aiBubbleText: string;
    codeBg: string;
    codeText: string;
    gradientStart: string;
    gradientEnd: string;
    glowColor: string;
  };
}

export const THEMES: ThemePreset[] = [
  {
    id: 'indigo',
    name: 'Indigo',
    emoji: '🔮',
    description: 'Classic Z AI - deep indigo & cyan',
    dark: {
      background: '#0A0A0F', surface: '#14141F', surfaceVariant: '#1C1C2E',
      text: '#F0F0F5', textSecondary: '#A0A0B8', textTertiary: '#66667A',
      primary: '#818CF8', primaryLight: '#A5B4FC', primaryBg: '#1E1B4B',
      accent: '#34D399', accentBg: '#064E3B',
      danger: '#F87171', dangerBg: '#450A0A',
      border: '#2A2A3E', inputBg: '#1A1A28', shadow: 'rgba(0,0,0,0.4)',
      userBubble: '#4F46E5', userBubbleText: '#FFFFFF',
      aiBubble: '#1C1C2E', aiBubbleText: '#F0F0F5',
      codeBg: '#0D0D18', codeText: '#E0E0F0',
      gradientStart: '#4F46E5', gradientEnd: '#06B6D4',
      glowColor: 'rgba(129, 140, 248, 0.3)',
    },
    light: {
      background: '#F5F5FA', surface: '#FFFFFF', surfaceVariant: '#ECECF4',
      text: '#1A1A2E', textSecondary: '#6B6B80', textTertiary: '#9999AA',
      primary: '#4F46E5', primaryLight: '#818CF8', primaryBg: '#EEF2FF',
      accent: '#10B981', accentBg: '#ECFDF5',
      danger: '#EF4444', dangerBg: '#FEF2F2',
      border: '#E5E5EA', inputBg: '#F0F0F8', shadow: 'rgba(0,0,0,0.08)',
      userBubble: '#4F46E5', userBubbleText: '#FFFFFF',
      aiBubble: '#FFFFFF', aiBubbleText: '#1A1A2E',
      codeBg: '#1E1E2E', codeText: '#E0E0F0',
      gradientStart: '#6366F1', gradientEnd: '#22D3EE',
      glowColor: 'rgba(79, 70, 229, 0.15)',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    emoji: '🌌',
    description: 'Northern lights - green, teal & purple',
    dark: {
      background: '#060D0A', surface: '#0E1A14', surfaceVariant: '#152820',
      text: '#E8F5E9', textSecondary: '#81C784', textTertiary: '#4CAF50',
      primary: '#00E676', primaryLight: '#69F0AE', primaryBg: '#0A2E1A',
      accent: '#B388FF', accentBg: '#2A1A4E',
      danger: '#FF8A80', dangerBg: '#3E1A1A',
      border: '#1A3326', inputBg: '#0D1F16', shadow: 'rgba(0,0,0,0.5)',
      userBubble: '#00C853', userBubbleText: '#FFFFFF',
      aiBubble: '#152820', aiBubbleText: '#E8F5E9',
      codeBg: '#081410', codeText: '#C8E6C9',
      gradientStart: '#00E676', gradientEnd: '#7C4DFF',
      glowColor: 'rgba(0, 230, 118, 0.25)',
    },
    light: {
      background: '#F0FAF4', surface: '#FFFFFF', surfaceVariant: '#E0F2E8',
      text: '#1B3A28', textSecondary: '#4A7A5C', textTertiary: '#7AA88E',
      primary: '#00C853', primaryLight: '#69F0AE', primaryBg: '#E8F5E9',
      accent: '#7C4DFF', accentBg: '#EDE7F6',
      danger: '#EF4444', dangerBg: '#FFEBEE',
      border: '#C8E6C9', inputBg: '#E8F5E9', shadow: 'rgba(0,0,0,0.06)',
      userBubble: '#00C853', userBubbleText: '#FFFFFF',
      aiBubble: '#FFFFFF', aiBubbleText: '#1B3A28',
      codeBg: '#1E2E28', codeText: '#C8E6C9',
      gradientStart: '#00E676', gradientEnd: '#B388FF',
      glowColor: 'rgba(0, 200, 83, 0.12)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    description: 'Warm amber, orange & rose tones',
    dark: {
      background: '#0F0A06', surface: '#1A1410', surfaceVariant: '#2A201A',
      text: '#FFF3E0', textSecondary: '#FFB74D', textTertiary: '#A1887F',
      primary: '#FF9100', primaryLight: '#FFAB40', primaryBg: '#2E1E0A',
      accent: '#FF4081', accentBg: '#2E0A1A',
      danger: '#FF5252', dangerBg: '#3E0A0A',
      border: '#3E3028', inputBg: '#1E1810', shadow: 'rgba(0,0,0,0.5)',
      userBubble: '#FF6D00', userBubbleText: '#FFFFFF',
      aiBubble: '#2A201A', aiBubbleText: '#FFF3E0',
      codeBg: '#140E08', codeText: '#FFE0B2',
      gradientStart: '#FF9100', gradientEnd: '#FF4081',
      glowColor: 'rgba(255, 145, 0, 0.25)',
    },
    light: {
      background: '#FFFAF5', surface: '#FFFFFF', surfaceVariant: '#FFF3E0',
      text: '#3E2723', textSecondary: '#795548', textTertiary: '#A1887F',
      primary: '#FF6D00', primaryLight: '#FF9100', primaryBg: '#FFF3E0',
      accent: '#F50057', accentBg: '#FCE4EC',
      danger: '#D32F2F', dangerBg: '#FFCDD2',
      border: '#FFCC80', inputBg: '#FFF8E1', shadow: 'rgba(0,0,0,0.06)',
      userBubble: '#FF6D00', userBubbleText: '#FFFFFF',
      aiBubble: '#FFFFFF', aiBubbleText: '#3E2723',
      codeBg: '#2E2018', codeText: '#FFE0B2',
      gradientStart: '#FF9100', gradientEnd: '#FF4081',
      glowColor: 'rgba(255, 109, 0, 0.12)',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    description: 'Deep blue, aqua & seafoam',
    dark: {
      background: '#060A10', surface: '#0E1822', surfaceVariant: '#152838',
      text: '#E3F2FD', textSecondary: '#64B5F6', textTertiary: '#42A5F5',
      primary: '#00B0FF', primaryLight: '#40C4FF', primaryBg: '#0A1E30',
      accent: '#18FFFF', accentBg: '#0A2E2E',
      danger: '#FF8A80', dangerBg: '#3E1A1A',
      border: '#1A3048', inputBg: '#0C1A28', shadow: 'rgba(0,0,0,0.5)',
      userBubble: '#0091EA', userBubbleText: '#FFFFFF',
      aiBubble: '#152838', aiBubbleText: '#E3F2FD',
      codeBg: '#081018', codeText: '#BBDEFB',
      gradientStart: '#00B0FF', gradientEnd: '#18FFFF',
      glowColor: 'rgba(0, 176, 255, 0.25)',
    },
    light: {
      background: '#F0F8FF', surface: '#FFFFFF', surfaceVariant: '#E1F5FE',
      text: '#0D2137', textSecondary: '#4A7A9C', textTertiary: '#7AAEC8',
      primary: '#0091EA', primaryLight: '#40C4FF', primaryBg: '#E1F5FE',
      accent: '#00BFA5', accentBg: '#E0F7FA',
      danger: '#EF4444', dangerBg: '#FFEBEE',
      border: '#B3E5FC', inputBg: '#E1F5FE', shadow: 'rgba(0,0,0,0.06)',
      userBubble: '#0091EA', userBubbleText: '#FFFFFF',
      aiBubble: '#FFFFFF', aiBubbleText: '#0D2137',
      codeBg: '#1A2838', codeText: '#BBDEFB',
      gradientStart: '#00B0FF', gradientEnd: '#18FFFF',
      glowColor: 'rgba(0, 145, 234, 0.12)',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    description: 'Elegant pink, magenta & lavender',
    dark: {
      background: '#0F060A', surface: '#1A0E14', surfaceVariant: '#2A1A24',
      text: '#FCE4EC', textSecondary: '#F48FB1', textTertiary: '#CE93D8',
      primary: '#F50057', primaryLight: '#FF4081', primaryBg: '#2E0A18',
      accent: '#E040FB', accentBg: '#2A0A2E',
      danger: '#FF8A80', dangerBg: '#3E1A1A',
      border: '#3E1A30', inputBg: '#1E0E18', shadow: 'rgba(0,0,0,0.5)',
      userBubble: '#C51162', userBubbleText: '#FFFFFF',
      aiBubble: '#2A1A24', aiBubbleText: '#FCE4EC',
      codeBg: '#140810', codeText: '#F8BBD0',
      gradientStart: '#F50057', gradientEnd: '#AA00FF',
      glowColor: 'rgba(245, 0, 87, 0.25)',
    },
    light: {
      background: '#FFF5F8', surface: '#FFFFFF', surfaceVariant: '#FCE4EC',
      text: '#3A1028', textSecondary: '#7A4A64', textTertiary: '#AA7A94',
      primary: '#C51162', primaryLight: '#FF4081', primaryBg: '#FCE4EC',
      accent: '#AA00FF', accentBg: '#F3E5F5',
      danger: '#D32F2F', dangerBg: '#FFCDD2',
      border: '#F8BBD0', inputBg: '#FFF0F5', shadow: 'rgba(0,0,0,0.06)',
      userBubble: '#C51162', userBubbleText: '#FFFFFF',
      aiBubble: '#FFFFFF', aiBubbleText: '#3A1028',
      codeBg: '#2E1828', codeText: '#F8BBD0',
      gradientStart: '#F50057', gradientEnd: '#E040FB',
      glowColor: 'rgba(197, 17, 98, 0.12)',
    },
  },
];

export function getThemeById(id: string): ThemePreset {
  return THEMES.find(t => t.id === id) || THEMES[0];
}
