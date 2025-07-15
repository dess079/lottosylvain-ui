import React, { useState, useEffect } from 'react';
import { LottoBall } from '../shadcn';
import { fetchPreviousResults } from '../../services/api';
import type { PreviousResult } from '../../types';
import './PreviousDrawTab.css';

interface PreviousDrawTabProps {
  isActive: boolean;
}

/**
 * Composant pour afficher le dernier tirage officiel
 * Charge les données seulement quand l'onglet est actif
 */
const PreviousDrawTab: React.FC<PreviousDrawTabProps> = ({ isActive }) => {
  const [previousDraw, setPreviousDraw] = useState<PreviousResult | null>(null);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [drawLoading, setDrawLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // Charger les données seulement quand l'onglet devient actif
  useEffect(() => {
    if (isActive && !hasLoaded) {
      loadPreviousDraw();
    }
  }, [isActive, hasLoaded]);

  /**
   * Récupère les données du dernier tirage
   */
  const loadPreviousDraw = async () => {
    try {
      setDrawLoading(true);
      setDrawError(null);
      const previousResult: PreviousResult = await fetchPreviousResults();

      console.info('Données du dernier tirage récupérées:', previousResult);

      setPreviousDraw(previousResult);
      setHasLoaded(true);
    } catch (err) {
      setDrawError(err instanceof Error ? err.message : 'Erreur lors de la récupération du dernier tirage');
    } finally {
      setDrawLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">Dernier tirage officiel</h2>
      
      {drawLoading && (
        <p className="text-center text-base">Chargement du dernier tirage...</p>
      )}
      
      {drawError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <span className="text-red-500">{drawError}</span>
        </div>
      )}
      
      {!drawLoading && previousDraw && (
        <div className="flex flex-col items-center gap-6 previous-draw-animation">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            {previousDraw.drawResult.map((num, idx) => (
              <LottoBall key={idx} number={num} size="md" type="regular" />
            ))}
            {previousDraw.bonusNumber !== undefined && (
              <LottoBall number={previousDraw.bonusNumber} size="md" type="bonus" />
            )}
          </div>
          <div className="text-sm mt-4 opacity-70">
            Tirage en date du {previousDraw.previousResultDate}
          </div>
        </div>
      )}
    </section>
  );
};

export default PreviousDrawTab;
