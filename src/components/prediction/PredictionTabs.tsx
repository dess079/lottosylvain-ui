import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Button } from '../shadcn';
import { Loader2 } from 'lucide-react';
import ErrorMessage from './ErrorMessage';
import { LottoBall } from '../shadcn';
import ConfidenceBar from './ConfidenceBar';
import NumberGrid from './NumberGrid';
import { LOTTO_CONFIG } from '../../config';
import type { PredictionData } from '../../types';

import AnalysisMarkdownBox from '../AnalysisMarkdownBox';

interface PredictionTabsProps {
  predictions: PredictionData[];
  customPredictions: PredictionData[];
  isLoading: boolean;
  isCustomLoading: boolean;
  error: string | null;
  selectedNumbers: number[];
  excludedNumbers: number[];
  historicalWeight: number;
  loadPredictions: () => void;
  loadCustomPredictions: () => void;
  toggleNumberSelection: (number: number) => void;
  toggleNumberExclusion: (number: number) => void;
  setHistoricalWeight: (weight: number) => void;
}

/**
 * PredictionTabs
 * Affiche les onglets de prédictions standard et personnalisées.
 * Sépare la logique d'affichage des prédictions du composant principal.
 */
const PredictionTabs: React.FC<PredictionTabsProps> = ({
  predictions,
  customPredictions,
  isLoading,
  isCustomLoading,
  error,
  selectedNumbers,
  excludedNumbers,
  historicalWeight,
  loadPredictions,
  loadCustomPredictions,
  toggleNumberSelection,
  toggleNumberExclusion,
  setHistoricalWeight,
}) => (
  <Tabs defaultValue="standard" className="w-full">
    <TabsList className="flex w-full gap-2 mb-8">
      <TabsTrigger
        value="standard"
        className="flex-1 px-8 py-4 font-bold text-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-white transition-colors"
      >
        Prédictions standard
      </TabsTrigger>
      <TabsTrigger
        value="custom"
        className="flex-1 px-8 py-4 font-bold text-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 transition-colors"
      >
        Prédictions personnalisées
      </TabsTrigger>
    </TabsList>

    <TabsContent value="standard">
      <h3 className="text-xl font-semibold mb-8 text-center">
        Prédictions standard
      </h3>
      <div className="w-full">
        <div className="flex justify-center mb-10">
          <Button
            onClick={loadPredictions}
            disabled={isLoading}
            size="lg"
            className="relative px-12 py-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <span>Générer des prédictions</span>
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </>
            )}
          </Button>
        </div>

        <ErrorMessage error={error} />

        {!isLoading && predictions.length > 0 && (
          <div>
            {predictions.map((prediction, index) => (
              <div
                key={index}
                className="flex flex-col animate-fade-in-scale"
              >
                <h3 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">
                  Combinaison #{index + 1}
                </h3>
                {/* Affichage direct des boules via LottoBall */}
                <div className="flex flex-wrap gap-6 justify-center my-6">
                  {prediction.numbers.map((number, ballIdx) => (
                    <LottoBall key={ballIdx} number={number} />
                  ))}
                </div>
                <ConfidenceBar score={prediction.confidenceScore} />
                <AnalysisMarkdownBox title="Analyse:" markdown={prediction.reasoning} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !predictions.length && !error && (
          <p>
            Cliquez sur le bouton ci-dessus pour générer des prédictions.
          </p>
        )}
      </div>
    </TabsContent>

    <TabsContent value="custom">
      <h3 className="text-xl font-semibold mb-8 text-primary-600 dark:text-primary-400 text-center">
        Prédictions personnalisées
      </h3>
      <div className="w-full">
        <div className="mb-12 p-12 sm:p-16rounded-2xl shadow-inner border-2analysis-box">
          <h3 className="text-xl font-bold mb-10">Personnalisez vos prédictions</h3>
          <div className="mb-8">
            <label className="block text-base font-medium">
              Sélectionnez des numéros à inclure (clic gauche) ou exclure (clic droit):
            </label>
            <NumberGrid
              selectedNumbers={selectedNumbers}
              excludedNumbers={excludedNumbers}
              onSelect={toggleNumberSelection}
              onExclude={toggleNumberExclusion}
              minNumber={LOTTO_CONFIG.MIN_NUMBER}
              maxNumber={LOTTO_CONFIG.MAX_NUMBER}
            />
          </div>
          <div className="mb-10">
            <label className="block text-base font-medium mb-4">
              Importance des données historiques:{' '}
              <span className="font-bold text-primary-600 dark:text-primary-400">{historicalWeight}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={historicalWeight}
              onChange={(e) => setHistoricalWeight(Number(e.target.value))}
              className="w-full h-3  rounded-lg appearance-none cursor-pointer accent-primary-500 shadow-inner confidence-bar"
            />
            <div className="flex justify-between text-sm0 mt-3">
              <span>Aléatoire</span>
              <span>Équilibré</span>
              <span>Historique</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={loadCustomPredictions}
              disabled={isCustomLoading}
              variant="secondary"
              size="lg"
              className="relative px-12 py-8 text-lg font-bold shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-r from-primary-600 to-primary-700"
            >
              {isCustomLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <span>Générer des prédictions personnalisées</span>
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </>
              )}
            </Button>
          </div>
        </div>
        <ErrorMessage error={error} />
        {!isCustomLoading && customPredictions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customPredictions.map((prediction, index) => (
              <div
                key={index}
                className="p-10 border-2 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:translate-y-[-5px] relative overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-[''] dark:before:from-gray-800/10 dark:before:to-transparent"
              >
                <h3 className="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">
                  Combinaison personnalisée #{index + 1}
                </h3>
                {/* Affichage direct des boules via LottoBall */}
                <div className="flex flex-wrap gap-6 justify-center my-6">
                  {prediction.numbers.map((number, ballIdx) => (
                    <LottoBall key={ballIdx} number={number} />
                  ))}
                </div>
                <ConfidenceBar score={prediction.confidenceScore} />
                <div className="mt-6 text-smp-6 rounded-lg border">
                  <h4 className="font-bold text-base mb-3">Analyse:</h4>
                  <p className="leading-relaxed">{prediction.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isCustomLoading && !customPredictions.length && !error && (
          <p className="text-center">
            Cliquez sur le bouton ci-dessus pour générer des prédictions personnalisées.
          </p>
        )}
      </div>
    </TabsContent>
  </Tabs>
);

export default PredictionTabs;
