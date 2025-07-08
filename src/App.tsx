import React from 'react';
import PreviousResults from './components/PreviousResults';
import PredictionSection from './components/PredictionSection';
import { getNextDrawDate, formatDate } from './lib/utils';

const App: React.FC = () => {
  const nextDrawDate = getNextDrawDate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-primary-500 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">Lotto-Sylvain</h1>
              <p className="text-primary-100">Prédictions intelligentes pour la Lotto 6/49</p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm">Prochain tirage:</p>
              <p className="text-xl font-bold">{formatDate(nextDrawDate)}</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <PreviousResults />
          <PredictionSection />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Lotto-Sylvain UI</h2>
              <p className="text-gray-400">
                Une interface moderne et intuitive pour explorer les prédictions Lotto 6/49
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Lotto-Sylvain. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
