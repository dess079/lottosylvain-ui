import { forwardRef } from 'react';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';
import AILoadingIndicator from './AILoadingIndicator';

interface DirectAIFooterProps {
  loading: boolean;
  prompt: string;
  onChangePrompt: (v: string) => void;
  onSend: () => void;
  onClear: () => void;
}

/**
 * Footer simplifié avec zone de saisie prompt
 */
const DirectAIFooter = forwardRef<HTMLDivElement, DirectAIFooterProps>(({ 
  loading,
  prompt,
  onChangePrompt,
  onSend,
  onClear
}, ref) => {
  return (
    
      <form onSubmit={e => { e.preventDefault(); onSend(); }} className="flex gap-3 items-center w-1/2 mx-auto p-4">
        <div className="relative w-full">
          <textarea
            value={prompt}
            onChange={e => onChangePrompt(e.target.value)}
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
          type="submit" 
          disabled={loading || !prompt}
        >
          Envoyer
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onClear}
        >
          Effacer
        </Button>
      </form>

  );
});

export default DirectAIFooter;
