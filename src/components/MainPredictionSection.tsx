import React from 'react';
import { LottoBall } from './shadcn';
import type { PredictionData } from '../types';

/**
 * Affiche la prédiction principale avec les numéros et la barre de confiance.
 * @param predictions Liste des prédictions
 * @param isLoading Indique si les données sont en cours de chargement
 */
export const MainPredictionSection: React.FC<{
  predictions: PredictionData[];
  isLoading: boolean;
}> = ({ predictions, isLoading }) => (
  <section className="mb-16 relative">
    <div className="absolute inset-0 bg-green-500/5 rounded-xl blur-xl -z-10"></div>
    <div className="futuristic-card border-2 border-green-500/30 shadow-xl shadow-green-500/20 relative z-10">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/0 via-green-500/50 to-green-500/0"></div>
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ background: 'linear-gradient(to right, #4ade80, #22c55e)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Prédiction Principale</h2>
      <div className="flex flex-col items-center">
        <div className="flex items-center overflow-x-auto pb-4 w-full justify-center">
          {!isLoading && predictions.length > 0 ? (
            <>
              <div className="flex gap-12">
                {predictions[0].numbers.slice(0, 6).map((number, index) => (
                  <div key={`main-prediction-${index}`} className="flex-shrink-0">
                    <LottoBall number={number} size="lg" isHighlighted animated type="prediction" className="flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mx-12 h-20 w-px bg-green-500/20"></div>
              {predictions[0].numbers.length > 6 && (
                <div className="flex-shrink-0 relative">
                  <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-xl -z-10"></div>
                  <LottoBall 
                    number={predictions[0].numbers[6]} 
                    size="lg" 
                    isBonus 
                    isHighlighted 
                    animated 
                    type="bonus" 
                    className="flex-shrink-0" 
                  />
                </div>
              )}
            </>
          ) : isLoading ? (
            <>
              <div className="flex gap-12">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`main-prediction-loading-${index}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                  </div>
                ))}
              </div>
              <div className="mx-12 h-20 w-px bg-green-500/20"></div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center w-full">
              <p className="text-lg opacity-80">Aucune prédiction disponible</p>
              <p className="text-sm opacity-60 mt-2">Le service de prédictions n'est pas disponible actuellement.</p>
            </div>
          )}
        </div>
        <div className="w-full max-w-md mx-auto mt-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Confiance</span>
            <span className="text-sm font-bold">
              {!isLoading && predictions.length > 0 ? 
                `${predictions[0].confidenceScore}%` : '...'}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-700/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full transition-all duration-1000" 
              style={{ width: !isLoading && predictions.length > 0 ? `${predictions[0].confidenceScore}%` : '0%' }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #4ade80, #22c55e 45%, #15803d)' }}></div>
            <span className="text-xs">Numéros réguliers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #f87171, #ef4444 45%, #b91c1c)' }}></div>
            <span className="text-xs">Complémentaire</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
