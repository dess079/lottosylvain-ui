import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import AIResponseBox from './AIResponseBox';
import useChatSessions from '../../hooks/useChatSessions';

/**
 * Onglet Direct AI pour envoyer un prompt et afficher la réponse IA en streaming
 */
const DirectAITab: React.FC = () => {
  // Remplacement logique interne par hook
  const {
    sessions,
    activeSessionId,
    activeMessages,
    setActiveSessionId,
    addUserMessage,
    addAssistantStreamingHolder,
    appendToLastAssistant,
    clearActive,
    createSession,
    renameSession,
    mergeIntoActive,
    searchMessages,
    exportSession,
    exportAll,
    tokenCount,
    storageSizeBytes
  } = useChatSessions();

  const [prompt, setPrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [renamingSessionId, setRenamingSessionId] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault(); void clearActive();} };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [clearActive]);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(()=> setDebouncedSearch(searchTerm), 300); return () => clearTimeout(t);
  }, [searchTerm]);
  const displayedMessages = useMemo(() => searchMessages(debouncedSearch), [searchMessages, debouncedSearch]);

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    const toSend = prompt.trim();
    addUserMessage(toSend);
    addAssistantStreamingHolder();
    setPrompt('');
    inputRef.current?.focus();
    setLoading(true);
    const es = new EventSource(`/api/direct-ai/stream?prompt=${encodeURIComponent(toSend)}`);
    es.onmessage = ev => {
      try { const obj: any = JSON.parse(ev.data); if (obj?.message?.content) appendToLastAssistant(obj.message.content); } catch {}
    };
    es.addEventListener('end', () => { setLoading(false); es.close(); });
    es.onerror = () => { setLoading(false); es.close(); };
  };

  const startRename = (id: string, current?: string) => { setRenamingSessionId(id); setRenameValue(current || ''); };
  const applyRename = () => { if (!renamingSessionId) return; renameSession(renamingSessionId, renameValue.trim()); setRenamingSessionId(''); setRenameValue(''); };

  const handleExport = (sessionId: string) => {
    const blob = exportSession(sessionId); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`session-${sessionId}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const mergeInto = () => { if (!mergeTargetId) return; mergeIntoActive(mergeTargetId); setMergeTargetId(''); };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 min-h-0 flex flex-col px-4 pt-3 pb-2">
        <div className="w-full max-w-5xl mx-auto flex-1 min-h-0 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">Sessions:</span>
            {sessions.map(s => {
              const active = s.id === activeSessionId;
              return (
                <div key={s.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveSessionId(s.id)}
                    className={`px-2 py-1 rounded-md border text-[11px] transition ${active ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'}`}
                    title={new Date(Number(s.id)).toLocaleString()}
                  >{renamingSessionId === s.id ? '...' : (s.name || new Date(Number(s.id)).toLocaleTimeString())}</button>
                  <button className="text-[10px] px-1 py-0.5 rounded border border-dashed border-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60" onClick={() => startRename(s.id, s.name)} title="Renommer">✎</button>
                </div>
              );
            })}
            <button onClick={createSession} className="px-2 py-1 rounded-md border border-dashed border-zinc-400 text-[11px] hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50" title="Nouvelle session">+</button>
            <div className="flex items-center gap-1 ml-auto">
              <input value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSearchTerm(e.target.value)} placeholder="Rechercher..." className="px-2 py-1 text-[11px] rounded-md border border-zinc-300 dark:border-zinc-600 bg-white/70 dark:bg-zinc-800/70 focus:outline-none" />
              <select value={mergeTargetId} onChange={e=>setMergeTargetId(e.target.value)} className="px-2 py-1 text-[11px] rounded-md border border-zinc-300 dark:border-zinc-600 bg-white/70 dark:bg-zinc-800/70">
                <option value="">Fusionner...</option>
                {sessions.filter(s=>s.id!==activeSessionId).map(s=> <option key={s.id} value={s.id}>{s.name||s.id}</option>)}
              </select>
              <button disabled={!mergeTargetId} onClick={mergeInto} className="px-2 py-1 text-[11px] rounded-md border border-zinc-300 dark:border-zinc-600 disabled:opacity-40 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60">OK</button>
            </div>
          </div>
          {renamingSessionId && (
            <div className="flex items-center gap-2 mb-2 text-xs">
              <input value={renameValue} onChange={e=>setRenameValue(e.target.value)} className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 text-[12px] flex-1" autoFocus />
              <button onClick={applyRename} className="px-2 py-1 rounded bg-blue-600 text-white text-[11px]">OK</button>
              <button onClick={()=>{setRenamingSessionId(''); setRenameValue('');}} className="px-2 py-1 rounded border text-[11px]">Annuler</button>
            </div>
          )}
            <AIResponseBox messages={displayedMessages} loading={loading} className="flex-1" />
        </div>
      </div>

       <div className="w-full backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-1 flex flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4 flex-wrap">
          <div className="flex gap-4 items-center">
            <span>{activeMessages.length} message{activeMessages.length>1?'s':''}</span>
            <span>~{tokenCount} tokens</span>
            <span className="opacity-70">{(storageSizeBytes/1024).toFixed(1)} KB</span>
            {loading && <span className="flex items-center gap-1 animate-pulse">● <span>Streaming...</span></span>}
            {activeMessages.length>0 && (
              <button onClick={()=>handleExport(activeSessionId)} className="px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700">Export JSON</button>
            )}
            {sessions.length>0 && (
              <button onClick={() => { const blob = exportAll(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='sessions-all.json'; a.click(); URL.revokeObjectURL(url); }} className="px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700">Export ALL</button>
            )}
          </div>
        
        </div>
        <form onSubmit={e=>{e.preventDefault(); handleSendPrompt();}} className="max-w-3xl mx-auto px-4 pb-4 flex flex-row gap-3">
          <Input id="prompt" ref={inputRef} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Entrez votre prompt ici..." disabled={loading} className="flex-1 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm" />
          <Button type="submit" disabled={loading || !prompt} className="py-3 px-6 flex items-center justify-center gap-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200">
            <span>Envoyer</span>
            </Button>

          {searchTerm && <span className="italic opacity-70">{displayedMessages.length}/{activeMessages.length}</span>}
          <Button type="button" onClick={()=> clearActive()} disabled={!activeMessages.length} className="px-2 py-1 rounded-md border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed" title="Effacer (Ctrl/Cmd + K)">Effacer</Button>
    
        </form>
      </div>
    </div>
  );
};

export default DirectAITab;
