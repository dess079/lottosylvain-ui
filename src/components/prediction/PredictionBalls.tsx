import React from 'react';
import { LottoBall } from '../shadcn';

/**
 * Affiche les boules de prédiction agrandies, animées et triées.
 * @param prediction Données de prédiction
 */
const PredictionBalls: React.FC<{ prediction: number[] | undefined }> = React.memo(({ prediction }) => (
  <div className="flex flex-wrap gap-8 justify-center my-8">
    {prediction?.map((number, index) => {
      return <LottoBall key={index} number={number} size="xl" />;
    })}
  </div>
));

export default PredictionBalls;
