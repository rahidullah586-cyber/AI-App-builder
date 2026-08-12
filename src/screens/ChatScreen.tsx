import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, FlatList, StyleSheet, Platform, TouchableOpacity, Alert, Text,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';

import { useTheme } from '../theme';
import { GradientBar, GlowOrb } from '../theme/GradientView';
import { useConversations } from '../hooks/useConversations';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { generateId, loadSettings } from '../utils/storage';
import { AnimatedChatBubble, TypingIndicator } from '../components/Animations';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import WebViewChat from '../components/WebViewChat';
import { ChatMessage, Attachment } from '../utils/types';

const SUGGESTIONS = [
  'Explain quantum computing simply',
  'Write a Python sorting script',
  'Plan a trip to Islamabad',
  'Help me brainstorm startup ideas',
];

export default function ChatScreen() {
  const { colors, isDark, themePreset } = useTheme();
  const { activeConversation, createConversation, addMessage, updateLastAssistantMessage, clearConversation } = useConversations();
  const voice = useVoiceInput();
  const flatListRef = useRef<FlatList>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWebViewMode, setIsWebViewMode] = useState(false);
  const [zaiUrl, setZaiUrl] = useState('https://z.ai');

  useEffect(() => {
    (async () => { const s = await loadSettings(); setZaiUrl(s.zaiWebUrl); })();
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 100);
  }, []);

  useEffect(() => {
    if (activeConversation?.messages.length) scrollToBottom();
  }, [activeConversation?.messages.length, scrollToBottom]);

  const simulateStreamResponse = useCallback(
    async (convoId: string, userText: string) => {
      const response = getSimulatedResponse(userText);
      let current = '';
      for (let i = 0; i < response.length; i += 3) {
        current += response.slice(i, i + 3);
        await updateLastAssistantMessage(convoId, current);
        await new Promise((r) => setTimeout(r, 15));
      }
      await updateLastAssistantMessage(convoId, response);
      setIsStreaming(false);
    },
    [updateLastAssistantMessage]
  );

  const handleSend = useCallback(
    async (text: string, attachments?: Attachment[]) => {
      if (!text && (!attachments || attachments.length === 0)) return;
      let convoId = activeConversation?.id;
      if (!convoId) { const convo = await createConversation(); convoId = convo.id; }
      await addMessage(convoId, { id: generateId(), role: 'user', content: text, timestamp: Date.now(), attachments });
      await addMessage(convoId, { id: generateId(), role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true });
      setIsStreaming(true);
      simulateStreamResponse(convoId, text);
    },
    [activeConversation, createConversation, addMessage, simulateStreamResponse]
  );

  const handleStop = useCallback(() => { setIsStreaming(false); }, []);

  const handleNewChat = useCallback(async () => {
    if (activeConversation && activeConversation.messages.length > 0) await createConversation();
  }, [activeConversation, createConversation]);

  const handleClearChat = useCallback(() => {
    Alert.alert('Clear Chat', 'Clear all messages?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => activeConversation && clearConversation(activeConversation.id) },
    ]);
  }, [activeConversation, clearConversation]);

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.background }] }>
      <GradientBar height={2} />
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleNewChat}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <View style={[styles.logoDot, { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 4 }]} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Z AI</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setIsWebViewMode(!isWebViewMode)}>
            <Ionicons name={isWebViewMode ? 'chatbubble-outline' : 'globe-outline'} size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          {activeConversation && activeConversation.messages.length > 0 && (
            <TouchableOpacity style={styles.headerBtn} onPress={handleClearChat}>
              <MaterialCommunityIcons name="broom" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (isWebViewMode) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {renderHeader()}
        <WebViewChat url={zaiUrl} />
      </View>
    );
  }

  const messages = activeConversation?.messages || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}

      {/* Ambient glow behind chat area */}
      <GlowOrb size={300} style={{ top: -100, right: -80, opacity: 0.04 }} />
      <GlowOrb size={200} style={{ bottom: 200, left: -60, opacity: 0.03 }} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedChatBubble isUser={item.role === 'user'} index={index}>
            <MessageBubble message={item} onSpeak={voice.speak} />
          </AnimatedChatBubble>
        )}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlowOrb size={250} style={{ top: 60, opacity: 0.06 }} />
            <Animated.View entering={FadeIn.duration(800).delay(200)}>
              <View style={[styles.emptyLogo, { backgroundColor: colors.primaryBg, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 20 }]}>
                <Text style={[styles.emptyLogoText, { color: colors.primary, textShadowColor: colors.primary, textShadowRadius: 10 }]}>Z</Text>
              </View>
            </Animated.View>
            <Animated.Text entering={FadeInDown.duration(600).delay(400)} style={[styles.emptyTitle, { color: colors.text }]}>
              Z AI
            </Animated.Text>
            <Animated.Text entering={FadeInDown.duration(600).delay(500)} style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Your agentic AI companion. Ask me anything.
            </Animated.Text>
            <View style={styles.suggestionGrid}>
              {SUGGESTIONS.map((s, i) => (
                <Animated.View key={i} entering={FadeInDown.duration(400).delay(600 + i * 80).springify().damping(18)}>
                  <TouchableOpacity
                    style={[styles.suggestionChip, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
                    onPress={() => handleSend(s)}
                  >
                    <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>{s}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        }
        ListFooterComponent={isStreaming ? <TypingIndicator /> : null}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}
      />
      <ChatInput
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
        onStartVoice={voice.isRecording ? voice.stopRecording : voice.startRecording}
        isRecordingVoice={voice.isRecording}
      />
    </View>
  );
}

function getSimulatedResponse(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes('quantum')) {
    return 'Great question! **Quantum computing** uses **qubits** instead of classical bits. While a regular bit is either 0 or 1, a qubit can be in a *superposition* of both states simultaneously.\n\nThis allows quantum computers to process certain calculations exponentially faster than classical computers. Key applications include:\n\n- Cryptography and security\n- Drug discovery and molecular simulation\n- Optimization problems\n- Machine learning acceleration\n\nCompanies like IBM, Google, and Microsoft are leading quantum research. Google\'s Sycamore processor achieved **quantum supremacy** in 2019 by solving a problem in 200 seconds that would take a classical supercomputer 10,000 years.';
  }
  if (lower.includes('python') || lower.includes('script')) {
    return 'Here\'s a Python sorting script for you:\n\n```python\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\ndata = [38, 27, 43, 3, 9, 82, 10]\nprint(merge_sort(data))\n```\n\nThis implements **merge sort** with O(n log n) time complexity. Want me to explain any part?';
  }
  if (lower.includes('trip') || lower.includes('islamabad')) {
    return 'Here\'s a trip plan for **Islamabad**! \n\n**Day 1 - Arrival & City Tour**\n- Visit **Faisal Mosque**, one of the largest mosques in the world\n- Explore **Daman-e-Koh** for panoramic city views\n- Evening at **Saidpur Village** for dinner\n\n**Day 2 - Nature & Culture**\n- Morning at **Margalla Hills** hiking trails\n- Visit **Pakistan Monument** and museum\n- Shop at **Centaurus Mall**\n\n**Day 3 - Day Trips**\n- **Taxila** - UNESCO World Heritage archaeological site\n- Or **Murree** - hill station 1 hour away\n\n**Budget Tips:**\n- Average hotel: $30-80/night\n- Local food: $3-8 per meal\n- Uber/ride-hailing is cheap and reliable\n\nWant me to help with flights or a detailed budget?';
  }
  return 'I\'m your Z AI assistant! I can help you with:\n\n- **Writing** - articles, code, emails, creative content\n- **Analysis** - data, documents, research\n- **Problem solving** - debugging, math, strategy\n- **Learning** - explanations, tutorials, Q&A\n- **Planning** - trips, projects, schedules\n\nWhat would you like to explore? I\'m here to help!';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { borderBottomWidth: 1, borderBottomColor: 'transparent' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  headerLeft: { flex: 1, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center', flexDirection: 'row', gap: 6 },
  headerRight: { flex: 1, alignItems: 'flex-end', flexDirection: 'row', gap: 4 },
  headerBtn: { padding: 6 },
  logoDot: { width: 10, height: 10, borderRadius: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  messagesList: { paddingVertical: 16, flexGrow: 1 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80 },
  emptyLogo: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyLogoText: { fontSize: 36, fontWeight: '800' },
  emptyTitle: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  suggestionGrid: { gap: 10, width: '100%' },
  suggestionChip: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16, borderWidth: 1 },
  suggestionText: { fontSize: 14, lineHeight: 20 },
});
