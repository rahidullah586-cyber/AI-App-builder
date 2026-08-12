import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, Alert, Text, TextInput, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AppSettings, DEFAULT_SETTINGS } from '../utils/types';
import { loadSettings, saveSettings } from '../utils/storage';

export default function SettingsScreen() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showUrlEdit, setShowUrlEdit] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  useEffect(() => {
    (async () => { const s = await loadSettings(); setSettings(s); setTempUrl(s.zaiWebUrl); })();
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      const updated = { ...settings, [key]: value };
      setSettings(updated);
      await saveSettings(updated);
    },
    [settings]
  );

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  const handleClearAllData = () => {
    Alert.alert('Clear All Data', 'Delete all conversations and settings?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear Everything', style: 'destructive', onPress: () => Alert.alert('Done', 'All data cleared.') },
    ]);
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.appInfo}>
        <View style={[styles.appLogo, { backgroundColor: colors.primaryBg }]}>
          <Text style={[styles.appLogoText, { color: colors.primary }]}>Z</Text>
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>Z AI</Text>
        <Text style={[styles.appVersion, { color: colors.textTertiary }]}>Version 1.1.0</Text>
      </View>

      {renderSection('Connection', (
        <>
          <TouchableOpacity style={styles.settingRow} onPress={() => { setTempUrl(settings.zaiWebUrl); setShowUrlEdit(!showUrlEdit); }}>
            <View style={styles.settingLeft}>
              <Ionicons name="globe-outline" size={22} color={colors.primary} />
              <View style={styles.settingTexts}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Z AI Web URL</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]} numberOfLines={1}>{settings.zaiWebUrl}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          {showUrlEdit && (
            <View style={styles.urlEditRow}>
              <TextInput
                style={[styles.urlInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
                value={tempUrl} onChangeText={setTempUrl} placeholder="https://z.ai" placeholderTextColor={colors.textTertiary}
                autoCapitalize="none" autoCorrect={false} keyboardType="url"
              />
              <TouchableOpacity style={[styles.urlSaveBtn, { backgroundColor: colors.primary }]} onPress={() => { updateSetting('zaiWebUrl', tempUrl); setShowUrlEdit(false); }}>
                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ))}

      {renderSection('Appearance', (
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="color-palette-outline" size={22} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
          </View>
          <View style={styles.chipRow}>
            {themeOptions.map((opt) => (
              <TouchableOpacity key={opt.value}
                style={[styles.chip, { borderColor: colors.border }, themeMode === opt.value && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setThemeMode(opt.value)}>
                <Text style={[styles.chipText, { color: colors.textSecondary }, themeMode === opt.value && { color: '#FFFFFF' }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {renderSection('Data', (
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearAllData}>
          <MaterialCommunityIcons name="delete-sweep-outline" size={22} color="#EF4444" />
          <Text style={styles.dangerText}>Clear All App Data</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.footer, { color: colors.textTertiary }]}>Built with Expo • Powered by Z AI</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  appInfo: { alignItems: 'center', paddingVertical: 24 },
  appLogo: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  appLogoText: { fontSize: 28, fontWeight: '800' },
  appName: { fontSize: 22, fontWeight: '700' },
  appVersion: { fontSize: 13, marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  settingTexts: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  settingSubtitle: { fontSize: 13, marginTop: 2 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  urlEditRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 14 },
  urlInput: { flex: 1, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, fontSize: 14 },
  urlSaveBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, justifyContent: 'center' },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  dangerText: { fontSize: 15, color: '#EF4444', fontWeight: '500' },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 20, paddingVertical: 12 },
});
