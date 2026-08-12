import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { ChatMessage } from '../utils/types';

interface Props {
  message: ChatMessage;
}

const MessageBubble = memo(function MessageBubble({ message }: Props) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';

  const handleLink = (url: string) => Linking.openURL(url);

  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const firstNewline = code.indexOf('\n');
        const lang = firstNewline > 0 ? code.slice(0, firstNewline).trim() : '';
        const codeContent = firstNewline > 0 ? code.slice(firstNewline + 1) : code;
        return (
          <View key={i} style={[styles.codeBlock, { backgroundColor: colors.codeBg }]}>
            {lang ? <Text style={[styles.codeLang, { color: colors.textTertiary }]}>{lang}</Text> : null}
            <Text style={[styles.codeText, { color: colors.codeText }]} selectable>{codeContent.trim()}</Text>
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
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <Text key={i}>
          {boldParts.map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <Text key={j} style={{ fontWeight: '700' }}>{bp.slice(2, -2)}</Text>;
            }
            const urlParts = bp.split(/(https?:\/\/[^\s]+)/g);
            return urlParts.map((up, k) => {
              if (/^https?:\/\//.test(up)) {
                return (
                  <Text key={`${j}-${k}`} style={{ color: colors.primary, textDecorationLine: 'underline' }} onPress={() => handleLink(up)}>{up}</Text>
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
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[
        styles.bubble,
        isUser ? { backgroundColor: colors.userBubble } : { backgroundColor: colors.aiBubble, borderWidth: 1, borderColor: colors.border },
      ]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: colors.primaryBg }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>Z</Text>
          </View>
        )}
        <View style={[styles.contentContainer, isUser && styles.userContentContainer]}>
          <Text style={[styles.messageText, { color: isUser ? colors.userBubbleText : colors.aiBubbleText }]} selectable>
            {renderContent(message.content)}
            {message.isStreaming && <Text style={styles.cursor}>|</Text>}
          </Text>
          <View style={[styles.actions, isUser && styles.userActions]}>
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginBottom: 8 },
  userContainer: { alignItems: 'flex-end' },
  aiContainer: { alignItems: 'flex-start' },
  bubble: { maxWidth: '85%', borderRadius: 20, paddingHorizontal: 4, paddingVertical: 4, flexDirection: 'row', overflow: 'hidden' },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8, marginTop: 8, flexShrink: 0 },
  avatarText: { fontSize: 16, fontWeight: '700' },
  contentContainer: { flex: 1, paddingHorizontal: 14, paddingVertical: 8 },
  userContentContainer: { paddingRight: 6 },
  messageText: { fontSize: 15, lineHeight: 22 },
  cursor: { opacity: 0.7 },
  codeBlock: { borderRadius: 10, marginVertical: 8, overflow: 'hidden' },
  codeLang: { fontSize: 11, paddingHorizontal: 10, paddingTop: 8, fontWeight: '600' },
  codeText: { fontSize: 13, paddingHorizontal: 10, paddingBottom: 4, lineHeight: 20 },
  inlineCode: { fontSize: 13, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  userActions: { justifyContent: 'flex-end' },
  timestamp: { fontSize: 11 },
});

export default MessageBubble;
