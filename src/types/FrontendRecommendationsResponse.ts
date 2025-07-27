// Interface adaptée à la réponse Java FrontendRecommendationsResponse
export interface FrontendRecommendation {
  numbers: number[];
  confidenceScore: number;
  reasoning?: string;
  justification?: string;
  /** Date du tirage (format ISO ou YYYY-MM-DD) */
  drawDate?: string;
  analysisFactors?: {
    frequencyAnalysis?: Record<string, number>;
    patternAnalysis?: Record<string, any>;
    historicalTrends?: any[];
  };
}

export interface MetaAnalysis {
  [key: string]: any;
}

export interface FrontendRecommendationsResponse {
  timestamp: string;
  nextDrawDate: string;
  recommendations: Record<string, FrontendRecommendation>;
  metaAnalysis: MetaAnalysis;
}
