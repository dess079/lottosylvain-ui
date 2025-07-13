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

export interface PreviousResult {
  previousResultDate: string; // Date du tirage, parsed using date-fns
  drawResult: number[]; // Numéros gagnants
  bonusNumber: number;
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
