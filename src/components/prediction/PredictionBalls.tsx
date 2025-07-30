import React from 'react';
import { motion } from 'framer-motion';
import { LottoBall } from '../shadcn';
import type { PredictionData } from '../../types';

/**
 * Affiche les boules de prédiction, animées et triées.
 * @param prediction Données de prédiction
 */
const PredictionBalls: React.FC<{ prediction: PredictionData }> = React.memo(({ prediction }) => (
  <div className="flex flex-wrap gap-6 justify-center my-6">
    {prediction.numbers.map((number, index) => (
        <LottoBall number={number} />
    ))}
  </div>
));

export default PredictionBalls;
