import React, { useState } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Text, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ScaleIn } from 'react-native-reanimated';
import { useTheme, ThemeMode } from '../theme';
import { THEMES, ThemePreset } from '../theme/themes';
import { GradientBar } from '../theme/GradientView';

export default function ThemePickerScreen() {
  const { colors, isDark, themeMode, setThemeMode, themePreset, setThemePreset, gradientStart, gradientEnd } = useTheme();
  const [showPreview, setShowPreview] = useState(false);

  const themeModes: { label: string; value: ThemeMode; icon: string }[] = [
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with gradient */}
      <View style={styles.header}>
        <GradientBar height={3} />
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Themes</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Personalize your Z AI experience
          </Text>
        </View>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance Mode</Text>
        <View style={[styles.modeRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {themeModes.map((mode) => (
            <TouchableOpacity
              key={mode.value}
              style={[
                styles.modeBtn,
                themeMode === mode.value && { backgroundColor: colors.primaryBg },
              ]}
              onPress={() => setThemeMode(mode.value)}
            >
              <Ionicons
                name={mode.icon}
                size={18}
                color={themeMode === mode.value ? colors.primary : colors.textTertiary}
              />
              <Text
                style={[
                  styles.modeBtnText,
                  { color: themeMode === mode.value ? colors.primary : colors.textTertiary },
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Theme presets */}
      <View style={styles.presetsSection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Color Themes</Text>
        <FlatList
          data={THEMES}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ThemeCard
              theme={item}
              isSelected={themePreset.id === item.id}
              onSelect={() => setThemePreset(item)}
              isDark={isDark}
              index={index}
            />
          )}
          contentContainerStyle={styles.presetList}
          scrollEnabled={false}
        />
      </View>

      {/* Preview section */}
      <View style={styles.previewSection}>
        <TouchableOpacity
          style={styles.previewToggle}
          onPress={() => setShowPreview(!showPreview)}
        >
          <Text style={[styles.previewToggleText, { color: colors.primary }]}>
            {showPreview ? 'Hide' : 'Show'} Preview
          </Text>
          <Ionicons
            name={showPreview ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
        {showPreview && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.previewCard}>
            <View style={[styles.previewMsg, { backgroundColor: themePreset.dark.userBubble }]}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>Hello Z AI!</Text>
            </View>
            <View style={[styles.previewMsg, { backgroundColor: isDark ? themePreset.dark.aiBubble : themePreset.light.aiBubble }]}>
              <Text style={{ color: isDark ? themePreset.dark.aiBubbleText : themePreset.light.aiBubbleText, fontSize: 14 }}>
                Hi there! How can I help you today?
              </Text>
            </View>
            <GradientBar height={3} style={{ marginTop: 16, borderRadius: 2 }} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
  isDark,
  index,
}: {
  theme: ThemePreset;
  isSelected: boolean;
  onSelect: () => void;
  isDark: boolean;
  index: number;
}) {
  const currentColors = isDark ? theme.dark : theme.light;

  return (
    <Animated.View
      entering={ScaleIn.duration(300).delay(index * 60).springify().damping(18)}
    >
      <TouchableOpacity
        style={[
          styles.themeCard,
          {
            backgroundColor: currentColors.surface,
            borderColor: isSelected ? currentColors.primary : currentColors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={onSelect}
        activeOpacity={0.8}
      >
        {/* Color swatches */}
        <View style={styles.swatchRow}>
          <View style={[styles.swatch, { backgroundColor: currentColors.primary }]} />
          <View style={[styles.swatch, { backgroundColor: currentColors.accent }]} />
          <View style={[styles.swatch, { backgroundColor: currentColors.background }]} />
          <View style={[styles.swatch, { backgroundColor: currentColors.surfaceVariant, borderWidth: 1, borderColor: currentColors.border }]} />
          <View style={[styles.swatch, { backgroundColor: currentColors.gradientStart }]} />
          <View style={[styles.swatch, { backgroundColor: currentColors.gradientEnd }]} />
        </View>

        {/* Info */}
        <View style={styles.themeInfo}>
          <View style={styles.themeNameRow}>
            <Text style={{ fontSize: 16 }}>{theme.emoji}</Text>
            <Text style={[styles.themeName, { color: currentColors.text }]}>{theme.name}</Text>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={18} color={currentColors.primary} />
            )}
          </View>
          <Text style={[styles.themeDesc, { color: currentColors.textTertiary }]}>
            {theme.description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSubtitle: { fontSize: 14, marginTop: 4 },
  modeSection: { paddingHorizontal: 20, marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 },
  modeRow: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 14 },
  modeBtnText: { fontSize: 14, fontWeight: '600' },
  presetsSection: { paddingHorizontal: 20, marginBottom: 24 },
  presetList: { gap: 12 },
  themeCard: { borderRadius: 16, padding: 14, overflow: 'hidden' },
  swatchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  swatch: { width: 28, height: 28, borderRadius: 14 },
  themeInfo: { gap: 4 },
  themeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  themeName: { fontSize: 16, fontWeight: '600', flex: 1 },
  themeDesc: { fontSize: 13 },
  previewSection: { paddingHorizontal: 20 },
  previewToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  previewToggleText: { fontSize: 14, fontWeight: '600' },
  previewCard: { backgroundColor: 'rgba(128,128,128,0.1)', borderRadius: 14, padding: 16, gap: 8 },
  previewMsg: { alignSelf: 'flex-end', maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomRightRadius: 4 },
  previewMsgAI: { alignSelf: 'flex-start', maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomLeftRadius: 4 },
});
