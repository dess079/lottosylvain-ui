import React, { useMemo, useState } from 'react';
import useChatSessions from '../../hooks/useChatSessions';
import AIResponseBox from './AIResponseBox';
import DirectAIPrompt from './DirectAIPrompt';

/**
 * Onglet Direct AI pour envoyer un prompt et afficher la réponse IA en streaming
 */
const DirectAITab: React.FC = () => {
  const {
    addUserMessage,
    addAssistantStreamingHolder,
    appendToLastAssistant,
    clearActive,
    searchMessages
  } = useChatSessions();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  const displayedMessages = useMemo(() => searchMessages(''), [searchMessages]);

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    const toSend = prompt.trim();
    addUserMessage(toSend);
    addAssistantStreamingHolder();
    setPrompt('');
    setLoading(true);
    const es = new EventSource(`/api/direct-ai/stream?prompt=${encodeURIComponent(toSend)}`);
    es.onmessage = ev => {
      try { const obj: any = JSON.parse(ev.data); if (obj?.message?.content) appendToLastAssistant(obj.message.content); } catch {}
    };
    es.addEventListener('end', () => { setLoading(false); es.close(); });
    es.onerror = () => { setLoading(false); es.close(); };
  };

  return (
    <div className="w-full flex flex-col gap-2 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Zone messages avec hauteur fixe et scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-2">
          <AIResponseBox
            messages={displayedMessages}
            loading={loading}
          />
        </div>
      </div>
      

      {/* Footer fixe avec hauteur définie */}
      <div className="flex-shrink-0 shadow-lg">
        <DirectAIPrompt
          loading={loading}
          prompt={prompt}
          onChangePrompt={setPrompt}
          onSend={handleSendPrompt}
          onClear={clearActive}
        />
      </div>
    </div>
  );
};

export default DirectAITab;