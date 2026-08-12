import React, { useState, useRef, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

interface Props {
  onSend: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
}

export default function ChatInput({ onSend, onStop, isStreaming }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText('');
  }, [text, isStreaming, onSend]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={[styles.wrapper, { borderTopColor: colors.border }]}
    >
      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBg }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Ask Z AI anything..."
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            multiline
            maxHeight={120}
            onSubmitEditing={() => { if (text.trim()) handleSend(); }}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.rightActions}>
          {isStreaming ? (
            <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.danger }]} onPress={onStop} hitSlop={8}>
              <View style={styles.stopIcon}><View style={styles.stopBar} /></View>
            </TouchableOpacity>
          ) : text.trim() ? (
            <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={handleSend} hitSlop={8}>
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
        Z AI can make mistakes. Verify important information.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 12, paddingTop: 8, borderTopWidth: 1, backgroundColor: 'transparent' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inputContainer: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, minHeight: 44, justifyContent: 'center' },
  input: { fontSize: 15, lineHeight: 20, paddingVertical: 0, textAlignVertical: 'center' },
  rightActions: { paddingBottom: 4 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  stopIcon: { width: 16, height: 16, borderRadius: 4, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  stopBar: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#EF4444' },
  disclaimer: { fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 8 },
});
