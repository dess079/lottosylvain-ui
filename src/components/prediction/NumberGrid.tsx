import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn';
import type { PredictionData } from '../../types';

/**
 * Grille interactive pour sélectionner ou exclure les numéros.
 * @param selectedNumbers Numéros sélectionnés
 * @param excludedNumbers Numéros exclus
 * @param onSelect Fonction de sélection
 * @param onExclude Fonction d'exclusion
 * @param minNumber Premier numéro
 * @param maxNumber Dernier numéro
 */
const NumberGrid: React.FC<{
  selectedNumbers: number[];
  excludedNumbers: number[];
  onSelect: (number: number) => void;
  onExclude: (number: number) => void;
  minNumber: number;
  maxNumber: number;
}> = ({ selectedNumbers, excludedNumbers, onSelect, onExclude, minNumber, maxNumber }) => {
  const numbers = Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => i + minNumber).sort((a, b) => a - b);

  return (
    <div className="grid grid-cols-7 sm:grid-cols-10 gap-4 my-8">
      {numbers.map(number => {
        const isSelected = selectedNumbers.includes(number);
        const isExcluded = excludedNumbers.includes(number);
        return (
          <div key={number} className="relative">
            <button
              className={`w-14 h-14 rounded-full flex items-center justify-center font-medium transition-all duration-200 text-lg shadow-lg ${
                isSelected
                  ? 'bg-primary-200 text-primary-800 border-3 border-primary-500 shadow-md scale-110'
                  : isExcluded
                  ? 'bg-gray-200 text-gray-500 border-3 border-gray-500 line-through opacity-70'
                  : 'bg-white hover:bg-gray-100 border-2 border-gray-300 hover:shadow-xl hover:scale-105'
              }`}
              onClick={() => onSelect(number)}
              onContextMenu={e => {
                e.preventDefault();
                onExclude(number);
              }}
            >
              {number}
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-gray-800 text-white text-xs rounded-full cursor-help shadow-md">
                    ?
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clic droit pour exclure le numéro</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      })}
    </div>
  );
};

export default NumberGrid;
