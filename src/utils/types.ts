export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  createdAt: number;
  category: 'preference' | 'fact' | 'context';
}

export interface AppSettings {
  zaiWebUrl: string;
  themeMode: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  streamResponses: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  zaiWebUrl: 'https://z.ai',
  themeMode: 'system',
  fontSize: 'medium',
  streamResponses: true,
};
