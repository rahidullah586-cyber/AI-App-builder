export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
 attachments?: Attachment[];
  isStreaming?: boolean;
}

export interface Attachment {
  type: 'image' | 'file' | 'audio';
  uri: string;
  name: string;
  mimeType?: string;
 size?: number;
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
  hapticFeedback: boolean;
  voiceLanguage: string;
  fontSize: 'small' | 'medium' | 'large';
  sendOnEnter: boolean;
  streamResponses: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  zaiWebUrl: 'https://z.ai',
  themeMode: 'system',
  hapticFeedback: true,
  voiceLanguage: 'en-US',
  fontSize: 'medium',
  sendOnEnter: false,
  streamResponses: true,
};
