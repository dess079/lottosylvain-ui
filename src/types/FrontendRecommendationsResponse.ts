// Legacy types kept for backward compatibility with older endpoints
export interface LegacyPattern {
  numbers: number[];
  confidenceScore: number;
  reasoning?: string;
  strategy?: string;
}

export interface LegacyFrontendRecommendation {
  pattern: LegacyPattern;
  drawDate?: string;
  analysisFactors?: {
    frequencyAnalysis?: Record<string, number>;
    patternAnalysis?: Record<string, any>;
    historicalTrends?: any[];
  };
}

export interface LegacyMetaAnalysis {
  [key: string]: any;
}

export interface FrontendRecommendationsResponse {
  timestamp: string;
  nextDrawDate: string;
  recommendations: Record<string, any> | LegacyFrontendRecommendation;
  metaAnalysis: LegacyMetaAnalysis;
}
