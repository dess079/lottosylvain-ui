import React, { useState, useEffect } from 'react';
import AIResponseBox from './AIResponseBox';
import DirectAIPrompt from './DirectAIPrompt';

/**
 * Onglet Direct AI pour envoyer un prompt et afficher la réponse IA en streaming
 */
const DirectAITab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  // Charger l'historique au montage du composant
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/direct-ai/history');
      if (response.ok) {
        const history: string[] = await response.json();
        // Convertir l'historique en format messages
        const historyMessages: { role: 'user' | 'assistant'; content: string }[] = [];
        for (let i = 0; i < history.length; i++) {
          const item = history[i];
          if (item.startsWith('User: ')) {
            historyMessages.push({
              role: 'user',
              content: item.substring(6) // Enlever "User: "
            });
          } else if (item.startsWith('AI: ')) {
            historyMessages.push({
              role: 'assistant',
              content: item.substring(4) // Enlever "AI: "
            });
          }
        }
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    const toSend = prompt.trim();

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { role: 'user', content: toSend }]);

    // Ajouter un placeholder pour la réponse assistant
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    setPrompt('');
    setLoading(true);

    const es = new EventSource(`/api/direct-ai/stream?prompt=${encodeURIComponent(toSend)}`);
    es.onmessage = ev => {
      try {
        const obj: any = JSON.parse(ev.data);
        if (obj?.message?.content) {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex]?.role === 'assistant') {
              newMessages[lastIndex].content += obj.message.content;
            }
            return newMessages;
          });
        }
      } catch {}
    };
    es.addEventListener('end', () => {
      setLoading(false);
      es.close();
      // Plus besoin de sauvegarder ici, c'est fait côté backend
    });
    es.onerror = () => {
      setLoading(false);
      es.close();
    };
  };

  const handleClear = async () => {
    try {
      const response = await fetch('/api/direct-ai/clear-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessages([]);
      } else {
        console.error('Erreur lors de la suppression de l\'historique');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Zone messages avec hauteur fixe et scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-2">
          <AIResponseBox
            messages={messages}
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
          onClear={handleClear}
        />
      </div>
    </div>
  );
};

export default DirectAITab;