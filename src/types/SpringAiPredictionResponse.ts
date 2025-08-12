export interface SpringAiPredictionResponse {
  raw: string; // Raw AI output for debugging
  timestamp: string;
  nextDrawDate: string;

  think: string; // Markdown
  content: string; // Markdown

  strategy: string;
  description: string;
  confidenceScore: number;

  // Champs additionnels pour compatibilité avec la nouvelle structure
  predictedNumbers?: number[];
  reasoning?: string;
  justification?: string;
  analysisDepth?: number;
  modelVersion?: string;
  dataPointsAnalyzed?: number;
  metadataExtra?: Record<string, unknown>;

  // Métadonnées principales
  metadata: Record<string, unknown> | {
    totalDraws?: number;
    globalScore?: number;
    notes?: string;
    [key: string]: unknown;
  };
}
