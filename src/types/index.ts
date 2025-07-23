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
