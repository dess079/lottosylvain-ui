import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../shadcn/ui/card';
import { Label } from '../shadcn/ui/label';
import { Button } from '../shadcn/ui/button';
import { Input } from '../shadcn/ui/input';
import AIResponseBox from '../prediction/AIResponseBox';
import '../prediction/AIResponseBox.css';
import { OllamaChatResponse } from '../../types/OllamaChatResponse';

const DirectAITab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [responseChunks, setResponseChunks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  /**
   * Envoie le prompt au backend et reçoit la réponse en chunks via EventSource.
   * Chaque chunk est un objet JSON OllamaChatResponse.
   */
  const handleSendPrompt = async () => {
    setResponseChunks([]);
    setLoading(true);
    setSentMessage('Votre question a été envoyée à l’IA. Veuillez patienter pendant la génération de la réponse...');

    const eventSource = new EventSource(`/api/direct-ai/stream?prompt=${encodeURIComponent(prompt)}`);

    eventSource.onmessage = (event) => {
      try {
        const obj: OllamaChatResponse = JSON.parse(event.data);
        // On affiche le champ message.content si présent
        if (obj.message?.content) {
          setResponseChunks((prev) => [...prev, obj.message!.content]);
        }
      } catch (e) {
        // Si le chunk n'est pas du JSON, on ignore
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
      setSentMessage('');
    };

    eventSource.onopen = () => {
      // On garde loading à true jusqu'à la fin du stream
    };

    eventSource.addEventListener('end', () => {
      setLoading(false);
      setSentMessage('');
      eventSource.close();
    });

    // Fallback : désactive loading si le flux s’arrête par erreur
    // La fin normale est gérée par l'event 'end' ou onerror
  };

  return (
    <div className="direct-ai-tab-centered">
      <Card className="w-full max-w-5xl mx-auto mb-8">
        <CardHeader>
          <span className="direct-ai-label text-2xl font-bold">Réponse IA</span>
        </CardHeader>
        <CardContent>
          <AIResponseBox chunks={responseChunks} />
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="direct-ai-title">Direct AI</h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => { e.preventDefault(); handleSendPrompt(); }}
            className="flex flex-col gap-4"
          >
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Entrez votre prompt ici..."
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !prompt}
              className="mt-4 mb-2 py-3 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <span>Envoyer au AI</span>
              <svg width="28" height="28" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 11L20 11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M14 5L20 11L14 17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </Button>
            {loading && sentMessage && (
              <div className="text-blue-700 text-center font-medium mt-2" role="status">
                {sentMessage}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectAITab;
