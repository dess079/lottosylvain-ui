// Interface adaptée à la réponse Java FrontendRecommendationsResponse

export interface Pattern {
  numbers: number[];
  confidenceScore: number;
  reasoning?: string;
  strategy?: string;
}
export interface Pattern {
  pattern: Pattern;
  drawDate?: string; // Date du tirage au format ISO ou YYYY-MM-DD
}

export interface FrontendRecommendation {
  pattern: Pattern;
  
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
  recommendations: FrontendRecommendation;
  metaAnalysis: MetaAnalysis;
}
