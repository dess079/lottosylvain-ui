// Typescript types pour LottoTemporalGraphData et sous-structures
// Généré à partir des records Java fournis

export interface LottoTemporalGraphData {
  timelineData: TemporalDataPoint[];
  correlationMatrix: Record<string, number>;
  behaviorClusters: NumberCluster[];
  embeddings: NumberEmbedding[];
  metrics: GraphMetrics;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  generatedAt: string; // ISO date string
}

export interface TemporalDataPoint {
  number: number;
  date: string; // ISO date string
  frequency: number;
  normalizedFrequency: number;
  priorityScore: number;
  category: string;
  momentum: number;
  volatility: number;
}

export interface NumberCluster {
  clusterId: string;
  name: string;
  numbers: number[];
  color: string;
  description: string;
}

export interface NumberEmbedding {
  number: number;
  x: number;
  y: number;
  size_score: number;
  category: string;
  size_pixels: number;
  color: string;
}

export interface GraphMetrics {
  totalNumbers: number;
  averageFrequency: number;
  averagePriority: number;
  categoryDistribution: Record<string, number>;
  mostFrequentNumber: number;
  leastFrequentNumber: number;
  totalDataPoints: number;
}

/**
 * Interface représentant la réponse complète pour le graphique temporel.
 * Correspond au record Java TemporalGraphResponse.
 */
export interface TemporalGraphResponse {
  /** Succès de la génération */
  success: boolean;
  /** Message d'information ou d'erreur */
  message: string;
  /** Données du graphique temporel */
  graphData: LottoTemporalGraphData;
  /** Date de génération (ISO string) */
  generatedAt: string;
}
