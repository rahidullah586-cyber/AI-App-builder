import { useState, useEffect, useCallback } from 'react';
import {
  Conversation,
  ChatMessage,
  Attachment,
} from '../utils/types';
import {
  loadConversations,
  saveConversations,
  getActiveConversationId,
  setActiveConversationId,
  generateId,
} from '../utils/storage';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loaded = await loadConversations();
      const savedActiveId = await getActiveConversationId();
      setConversations(loaded);
      if (savedActiveId && loaded.find((c) => c.id === savedActiveId)) {
        setActiveId(savedActiveId);
      } else if (loaded.length > 0) {
        setActiveId(loaded[0].id);
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (updated: Conversation[]) => {
    setConversations(updated);
    await saveConversations(updated);
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const createConversation = useCallback(async () => {
    const newConvo: Conversation = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newConvo, ...conversations];
    await persist(updated);
    setActiveId(newConvo.id);
    await setActiveConversationId(newConvo.id);
    return newConvo;
  }, [conversations, persist]);

  const deleteConversation = useCallback(
    async (id: string) => {
      const updated = conversations.filter((c) => c.id !== id);
      await persist(updated);
      if (activeId === id) {
        const next = updated.length > 0 ? updated[0].id : null;
        setActiveId(next);
        await setActiveConversationId(next);
      }
    },
    [conversations, activeId, persist]
  );

  const selectConversation = useCallback(async (id: string) => {
    setActiveId(id);
    await setActiveConversationId(id);
  }, []);

  const addMessage = useCallback(
    async (convoId: string, message: ChatMessage) => {
      const updated = conversations.map((c) => {
        if (c.id !== convoId) return c;
        const messages = [...c.messages, message];
        const title =
          c.messages.length === 0 && message.role === 'user'
            ? message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '')
            : c.title;
        return { ...c, messages, title, updatedAt: Date.now() };
      });
      await persist(updated);
    },
    [conversations, persist]
  );

  const updateLastAssistantMessage = useCallback(
    async (convoId: string, content: string) => {
      const updated = conversations.map((c) => {
        if (c.id !== convoId) return c;
        const messages = [...c.messages];
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          messages[messages.length - 1] = { ...lastMsg, content, isStreaming: false };
        }
        return { ...c, messages, updatedAt: Date.now() };
      });
      await persist(updated);
    },
    [conversations, persist]
  );

  const clearConversation = useCallback(
    async (id: string) => {
      const updated = conversations.map((c) =>
        c.id === id ? { ...c, messages: [], title: 'New Chat', updatedAt: Date.now() } : c
      );
      await persist(updated);
    },
    [conversations, persist]
  );

  const togglePin = useCallback(
    async (id: string) => {
      const updated = conversations.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      );
      await persist(updated);
    },
    [conversations, persist]
  );

  return {
    conversations,
    activeConversation,
    activeId,
    loading,
    createConversation,
    deleteConversation,
    selectConversation,
    addMessage,
    updateLastAssistantMessage,
    clearConversation,
    togglePin,
  };
}
