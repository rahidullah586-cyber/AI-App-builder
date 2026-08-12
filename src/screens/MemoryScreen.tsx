import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { MemoryItem } from '../utils/types';
import { loadMemory, saveMemory, generateId } from '../utils/storage';

export default function MemoryScreen() {
  const { colors } = useTheme();
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'preference' | 'fact' | 'context'>('all');

  useEffect(() => {
    (async () => {
      const loaded = await loadMemory();
      setMemory(loaded);
    })();
  }, []);

  const persist = useCallback(async (items: MemoryItem[]) => {
    setMemory(items);
    await saveMemory(items);
  }, []);

  const handleAdd = useCallback(async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    const item: MemoryItem = {
      id: generateId(),
      key: newKey.trim(),
      value: newValue.trim(),
      createdAt: Date.now(),
      category: detectCategory(newKey.trim()),
    };
    await persist([...memory, item]);
    setNewKey('');
    setNewValue('');
    setShowAdd(false);
  }, [newKey, newValue, memory, persist]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Memory', 'Remove this memory item?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => persist(memory.filter((m) => m.id !== id)) },
      ]);
    },
    [memory, persist]
  );

  const filtered = filter === 'all' ? memory : memory.filter((m) => m.category === filter);
  const categories: { label: string; value: typeof filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Preferences', value: 'preference' },
    { label: 'Facts', value: 'fact' },
    { label: 'Context', value: 'context' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Memory</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {memory.length} items stored
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[
              styles.filterChip,
              { borderColor: colors.border },
              filter === c.value && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setFilter(c.value)}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.textSecondary },
                filter === c.value && { color: '#FFFFFF' },
              ]}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Memory List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.memoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.memoryHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category, colors) }]}>
                <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '600' }}>
                  {item.category}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.memoryKey, { color: colors.text }]}>{item.key}</Text>
            <Text style={[styles.memoryValue, { color: colors.textSecondary }]}>{item.value}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="brain" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No memories yet</Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
              Add items to help Z AI remember your preferences
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowAdd(!showAdd)}
      >
        <Ionicons name={showAdd ? 'close' : 'add'} size={28} color='#FFFFFF' />
      </TouchableOpacity>

      {/* Add Modal */}
      {showAdd && (
        <View style={[styles.addModal, { backgroundColor: colors.surface }] }>
          <Text style={[styles.addTitle, { color: colors.text }]}>Add Memory</Text>
          <TextInput
            style={[styles.addInput, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Key (e.g., 'Favorite color')"
            placeholderTextColor={colors.textTertiary}
            value={newKey}
            onChangeText={setNewKey}
          />
          <TextInput
            style={[styles.addInput, styles.addTextarea, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
            placeholder="Value (e.g., 'Blue')"
            placeholderTextColor={colors.textTertiary}
            value={newValue}
            onChangeText={setNewValue}
            multiline
            maxLength={500}
          />
          <View style={styles.addActions}>
            <TouchableOpacity onPress={() => { setShowAdd(false); setNewKey(''); setNewValue(''); }}>
              <Text style={[styles.cancelBtn, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleAdd}
              disabled={!newKey.trim() || !newValue.trim()}
            >
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function detectCategory(key: string): MemoryItem['category'] {
  const k = key.toLowerCase();
  if (k.includes('prefer') || k.includes('like') || k.includes('favorite') || k.includes('setting'))
    return 'preference';
  if (k.includes('name') || k.includes('job') || k.includes('location') || k.includes('born'))
    return 'fact';
  return 'context';
}

function getCategoryColor(category: string, colors: any): string {
  switch (category) {
    case 'preference': return colors.primary;
    case 'fact': return colors.accent;
    case 'context': return '#F59E0B';
    default: return colors.primary;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 16, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  memoryCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 10 },
  memoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  memoryKey: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  memoryValue: { fontSize: 14, lineHeight: 20 },
  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '500' },
  emptyHint: { fontSize: 13, textAlign: 'center', maxWidth: 250, marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  addModal: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 16 },
  addTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  addInput: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginBottom: 12 },
  addTextarea: { minHeight: 80, textAlignVertical: 'top' },
  addActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 8 },
  cancelBtn: { fontSize: 15, fontWeight: '500', paddingVertical: 10 },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
});
