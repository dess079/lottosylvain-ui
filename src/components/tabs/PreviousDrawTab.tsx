import React, { useEffect } from 'react';
import { addDays, subDays, getDay, format as formatDate } from 'date-fns';
import { LottoBall } from '../shadcn';
import { fetchPreviousResults } from '../../services/api';
import type { PreviousResult } from '../../types';
import CalendarDateInput from '../CalendarDateInput';
import './PreviousDrawTab.css';

interface PreviousDrawTabProps {
  isActive: boolean;
}

/**
 * Calcule la date du dernier tirage (mercredi ou samedi le plus récent)
 * et la date du prochain tirage (mercredi ou samedi suivant)
 * @param today Date de référence (au format 'YYYY-MM-DD')
 * @returns Un tuple [dateDernierTirage, dateProchainTirage]
 */
function getDrawDates(today: string): [string, string] {
  /**
   * Utilise date-fns pour calculer le dernier et le prochain tirage (mercredi ou samedi)
   * @param today Date au format 'YYYY-MM-DD'
   * @returns [dateDernierTirage, dateProchainTirage] au format 'YYYY-MM-DD'
   */
  const date = new Date(today);
  const day = getDay(date); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  const drawDays = [3, 6]; // mercredi, samedi

  // Trouver le dernier tirage
  let lastDraw = date;
  if (!drawDays.includes(day)) {
    // Cherche le plus proche jour de tirage passé
    const daysAgo = drawDays
      .map(d => (d <= day ? day - d : day + 7 - d))
      .sort((a, b) => a - b)[0];
    lastDraw = subDays(date, daysAgo);
  }

  // Trouver le prochain tirage (toujours après le dernier tirage)
  let nextDraw: Date;
  const lastDay = getDay(lastDraw);
  if (lastDay === 3) {
    // Dernier tirage mercredi -> prochain samedi
    nextDraw = addDays(lastDraw, 3);
  } else {
    // Dernier tirage samedi -> prochain mercredi
    nextDraw = addDays(lastDraw, 4);
  }

  // Format YYYY-MM-DD
  return [formatDate(lastDraw, 'yyyy-MM-dd'), formatDate(nextDraw, 'yyyy-MM-dd')];
}

/**
 * Composant pour afficher le dernier tirage officiel
 * Charge les données seulement quand l'onglet est actif
 */
