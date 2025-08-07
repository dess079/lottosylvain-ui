import React from 'react';
import type { PredictionData } from '../../types';
import { LottoBall } from '../shadcn';

/**
 * Affiche les boules de prédiction, animées et triées.
 * @param prediction Données de prédiction
 */
const PredictionBalls: React.FC<{ prediction: PredictionData }> = React.memo(({ prediction }) => (
  <div className="flex flex-wrap gap-6 justify-center my-6">
    {prediction.numbers.map((number, index) => (
        <LottoBall key={index} number={number} />
    ))}
  </div>
));

export default PredictionBalls;
