// Types pour module Prédictions AI
export interface AiPredictionListItem {
  id: number;
  dateHeurePrediction: string; // ISO
  dateTirageCible: string; // YYYY-MM-DD
  numbers: number[]; // ordre original
  modelName: string;
  confidencePercentage?: number; // 0-100
  drawResult: number[]; // Résultat du tirage pour la dateTirageCible
  drawNumber?: number; // Numéro du tirage
}

export interface AiPredictionPageResponse {
  content: AiPredictionListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AiPredictionDetail extends AiPredictionListItem {
  sortedNumbers: number[];
  thinkText: string;
  detailedAnalysis: string;
  recCreateDateTime?: string;
  recCreateUserId?: string;
  recUpdateDateTime?: string;
  recUpdateUserId?: string;
}

export interface AiPredictionFilters {
  datePredictionFrom?: string; // ISO LocalDateTime
  datePredictionTo?: string;
  dateTirageFrom?: string; // YYYY-MM-DD
  dateTirageTo?: string;
  modelCsv?: string; // model1,model2
  page?: number;
  size?: number;
  sort?: string; // champ:dir,champ2:dir
}
