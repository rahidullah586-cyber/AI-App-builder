import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, AppSettings, MemoryItem, DEFAULT_SETTINGS } from './types';

const KEYS = {
  CONVERSATIONS: 'zai_conversations',
  SETTINGS: 'zai_settings',
  MEMORY: 'zai_memory',
  ACTIVE_CONVO: 'zai_active_conversation',
};

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveConversations(conversations: Conversation[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function loadMemory(): Promise<MemoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.MEMORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMemory(memory: MemoryItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.MEMORY, JSON.stringify(memory));
}

export async function getActiveConversationId(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.ACTIVE_CONVO);
}

export async function setActiveConversationId(id: string | null): Promise<void> {
  if (id) {
    await AsyncStorage.setItem(KEYS.ACTIVE_CONVO, id);
  } else {
    await AsyncStorage.removeItem(KEYS.ACTIVE_CONVO);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
