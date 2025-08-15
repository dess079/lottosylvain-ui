import { useCallback, useEffect, useMemo, useState } from 'react';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface StoredSession {
  id: string;
  createdAt: string; // ISO
  name?: string;
  messages: ChatMessage[];
}
interface StoredState {
  version: number;
  activeSessionId: string;
  sessions: StoredSession[];
}

interface UseChatSessionsOptions {
  storageKey?: string;
  maxSessions?: number;
  maxMessages?: number;
  expirationDays?: number; // Supprimer sessions plus anciennes que N jours au chargement
  onPersistError?: (e: unknown) => void;
}

interface UseChatSessionsResult {
  sessions: StoredSession[];
  activeSessionId: string;
  activeMessages: ChatMessage[];
  setActiveSessionId: (id: string) => void;
  addAssistantStreamingHolder: () => void;
  appendToLastAssistant: (chunk: string) => void;
  addUserMessage: (content: string) => void;
  clearActive: () => Promise<void>;
  createSession: () => void;
  renameSession: (id: string, name: string) => void;
  mergeIntoActive: (sourceId: string) => void;
  searchMessages: (term: string) => ChatMessage[];
  exportSession: (id: string) => Blob;
  exportAll: () => Blob;
  tokenCount: number;
  storageSizeBytes: number;
}

const defaultOptions: Required<Omit<UseChatSessionsOptions, 'onPersistError'>> = {
  storageKey: 'directAI.sessions.v1',
  maxSessions: 20,
  maxMessages: 300,
  expirationDays: 7
};

export function useChatSessions(options: UseChatSessionsOptions = {}): UseChatSessionsResult {
  const { storageKey, maxSessions, maxMessages, expirationDays } = { ...defaultOptions, ...options };
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('');

  // Derived active session
  const activeSession = useMemo(() => sessions.find(s => s.id === activeSessionId) || null, [sessions, activeSessionId]);
  const activeMessages = activeSession?.messages ?? [];

  // Init
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: StoredState = JSON.parse(raw);
        if (parsed?.sessions?.length) {
          const now = Date.now();
          const cutoff = now - (expirationDays * 24 * 60 * 60 * 1000);
          const filtered = parsed.sessions.filter(s => Number(s.id) >= cutoff);
          setSessions(filtered);
          setActiveSessionId(parsed.activeSessionId || parsed.sessions[0].id);
          return;
        }
      }
    } catch (_) {}
    const first: StoredSession = { id: `${Date.now()}`, createdAt: new Date().toISOString(), messages: [], name: 'Session 1' };
    setSessions([first]);
    setActiveSessionId(first.id);
  }, [storageKey]);

  // Persist
  useEffect(() => {
    if (!activeSessionId) return;
    try {
      const toStore: StoredState = { version: 1, activeSessionId, sessions };
      localStorage.setItem(storageKey, JSON.stringify(toStore));
    } catch (e) {
      // swallow
    }
  }, [sessions, activeSessionId, storageKey]);

  const clampMessages = useCallback((msgs: ChatMessage[]): ChatMessage[] => {
    if (msgs.length <= maxMessages) return msgs;
    const overflow = msgs.length - maxMessages;
    const trimmed = msgs.slice(overflow);
    return [
      { role: 'assistant', content: `_Purge automatique: ${overflow} message(s) supprimé(s)._` },
      ...trimmed
    ];
  }, [maxMessages]);

  const updateActiveMessages = useCallback((updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: clampMessages(updater(s.messages)) } : s));
  }, [activeSessionId, clampMessages]);

  const addUserMessage = useCallback((content: string) => {
    updateActiveMessages(prev => [...prev, { role: 'user', content }]);
  }, [updateActiveMessages]);

  const addAssistantStreamingHolder = useCallback(() => {
    updateActiveMessages(prev => [...prev, { role: 'assistant', content: '' }]);
  }, [updateActiveMessages]);

  const appendToLastAssistant = useCallback((chunk: string) => {
    updateActiveMessages(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') { copy[i] = { ...copy[i], content: copy[i].content + chunk }; break; }
      }
      return copy;
    });
  }, [updateActiveMessages]);

  const createSession = useCallback(() => {
    const nextIndex = sessions.length + 1;
    const newSession: StoredSession = { id: `${Date.now()}`, createdAt: new Date().toISOString(), messages: [], name: `Session ${nextIndex}` };
    setSessions(prev => {
      let updated = [newSession, ...prev];
      if (updated.length > maxSessions) {
        updated = updated.slice(0, maxSessions);
      }
      return updated;
    });
    setActiveSessionId(newSession.id);
  }, [sessions, maxSessions]);

  const renameSession = useCallback((id: string, name: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  }, []);

  const mergeIntoActive = useCallback((sourceId: string) => {
    if (!activeSessionId || sourceId === activeSessionId) return;
    const source = sessions.find(s => s.id === sourceId);
    if (!source) return;
    updateActiveMessages(prev => clampMessages([...prev, { role: 'assistant', content: `--- Fusion depuis ${source.name || source.id} ---` }, ...source.messages]));
  }, [activeSessionId, sessions, updateActiveMessages, clampMessages]);

  const searchMessages = useCallback((term: string) => {
    if (!term.trim()) return activeMessages;
    const q = term.toLowerCase();
    return activeMessages.filter(m => m.content.toLowerCase().includes(q));
  }, [activeMessages]);

  const exportSession = useCallback((id: string) => {
    const sess = sessions.find(s => s.id === id);
    const blob = new Blob([JSON.stringify(sess || null, null, 2)], { type: 'application/json' });
    return blob;
  }, [sessions]);

  const exportAll = useCallback(() => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), sessions }, null, 2)], { type: 'application/json' });
    return blob;
  }, [sessions]);

  const estimateTokens = useCallback((text: string): number => {
    if (!text) return 0;
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const punctuation = (text.match(/[\.;,:!?]/g) || []).length;
    const byChars = Math.ceil(chars / 4);
    const byWords = Math.ceil(words * 1.35);
    const densityFactor = 1 + Math.min(punctuation / Math.max(words, 1), 0.3);
    return Math.ceil(Math.max(byChars, byWords) * densityFactor);
  }, []);

  const tokenCount = useMemo(() => activeMessages.reduce((acc, m) => acc + estimateTokens(m.content), 0), [activeMessages, estimateTokens]);

  const storageSizeBytes = useMemo(() => {
    try { return JSON.stringify({ sessions, activeSessionId }).length; } catch { return 0; }
  }, [sessions, activeSessionId]);

  const clearActive = useCallback(async () => {
    if (!activeSessionId) return;
    updateActiveMessages(() => []);
    try {
      await fetch('/api/direct-ai/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: activeSessionId }) });
    } catch (_) {}
  }, [activeSessionId, updateActiveMessages]);

  return {
    sessions,
    activeSessionId,
    activeMessages,
    setActiveSessionId,
    addAssistantStreamingHolder,
    appendToLastAssistant,
    addUserMessage,
    clearActive,
    createSession,
    renameSession,
    mergeIntoActive,
    searchMessages,
    exportSession,
  exportAll,
  tokenCount,
  storageSizeBytes
  };
}

export default useChatSessions;
