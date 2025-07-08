import React from 'react';
import PreviousResults from './components/PreviousResults';
import PredictionSection from './components/PredictionSection';
import ThemeToggle from './components/ui/ThemeToggle';
import { getNextDrawDate, formatDate } from './lib/utils';

const App: React.FC = () => {
  const nextDrawDate = getNextDrawDate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900 transition-colors duration-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 dark:text-gray-50">
      <header className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-800 dark:to-primary-700 text-white py-8 shadow-lg relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        
        <div className="container-2025 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">Lotto-Sylvain</h1>
              <p className="text-primary-100 text-lg">Prédictions intelligentes pour la Lotto 6/49</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-6 md:mt-0">
              <div className="glass px-6 py-4 rounded-2xl backdrop-blur-md">
                <p className="text-sm uppercase tracking-wider font-medium text-primary-100">Prochain tirage</p>
                <p className="text-2xl font-bold">{formatDate(nextDrawDate)}</p>
              </div>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container-2025 mx-auto py-12">
        <div className="space-y-12">
          <PreviousResults />
          <PredictionSection />
        </div>
      </main>
      
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
        <div className="container-2025 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-4 font-display">Lotto-Sylvain UI</h2>
              <p className="text-gray-400 max-w-md">
                Une interface moderne et intuitive pour explorer les prédictions Lotto 6/49 avec un design tendance 2025
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-1-4.8 4-7.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
              <p className="text-gray-500 text-sm">
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
