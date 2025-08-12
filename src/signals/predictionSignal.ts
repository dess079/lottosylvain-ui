import { LottoAIResponse } from '@/types/LottoAIResponse';
import { signal } from '@preact/signals-react';

/**
 * Type pour l'état global de la prédiction IA (bouton, prédiction, erreur)
 */
export type AiPredictionState = {
  isAILoading: boolean;
  lottoAIResponse: LottoAIResponse | null;
  error: string | null;
};

/**
 * Signal global pour conserver l'état de la prédiction IA principale dans toute l'application.
 */
export const aiPredictionStateSignal = signal<AiPredictionState>({
  isAILoading: false,
  lottoAIResponse: null,
  error: null,
});
