import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useConversations } from '../hooks/useConversations';

export default function ConversationsScreen() {
  const { colors } = useTheme();
  const {
    conversations,
    activeId,
    selectConversation,
    deleteConversation,
    togglePin,
  } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');

  const pinned = conversations.filter((c) => c.isPinned);
  const unpinned = conversations.filter((c) => !c.isPinned);

  const filteredUnpinned = searchQuery
    ? unpinned.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : unpinned;

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete', 'Delete this conversation?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteConversation(id) },
      ]);
    },
    [deleteConversation]
  );

  const renderConversation = useCallback(
    ({ item }: { item: { id: string; title: string; messages: { length: number }; updatedAt: number; isPinned?: boolean } }) => {
        const isActive = item.id === activeId;
        const lastMsg = item.messages > 0
          ? `${item.messages} messages`
          : 'No messages yet';
        const time = formatTime(item.updatedAt);

        return (
          <TouchableOpacity
            style={[
              styles.convoItem,
              { backgroundColor: isActive ? colors.primaryBg : colors.surface },
              isActive && { borderLeftWidth: 3, borderLeftColor: colors.primary },
            ]}
            onPress={() => selectConversation(item.id)}
            onLongPress={() => {
              Alert.alert(item.title, 'Choose an action', [
                { text: item.isPinned ? 'Unpin' : 'Pin', onPress: () => togglePin(item.id) },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
          >
            <View style={styles.convoContent}>
              <View style={styles.convoTop}>
                {item.isPinned && (
                  <Ionicons name="pin" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                )}
                <Text
                  style={[styles.convoTitle, { color: isActive ? colors.primary : colors.text }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </View>
              <Text style={[styles.convoMeta, { color: colors.textTertiary }]}>{lastMsg}</Text>
            </View>
            <Text style={[styles.convoTime, { color: colors.textTertiary }]}>{time}</Text>
          </TouchableOpacity>
        );
      },
    [colors, activeId, selectConversation, togglePin, handleDelete]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.inputBg }] }>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <Text
            style={[styles.searchInput, { color: searchQuery ? colors.text : colors.textTertiary }]}
            onPress={() => setSearchQuery(searchQuery ? '' : ' ')}
          >
            {searchQuery ? searchQuery : 'Search conversations...'}
          </Text>
        </View>
      </View>

      <FlatList
        data={[...pinned, ...filteredUnpinned]}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          pinned.length > 0 ? (
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>Pinned</Text>
          ) : undefined
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="message-text-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No conversations yet</Text>
          </View>
        }
      />
    </View>
  );
}

function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  if (diff < 86400000) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 604800000) {
    return new Date(ts).toLocaleDateString([], { weekday: 'short' });
  }
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, gap: 10,
  },
  searchInput: { fontSize: 15, flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  convoItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: 12, marginBottom: 2,
  },
  convoContent: { flex: 1, marginRight: 12 },
  convoTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  convoTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  convoMeta: { fontSize: 13 },
  convoTime: { fontSize: 12 },
  separator: { height: 1, marginLeft: 14, opacity: 0.5 },
  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
});
