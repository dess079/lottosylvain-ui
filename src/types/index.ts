/**
 * Interface représentant la réponse AIResponse du backend
 */
export interface AIResponse {
  /** Identifiant de la requête */
  requestId?: string;
  /** Contenu de la réponse */
  content?: string;
  /** Indique si la requête a réussi */
  success: boolean;
  /** Type de jeu */
  gameType?: string;
  /** Type d'analyse */
  analysisType?: string;
  /** Modèle utilisé */
  model?: string;
  /** Temps de traitement en ms */
  processingTimeMs?: number;
  /** Timestamp de la réponse (ISO string) */
  timestamp?: string;
  /** Code d'erreur */
  error?: string;
  /** Message d'erreur spécifique */
  errorMessage?: string;
  /** Réponse brute de l'AI */
  response?: string;
  /** Nombre de tokens dans le prompt */
  promptTokens?: number;
  /** Nombre de tokens dans la complétion */
  completionTokens?: number;
  /** Temps d'exécution */
  executionTime?: string;
  /** Métadonnées associées */
  metadata?: Record<string, unknown>;
  /** Données structurées */
  data?: Record<string, unknown>;
  /** Nombres prédits */
  predictedNumbers?: number[];
  /** Profondeur d'analyse RAG */
  depth?: number;
}
/**
 * Type definitions for the Lotto-Sylvain UI application
 */

/**
 * Represents a lottery draw result
 */
export interface LottoDraw {
  drawDate: string;
  drawNumber: number;
  winningNumbers: number[];
  bonusNumber?: number;
}

export interface PreviousResultDetails {
  previousResultDate: string; // Date du tirage
  resultNumbers: number[]; // Numéros gagnants
  bonusNumber: number; // Numéro bonus
  message?: string; // Message d'erreur éventuel
}

/**
 * Structure alignée sur le backend PreviousResult
 */
export interface PreviousResult {
  previousResult: PreviousResultDetails[]; // Détails du tirage précédent
}

/**
 * Represents a prediction for a future lottery draw
 */
export interface PredictionData {
  numbers: number[];
  confidenceScore: number;
  reasoning: string;
  analysisFactors?: {
    frequencyAnalysis?: Record<string, number>;
    patternAnalysis?: Record<string, any>;
    historicalTrends?: any[];
  };
}

/**
 * Represents statistical data about lottery draws
 */
export interface DrawStatistics {
  mostFrequentNumbers: Record<number, number>;
  leastFrequentNumbers: Record<number, number>;
  numbersFrequency: Record<number, number>;
  numbersLastAppearance: Record<number, string>;
}

/**
 * Parameters for customized prediction requests
 */
export interface CustomPredictionParams {
  excludeNumbers?: number[];
  includeNumbers?: number[];
  weightHistorical?: number; // 0-100
}

export * from './lottoTemporalGraph';
