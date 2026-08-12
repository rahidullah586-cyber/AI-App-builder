import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { ChatMessage } from '../utils/types';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

interface Props {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
}

const MessageBubble = memo(function MessageBubble({ message, onSpeak }: Props) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    if (message.content) {
      await Clipboard.setStringAsync(message.content);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  // Simple markdown-like rendering for code blocks and inline code
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const firstNewline = code.indexOf('\n');
        const lang = firstNewline > 0 ? code.slice(0, firstNewline).trim() : '';
        const codeContent = firstNewline > 0 ? code.slice(firstNewline + 1) : code;
        return (
          <View key={i} style={[styles.codeBlock, { backgroundColor: colors.codeBg }] }>
            {lang ? (
              <Text style={[styles.codeLang, { color: colors.textTertiary }]}>{lang}</Text>
            ) : null}
            <Text style={[styles.codeText, { color: colors.codeText }]} selectable>
              {codeContent.trim()}
            </Text>
            <TouchableOpacity
              style={styles.copyCodeBtn}
              onPress={() => Clipboard.setStringAsync(codeContent.trim())}
            >
              <Ionicons name="copy-outline" size={14} color={colors.textTertiary} />
              <Text style={{ color: colors.textTertiary, fontSize: 11, marginLeft: 4 }}>Copy</Text>
            </TouchableOpacity>
          </View>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <Text key={i} style={[styles.inlineCode, { backgroundColor: colors.surfaceVariant, color: colors.accent }]}>
            {part.slice(1, -1)}
          </Text>
        );
      }
      // Handle bold
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Text key={i}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return (
                <Text key={j} style={{ fontWeight: '700', color: isUser ? colors.userBubbleText : colors.text }}>
                  {bp.slice(2, -2)}
                </Text>
              );
            }
            // Handle URLs
            const urlParts = bp.split(/(https?:\/\/[^\s]+)/g);
            return urlParts.map((up, k) => {
              if (/^https?:\/\//.test(up)) {
                return (
                  <Text
                    key={`${j}-${k}`}
                    style={{ color: colors.primary, textDecorationLine: 'underline' }}
                    onPress={() => handleLink(up)}
                  >
                    {up}
                  </Text>
                );
              }
              return <Text key={`${j}-${k}`}>{up}</Text>;
            });
          })}
        </Text>
      );
    });
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.userBubble }
            : { backgroundColor: colors.aiBubble, borderWidth: 1, borderColor: colors.border },
          message.isStreaming && styles.streaming,
        ]}
      >
        {/* Avatar */}
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: colors.primaryBg }] }>
            <Text style={[styles.avatarText, { color: colors.primary }]}>Z</Text>
          </View>
        )}

        {/* Message content */}
        <View style={[styles.contentContainer, isUser && styles.userContentContainer]}>
          <Text
            style={[
              styles.messageText,
              { color: isUser ? colors.userBubbleText : colors.aiBubbleText },
            ]}
            selectable
          >
            {renderContent(message.content)}
            {message.isStreaming && <Text style={styles.cursor}>|</Text>}
          </Text>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {message.attachments.map((att, idx) => (
                <View
                  key={idx}
                  style={[styles.attachmentChip, { backgroundColor: colors.surfaceVariant }]}
                >
                  <Ionicons
                    name={att.type === 'image' ? 'image-outline' : 'document-outline'}
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={[styles.attachmentName, { color: colors.textSecondary }]}>
                    {att.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={[styles.actions, isUser && styles.userActions]}>
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {!isUser && (
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={handleCopy} hitSlop={8}>
                  <Ionicons name="copy-outline" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
                {onSpeak && (
                  <TouchableOpacity onPress={() => onSpeak(message.content)} hitSlop={8}>
                    <Ionicons name="volume-medium-outline" size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  streaming: {
    borderColor: 'transparent',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 8,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  userContentContainer: {
    paddingRight: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  cursor: {
    opacity: 0.7,
  },
  codeBlock: {
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
  },
  codeLang: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  codeText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    paddingHorizontal: 10,
    paddingBottom: 4,
    lineHeight: 20,
  },
  inlineCode: {
    fontSize: 13,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  copyCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 8,
    alignSelf: 'flex-end',
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  attachmentName: {
    fontSize: 12,
    maxWidth: 120,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  userActions: {
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
  },
});

export default MessageBubble;
