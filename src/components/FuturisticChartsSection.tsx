import React from 'react';
import { FuturisticChart, LottoBall } from './shadcn';
import type { PredictionData } from '../types';

/**
 * Affiche la section des graphiques futuristes et des prédictions alternatives.
 * @param isLoading Indique si les données sont en cours de chargement
 * @param frequencyData Données de fréquence pour le graphique
 * @param frequencyLabels Labels pour le graphique
 * @param predictions Liste des prédictions
 */
export const FuturisticChartsSection: React.FC<{
  isLoading: boolean;
  frequencyData: number[];
  frequencyLabels: string[];
  predictions: PredictionData[];
}> = ({ isLoading, frequencyData, frequencyLabels, predictions }) => (
  <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div className="futuristic-card">
      <h2 className="text-xl font-bold mb-6 gradient-text">Fréquence des numéros</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      ) : (
        <FuturisticChart 
          data={frequencyData} 
          labels={frequencyLabels}
          title="Top 10 des numéros les plus fréquents"
          variant="cosmic"
          width={500}
          height={300}
        />
      )}
    </div>
    <div className="futuristic-card">
      <h2 className="text-xl font-bold mb-6 accent-gradient-text">Prédictions Alternatives</h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-cosmic-violet-500 border-opacity-50 rounded-full border-t-transparent"></div>
        </div>
      ) : predictions.length <= 1 ? (
        <div className="text-center py-10">
          <p className="text-lg opacity-80">Aucune prédiction alternative disponible</p>
          <p className="text-sm opacity-60 mt-2">Le service de prédictions n'est pas disponible actuellement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map((altIdx) => (
            <div key={`alt-prediction-${altIdx}`} className="bg-green-500/5 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-5 opacity-80">Prédiction alternative {altIdx}</h3>
              <div className="flex items-center fade-in-scale">
                <div className="flex items-center overflow-x-auto pb-4 w-full">
                  {predictions.length > altIdx ? (
                    <>
                      <div className="flex gap-10">
                        {predictions[altIdx].numbers.slice(0, 6).map((number, index) => (
                          <div key={`alt${altIdx}-prediction-${index}`} className="flex-shrink-0">
                            <LottoBall number={number} size="md" type="prediction" className="flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                      <div className="mx-8 h-12 w-px bg-green-500/20"></div>
                      {predictions[altIdx].numbers.length > 6 && (
                        <div className="flex-shrink-0">
                          <LottoBall 
                            number={predictions[altIdx].numbers[6]} 
                            size="md" 
                            isBonus 
                            type="bonus" 
                            className="flex-shrink-0" 
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex gap-10">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={`alt${altIdx}-prediction-loading-${index}`} className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                          </div>
                        ))}
                      </div>
                      <div className="mx-8 h-12 w-px bg-green-500/20"></div>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);
