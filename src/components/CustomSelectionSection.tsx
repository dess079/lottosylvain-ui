import React from 'react';
import { LottoBall } from './shadcn';

/**
 * Affiche la grille de sélection personnalisée des numéros.
 */
export const CustomSelectionSection: React.FC = () => (
  <section className="mb-16">
    <div className="futuristic-card">
      <h2 className="text-xl font-bold mb-6 gradient-text">Sélection personnalisée</h2>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-center text-xs opacity-70">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#7e22ce' }}></div>
          <span>Numéros réguliers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }}></div>
          <span>Complémentaire</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-400"></div>
          </div>
          <span>Sélectionnés</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-400"></div>
          </div>
          <span>Exclus</span>
        </div>
      </div>
      <div className="futuristic-number-grid mx-auto overflow-x-auto overflow-y-hidden pb-4 fade-in-scale">
        {/* Affichage statique, à remplacer par une logique dynamique si besoin */}
        {[...Array(49)].map((_, i) => {
          const number = i + 1;
          // Exemples de sélection/exclusion
          const isSelected = [7, 13, 19, 27, 35, 42, 47].includes(number);
          const isExcluded = [11, 15, 22, 30].includes(number);
          return (
            <LottoBall
              key={number}
              number={number}
              size="sm"
              isSelected={isSelected}
              isExcluded={isExcluded}
              isBonus={number === 47}
              animated={isSelected || isExcluded || number === 47}
              className="flex-shrink-0"
            />
          );
        })}
      </div>
    </div>
  </section>
);
