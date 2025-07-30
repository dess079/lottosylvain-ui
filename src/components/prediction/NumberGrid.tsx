import React from 'react';
import { LottoBall } from '../shadcn';
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
    <>
      <div className="w-full text-center text-sm mb-4">
        Clic droit sur une boule pour exclure le numéro
      </div>
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-x-16 gap-y-4 my-8">
        {numbers.map((number, idx) => {
          const isSelected = selectedNumbers.includes(number);
          const isExcluded = excludedNumbers.includes(number);
          return (
            <div key={number} className="relative">
              <button
                className="w-14 h-14 rounded-full flex items-center justify-center font-medium transition-all duration-200 text-lg shadow-lg p-0 overflow-visible"
                style={{ background: 'none', border: 'none' }}
                onClick={() => onSelect(number)}
                onContextMenu={e => {
                  e.preventDefault();
                  onExclude(number);
                }}
              >
                {/* Affichage du numéro via LottoBall, avec style selon sélection/exclusion */}
                <LottoBall
                  number={number}
                  isSelected={isSelected}
                  isExcluded={isExcluded}
                />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NumberGrid;
