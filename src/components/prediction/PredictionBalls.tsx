import React from 'react';
import { motion } from 'framer-motion';
import { LottoBall } from '../shadcn';
import type { PredictionData } from '../../types';

/**
 * Affiche les boules de prédiction, animées et triées.
 * @param prediction Données de prédiction
 */
const PredictionBalls: React.FC<{ prediction: PredictionData }> = React.memo(({ prediction }) => (
  <div className="flex flex-wrap gap-3 justify-center my-6">
    {prediction.numbers.map((number, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: index * 0.15,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="filter drop-shadow-lg"
      >
        <LottoBall number={number} animated={true} />
      </motion.div>
    ))}
  </div>
));

export default PredictionBalls;
