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
  // Initialise la date de fin à aujourd'hui
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(today);

  // Charge les données seulement quand l'onglet devient actif
  useEffect(() => {
    if (isActive && !hasLoaded) {
      loadPreviousDraw();
    }
  }, [isActive, hasLoaded]);

  // Met à jour la date de début à la date du tirage après chargement
  useEffect(() => {
    if (previousDraw && previousDraw.previousResultDate) {
      setStartDate(previousDraw.previousResultDate);
    }
  }, [previousDraw]);

  /**
   * Récupère les données du dernier tirage
   */
  const loadPreviousDraw = async (start?: string, end?: string) => {
    try {
      setDrawLoading(true);
      setDrawError(null);
      // TODO: Adapter fetchPreviousResults pour accepter les dates si l'API le permet
      const previousResult: PreviousResult = await fetchPreviousResults(start, end);

      console.info('Données du dernier tirage récupérées:', previousResult);

      setPreviousDraw(previousResult);
      setHasLoaded(true);
    } catch (err) {
      setDrawError(err instanceof Error ? err.message : 'Erreur lors de la récupération du dernier tirage');
    } finally {
      setDrawLoading(false);
    }
  };

  /**
   * Gère la soumission du formulaire de dates
   */
  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPreviousDraw(startDate, endDate);
  };

return (
  <div className="flex flex-col gap-10 items-center justify-center ">
      {/* Formulaire de sélection de dates */}
      <div className="w-full flex flex-col items-center">
        <form
          className="w-full max-w-md mb-4 flex flex-col sm:flex-row gap-4 items-center justify-center"
          onSubmit={handleDateSubmit}
          aria-label="Sélection de la période des tirages"
        >
          <div className="flex flex-col items-center w-full sm:w-auto">
            <label htmlFor="start-date" className="mb-1 text-center">Date de début</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-slate-800 text-center"
              aria-label="Date de début"
            />
          </div>
          <div className="flex flex-col items-center w-full sm:w-auto">
            <label htmlFor="end-date" className="mb-1 text-center">Date de fin</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-slate-800 text-center"
              aria-label="Date de fin"
            />
          </div>
          <button
            type="submit"
            className="mt-4 sm:mt-0 px-5 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors shadow"
            aria-label="Rechercher les tirages"
          >
            Rechercher
          </button>
        </form>
     
      </div>

      {/* Contenu centré sous le formulaire */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        {/* Loader animé pendant le chargement */}
        {drawLoading && (
          <div className="flex flex-col items-center justify-center my-8 w-full">
            <span className="material-symbols-outlined animate-spin text-indigo-500 text-4xl mb-2">autorenew</span>
            <p className="text-center text-base">Chargement du dernier tirage...</p>
          </div>
        )}

        {/* Message d'erreur */}
        {drawError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center w-full">
            <span className="text-red-500">{drawError}</span>
          </div>
        )}

        {/* Résultat ou message si aucun résultat */}
        {!drawLoading && previousDraw ? (
          <div className="flex flex-col items-center justify-center gap-6 previous-draw-animation animate-fade-in w-full">
            <div className="flex flex-wrap justify-center gap-4 mb-2 w-full">
              {previousDraw.drawResult.map((num, idx) => (
                <LottoBall key={idx} number={num} size="md" type="regular" />
              ))}
              {previousDraw.bonusNumber !== undefined && (
                <LottoBall number={previousDraw.bonusNumber} size="md" type="bonus" />
              )}
            </div>
            <div className="text-sm mt-4 opacity-70 text-center w-full">
              Tirage en date du {previousDraw.previousResultDate}
            </div>
          </div>
        ) : (!drawLoading && !drawError && (
          <div className="w-full max-w-xl text-center text-base text-slate-500 dark:text-slate-400 my-8 animate-fade-in flex items-center justify-center">
            Aucun résultat trouvé pour la période sélectionnée.
          </div>
        ))}
      </div>
      </div>
  );
};

export default PreviousDrawTab;
