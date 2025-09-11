import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../../../components/shadcn';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../../components/shadcn';
import PredictionsFilters from './PredictionsFilters';
import { AiPredictionFilters } from '../types/aiPrediction';

interface FilterSheetProps {
  /**
   * Callback appelé lors de l'application des filtres
   */
  onApply: (filters: Partial<AiPredictionFilters>) => void;
  
  /**
   * Signal externe pour réinitialiser les filtres (incrément à chaque reset)
   */
  resetSignal?: number;
  
  /**
   * Filtres actuellement appliqués (pour affichage dans le résumé)
   */
  currentFilters?: Partial<AiPredictionFilters>;
  
  /**
   * Nombre total de résultats avec les filtres appliqués
   */
  totalResults?: number;
}

/**
 * Composant Sheet lateral contenant les filtres AI predictions
 * S'ouvre depuis la droite au clic sur l'icône Filter
 */
const FilterSheet: React.FC<FilterSheetProps> = ({ 
  onApply, 
  resetSignal, 
  currentFilters, 
  totalResults 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Gère l'application des filtres et ferme le Sheet
   */
  const handleApply = (filters: Partial<AiPredictionFilters>) => {
    onApply(filters);
    setIsOpen(false); // Ferme le Sheet après application
  };

  /**
   * Génère un résumé des filtres appliqués
   */
  const buildFilterSummary = () => {
    if (!currentFilters) return 'Aucun filtre appliqué';
    
    const parts: string[] = [];
    
    if (currentFilters.datePredictionFrom || currentFilters.datePredictionTo) {
      const from = currentFilters.datePredictionFrom?.replace('T', ' ') || '…';
      const to = currentFilters.datePredictionTo?.replace('T', ' ') || '…';
      parts.push(`Prédictions: ${from} → ${to}`);
    }
    
    if (currentFilters.dateTirageFrom || currentFilters.dateTirageTo) {
      const from = currentFilters.dateTirageFrom || '…';
      const to = currentFilters.dateTirageTo || '…';
      parts.push(`Tirages: ${from} → ${to}`);
    }
    
    if (currentFilters.modelCsv) {
      const modelCount = currentFilters.modelCsv.split(',').length;
      parts.push(`${modelCount} modèle(s)`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'Filtres par défaut';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Ouvrir les filtres"
          title="Filtres de recherche"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="flex flex-col !bg-background !opacity-100 border-l shadow-xl !backdrop-blur-none min-w-0 max-w-full"
        style={{ opacity: 1, backgroundColor: 'hsl(var(--background))' }}
      >
        <SheetHeader className="flex-shrink-0 !bg-background !opacity-100">
          <SheetTitle className="flex items-center gap-2 !text-foreground !opacity-100">
            <Filter className="h-5 w-5" />
            Filtres de recherche
          </SheetTitle>
          
          {/* Résumé des filtres actuels */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">
              {totalResults !== undefined ? `${totalResults} résultat(s)` : 'Résultats'}
            </p>
            <p className="text-xs mt-1 break-words">
              {buildFilterSummary()}
            </p>
          </div>
        </SheetHeader>

        {/* Contenu des filtres avec scroll */}
        <div className="flex-1 overflow-auto py-6 !bg-background !opacity-100 min-h-0">
          <PredictionsFilters
            onApply={handleApply}
            resetSignal={resetSignal}
          />
        </div>
        
        {/* Note d'aide en bas */}
        <div className="flex-shrink-0 p-4 border-t !bg-background !opacity-100">
          <p className="text-xs text-muted-foreground text-center bg-muted/30 rounded-md p-2 border break-words">
            💡 Les filtres se ferment automatiquement après application
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
