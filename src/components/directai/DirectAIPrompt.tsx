import { forwardRef, useRef, useEffect, useState } from 'react';
import { Button } from '../shadcn/ui/button';
import AILoadingIndicator from './AILoadingIndicator';

interface DirectAIFooterProps {
  loading: boolean;
  prompt: string;
  onChangePrompt: (v: string) => void;
  onSend: () => void;
  onClear: () => void;
  hasMessages: boolean;
}

/**
 * Footer simplifié avec zone de saisie prompt
 */
const DirectAIFooter = forwardRef<HTMLDivElement, DirectAIFooterProps>(({ 
  loading,
  prompt,
  onChangePrompt,
  onSend,
  onClear,
  hasMessages
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState(prompt);

  // Efface le prompt et remet le focus après le loading
  useEffect(() => {
    if (!loading) {
      setCurrentValue('');
      onChangePrompt('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [loading]);

  // Synchronise la valeur du textarea avec le prop prompt lors du clear
  // ou de l'envoi (pour garder le comportement du parent)
  const handleSend = () => {
    onChangePrompt(currentValue);
    onSend();
  };
  const handleClear = () => {
    setCurrentValue('');
    onClear();
  };

  return (
    <div className="flex gap-3 items-center max-w-7xl mx-auto w-full p-4">
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={e => setCurrentValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              // if (e.shiftKey) {
              //   // Laisse le retour à la ligne natif
              //   return;
              // }
              e.preventDefault();
             
              handleSend();
            }
          }}
          placeholder="Entrez votre prompt ici..."
          disabled={loading}
          className="flex-1 w-full min-h-[48px] max-h-40 resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-200 dark:bg-zinc-800/30 dark:text-zinc-100"
          rows={3}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60 pointer-events-none">
            <AILoadingIndicator />
          </div>
        )}
      </div>
      <Button 
        type="button"
        disabled={loading || !currentValue.trim()}
        onMouseDown={handleSend}
      >
        Envoyer
      </Button>
      <Button 
        type="button" 
        variant="outline"
        onClick={handleClear}
        disabled={!hasMessages}
      >
        Effacer
      </Button>
    </div>

  );
});

export default DirectAIFooter;
