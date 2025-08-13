/**
 * Structure de la réponse IA pour un tirage.
 * - think: raisonnement libre (markdown)
 * - prediction: contenu parsé du bloc <content>
 * - metadataExtra: paires clé:valeur du bloc <metadata>
 */
export interface LottoAIResponse {
  think: string;
  reponse: string;
  lottoPrediction: LottoPrediction;
  metadataExtra: Record<string, string>;
}

/**
 * Structure d'une prédiction IA (à adapter selon le backend)
 */
export interface LottoPrediction {
  predictedNumbers: number[];
  detailAnalysis?: string;
  confidenceScore?: number;
  justification?: string;
  analysisDepth?: number;
  modelVersion?: string;
  dataPointsAnalyzed?: number;
  metadata?: Record<string, any>;
  [key: string]: any; // Pour permettre l'extension future
}