const PreviousDrawTab: React.FC<PreviousDrawTabProps> = ({ isActive }) => {
  // Utilise useReducer pour gérer le state du composant
  type State = {
    previousDraw: PreviousResult | null;
    drawError: string | null;
    drawLoading: boolean;
    hasLoaded: boolean;
    startDate: string;
    endDate: string;
  };

  type Action =
    | { type: 'SET_PREVIOUS_DRAW'; payload: PreviousResult }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_LOADED'; payload: boolean }
    | { type: 'SET_START_DATE'; payload: string }
    | { type: 'SET_END_DATE'; payload: string };

  const today = new Date().toISOString().slice(0, 10);
  // Utilise getDrawDates pour initialiser correctement les dates
  const [initialStartDate, initialEndDate] = getDrawDates(today);
  const initialState: State = {
    previousDraw: null,
    drawError: null,
    drawLoading: false,
    hasLoaded: false,
    startDate: initialStartDate, // dernier mercredi/samedi < aujourd'hui
    endDate: initialEndDate,     // prochain mercredi/samedi > aujourd'hui
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_PREVIOUS_DRAW':
        return { ...state, previousDraw: action.payload };
      case 'SET_ERROR':
        return { ...state, drawError: action.payload };
      case 'SET_LOADING':
        return { ...state, drawLoading: action.payload };
      case 'SET_LOADED':
        return { ...state, hasLoaded: action.payload };
      case 'SET_START_DATE':
        return { ...state, startDate: action.payload };
      case 'SET_END_DATE':
        return { ...state, endDate: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Charge les données seulement quand l'onglet devient actif
  useEffect(() => {
    if (isActive && !state.hasLoaded) {
      // Utilise getDrawDates pour garantir la logique métier
      const [start, end] = getDrawDates(today);
      loadPreviousDraw(start, end);
    }
  }, [isActive, state.hasLoaded]);

  /**
   * Met à jour la date de début et de fin après chargement du dernier tirage
   * startDate = date du dernier tirage
   * endDate = prochain mercredi ou samedi suivant cette date
   */
  useEffect(() => {
    if (
      state.previousDraw &&
      Array.isArray(state.previousDraw.previousResult) &&
      state.previousDraw.previousResult.length > 0 &&
      typeof state.previousDraw.previousResult[0].previousResultDate === 'string'
    ) {
      // Met à jour startDate avec la date du dernier tirage
      dispatch({ type: 'SET_START_DATE', payload: state.previousDraw.previousResult[0].previousResultDate });
    }
  }, [state.previousDraw]);


  /**
   * Récupère les données du dernier tirage
   * Envoie toujours les dates, même si elles sont undefined, pour éviter null côté backend
   */
  const loadPreviousDraw = async (start?: string, end?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const today = new Date().toISOString().slice(0, 10);
      const startDate = start ? start.slice(0, 10) : today;
      const endDate = end ? end.slice(0, 10) : today;

      const previousResult: PreviousResult = await fetchPreviousResults(startDate, endDate);
      console.log('[PreviousDrawTab] loadPreviousDraw', { startDate, endDate, previousResult });
      // Accepte un tableau vide pour resultNumbers (cast any)
 
      if (!previousResult) {
        dispatch({ type: 'SET_ERROR', payload: 'Aucun tirage trouvé pour la période sélectionnée.' });
        dispatch({ type: 'SET_PREVIOUS_DRAW', payload: previousResult });
      } else {
        dispatch({ type: 'SET_PREVIOUS_DRAW', payload: previousResult });
      }
      dispatch({ type: 'SET_LOADED', payload: true });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Erreur lors de la récupération du dernier tirage' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Gère la soumission du formulaire de dates
   */
  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPreviousDraw(state.startDate, state.endDate);
  };

return (
  <div className="h-full w-full flex flex-col items-center justify-start py-8 px-4">
      {/* Formulaire de sélection de dates */}
      <div className="w-full flex justify-center mb-8">
        <form
          className="w-full max-w-md flex flex-col sm:flex-row gap-4 items-center justify-center"
          onSubmit={handleDateSubmit}
          aria-label="Sélection de la période des tirages"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <CalendarDateInput
              id="start-date"
              label="Date de début"
              value={state.startDate}
              onChange={e => dispatch({ type: 'SET_START_DATE', payload: e.target.value })}
              ariaLabel="Date de début"
            />
            <CalendarDateInput
              id="end-date"
              label="Date de fin"
              value={state.endDate}
              onChange={e => dispatch({ type: 'SET_END_DATE', payload: e.target.value })}
              ariaLabel="Date de fin"
            />
          </div>
          <button
            type="submit"
            className="self-end px-5 py-2 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors shadow"
            aria-label="Rechercher les tirages"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Contenu centré sous le formulaire */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        {/* Loader animé pendant le chargement */}
        {state.drawLoading && (
          <div className="flex flex-col items-center justify-center my-8 w-full">
            <span className="material-symbols-outlined animate-spin text-indigo-500 text-4xl mb-2">autorenew</span>
            <p className="text-center text-base">Chargement du dernier tirage...</p>
          </div>
        )}

        {/* Message d'erreur */}
        {state.drawError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center w-full max-w-xl">
            <span className="text-red-500">{state.drawError}</span>
          </div>
        )}
        
        {/* Résultat ou message si aucun résultat */}
        {!state.drawLoading && state.previousDraw && Array.isArray(state.previousDraw) ? (
          state.previousDraw.length > 0 ? (
            <div className="flex flex-col items-center justify-center gap-8 previous-draw-animation animate-fade-in w-full max-w-4xl">
              {state.previousDraw.map((draw, idx) => (
                <div key={draw.previousResultDate + '-' + idx} className="w-full flex flex-col items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex flex-wrap justify-center gap-4 mb-2 w-full">
                    {/* Affiche les numéros gagnants pour ce tirage */}
                    {Array.isArray(draw.resultNumbers) && draw.resultNumbers.length > 0
                      ? draw.resultNumbers.map((num: number, i: number) => (
                          <LottoBall key={i} number={num} size="md" type="regular" />
                        ))
                      : <span className="text-slate-400 text-base">Aucun numéro à afficher</span>
                    }
                    {/* Affiche le numéro bonus si présent */}
                    {typeof draw.bonusNumber === 'number' && (
                      <LottoBall number={draw.bonusNumber} size="md" type="bonus" />
                    )}
                  </div>
                  <div className="text-sm mt-2 opacity-70 text-center w-full">
                    Tirage en date du {draw.previousResultDate}
                  </div>
                  {draw.message && (
                    <div className="text-xs text-red-500 mt-1">{draw.message}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-xl text-center text-base text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
              {/* Debug structure reçue */}
              <pre className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded mb-2">{JSON.stringify(state.previousDraw, null, 2)}</pre>
              Aucun résultat trouvé pour la période sélectionnée.
            </div>
          )
        ) : (!state.drawLoading && !state.drawError && (
          <div className="w-full max-w-xl text-center text-base text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
            {/* Affichage explicite si previousDraw absent ou mal typé */}
            <pre className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded mb-2">{JSON.stringify(state.previousDraw, null, 2)}</pre>
            Aucun résultat trouvé pour la période sélectionnée.
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousDrawTab;
