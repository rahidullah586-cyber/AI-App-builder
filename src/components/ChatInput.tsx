import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { Attachment } from '../utils/types';

interface Props {
  onSend: (text: string, attachments?: Attachment[]) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  onStartVoice?: () => void;
  isRecordingVoice?: boolean;
}

export default function ChatInput({ onSend, onStop, isStreaming, onStartVoice, isRecordingVoice }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    if (isStreaming) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
  }, [text, attachments, isStreaming, onSend]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: true,
      });
      if (!result.canceled && result.assets) {
        const newAttachments: Attachment[] = result.assets.map((a) => ({
          type: 'image',
          uri: a.uri,
          name: a.fileName || `image_${Date.now()}.jpg`,
          mimeType: a.mimeType,
          size: a.fileSize,
        }));
        setAttachments((prev) => [...prev, ...newAttachments]);
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled && result.assets && result.assets[0]) {
        const a = result.assets[0];
        setAttachments((prev) => [
          ...prev,
          {
            type: 'image',
            uri: a.uri,
            name: a.fileName || `photo_${Date.now()}.jpg`,
            mimeType: a.mimeType,
            size: a.fileSize,
          },
        ]);
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/*', 'application/vnd.openxmlformats-officedocument.*'],
        multiple: true,
      });
      if (result.canceled) return;
      const newAttachments: Attachment[] = result.assets.map((a) => ({
        type: 'file',
        uri: a.uri,
        name: a.name,
        mimeType: a.mimeType,
        size: a.size,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      console.error('Document picker error:', err);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const isSendDisabled = !text.trim() && attachments.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
      style={[styles.wrapper, { borderTopColor: colors.border }]}
    >
      {/* Attachment chips */}
      {attachments.length > 0 && (
        <View style={styles.attachmentsRow}>
          {attachments.map((att, idx) => (
            <View key={idx} style={[styles.attachmentChip, { backgroundColor: colors.surfaceVariant }] }>
              <Ionicons
                name={att.type === 'image' ? 'image' : 'document'}
                size={14}
                color={colors.primary}
              />
              <Text style={[styles.attachmentName, { color: colors.textSecondary }]} numberOfLines={1}>
                {att.name}
              </Text>
              <TouchableOpacity onPress={() => removeAttachment(idx)} hitSlop={4}>
                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputRow}>
        {/* Action buttons */}
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePickImage}
            hitSlop={8}
          >
            <Ionicons name="image-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePickDocument}
            hitSlop={8}
          >
            <MaterialCommunityIcons name="paperclip" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Text input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBg }] }>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            placeholder="Ask Z AI anything..."
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            multiline
            maxHeight={120}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            onSubmitEditing={() => {
              if (!text.trim()) return;
              handleSend();
            }}
            blurOnSubmit={false}
          />
        </View>

        {/* Right side: voice / send / stop */}
        <View style={styles.rightActions}>
          {isStreaming ? (
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.danger }]}
              onPress={onStop}
              hitSlop={8}
            >
              <View style={styles.stopIcon}>
                <View style={styles.stopBar} />
              </View>
            </TouchableOpacity>
          ) : isSendDisabled ? (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={onStartVoice}
              hitSlop={8}
            >
              {isRecordingVoice ? (
                <View style={styles.recordingDot}>
                  <View style={[styles.recordingInner, { backgroundColor: colors.danger }]} />
                </View>
              ) : (
                <FontAwesome6 name="microphone" size={18} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: colors.primary }]}
              onPress={handleSend}
              hitSlop={8}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
        Z AI can make mistakes. Verify important information.
      </Text>
    </KeyboardAvoidingView>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  attachmentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  attachmentName: {
    fontSize: 12,
    maxWidth: 120,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 2,
    paddingBottom: 4,
  },
  actionBtn: {
    padding: 6,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 0,
  textAlignVertical: 'center',
  },
  rightActions: {
    paddingBottom: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBar: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
  recordingDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
});
