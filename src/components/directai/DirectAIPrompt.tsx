import { forwardRef } from 'react';
import { Input } from '../shadcn/ui/input';
import { Button } from '../shadcn/ui/button';

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
    <div ref={ref} className="w-full bg-white dark:bg-zinc-900 p-4">
      <form onSubmit={e => { e.preventDefault(); onSend(); }} className="flex gap-3 items-center">
        <Input 
          value={prompt} 
          onChange={e => onChangePrompt(e.target.value)} 
          placeholder="Entrez votre prompt ici..." 
          disabled={loading} 
          className="flex-1"
        />
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
    </div>
  );
});

export default DirectAIFooter;
