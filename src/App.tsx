import React, { useState, useEffect } from 'react';
import { 
  FuturisticToolbar, 
  FuturisticDataDisplay, 
  FuturisticChart,
  LottoBall
} from './components/shadcn';
import { LineChartIcon, TrendingUpIcon, PercentIcon, BarChart3Icon } from 'lucide-react';
import { fetchDrawCount, fetchLottoStatistics, fetchPredictions } from './services/api';
import type { DrawStatistics, PredictionData } from './types';

/**
 * Page principale démontrant l'interface futuriste 2026
 */
const App: React.FC = () => {
  // State pour stocker le nombre total de tirages et les statistiques
  const [totalDraws, setTotalDraws] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<DrawStatistics | null>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [frequencyLabels, setFrequencyLabels] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  
  // Récupérer les données au chargement du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer le nombre total de tirages
        console.log('Fetching draw count...');
        const count = await fetchDrawCount();
        console.log('Draw count fetched:', count);
        setTotalDraws(count);
        
        // Récupérer les statistiques de lotto
        console.log('Fetching statistics...');
        const stats = await fetchLottoStatistics();
        console.log('Statistics fetched:', stats);
        setStatistics(stats);
        
        // Récupérer les prédictions
        console.log('Fetching predictions...');
        const predictionData = await fetchPredictions();
        console.log('Predictions fetched:', predictionData);
        setPredictions(predictionData);
        
        // Préparer les données pour le graphique de fréquence
        if (stats && stats.numbersFrequency) {
          // Trier les numéros par fréquence (du plus fréquent au moins fréquent)
          const sortedNumbers = Object.entries(stats.numbersFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Prendre les 10 plus fréquents
          
          const labels = sortedNumbers.map(([num]) => num);
          const values = sortedNumbers.map(([_, freq]) => freq);
          
          setFrequencyLabels(labels);
          setFrequencyData(values);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Barre d'outils futuriste */}
      <FuturisticToolbar />
      
      <main className="container-2025 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Prédiction Lotto 649</h1>
          <p className="text-lg opacity-70">Analyse des tendances et prévisions pour le prochain tirage</p>
        </div>
        
        {/* Cartes de statistiques */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FuturisticDataDisplay 
            title="Fréquence moyenne"
            value="26.4%"
            subtitle="Augmentation de 3.1% cette semaine"
            trend="up"
            trendValue="3.1%"
            icon={<PercentIcon size={18} />}
            variant="primary"
          />
          
          <FuturisticDataDisplay 
            title="Confiance prédictive"
            value="87.2%"
            subtitle={isLoading ? "Chargement des données..." : `Basée sur ${totalDraws} tirages historiques`}
            trend="up"
            trendValue="2.5%"
            icon={<TrendingUpIcon size={18} />}
            variant="secondary"
          />
          
          <FuturisticDataDisplay 
            title="Précision modèle"
            value="93.5%"
            subtitle="Derniers 12 tirages"
            trend="up"
            trendValue="1.2%"
            icon={<LineChartIcon size={18} />}
            variant="accent"
          />
          
          <FuturisticDataDisplay 
            title="Tirages analysés"
            value={isLoading ? "..." : totalDraws.toString()}
            subtitle="Dernière mise à jour: aujourd'hui"
            icon={<BarChart3Icon size={18} />}
            variant="primary"
          />
        </section>
        
        {/* Graphiques futuristes */}
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
            <h2 className="text-xl font-bold mb-6 accent-gradient-text">Prédictions générées</h2>
            
            {/* Grille de numéros avec boules 3D */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 opacity-70">Prédiction principale</h3>
              <div className="flex flex-col items-center gap-10">
                {/* 6 numéros principaux - Disposition horizontale sur une seule ligne avec défilement si nécessaire */}
                <div className="flex items-center space-x-14 overflow-x-auto pb-4 w-full justify-center">
                  {!isLoading && predictions.length > 0 ? (
                    // Afficher les numéros de la première prédiction (principale)
                    predictions[0].numbers.slice(0, 6).map((number, index) => (
                      <div key={`main-prediction-${index}`} className="flex flex-col items-center flex-shrink-0">
                        <LottoBall number={number} size="lg" isHighlighted animated type="prediction" className="flex-shrink-0" />
                        <span className="text-xs mt-3 opacity-70">{index + 1}</span>
                      </div>
                    ))
                  ) : (
                    // Afficher un placeholder pendant le chargement
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={`main-prediction-loading-${index}`} className="flex flex-col items-center flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                        <span className="text-xs mt-3 opacity-70">{index + 1}</span>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Numéro complémentaire en dessous */}
                <div className="flex flex-col items-center mt-5">
                  {!isLoading && predictions.length > 0 && predictions[0].numbers.length > 6 ? (
                    <LottoBall 
                      number={predictions[0].numbers[6]} 
                      size="lg" 
                      isBonus 
                      isHighlighted 
                      animated 
                      type="bonus" 
                      className="flex-shrink-0" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                  )}
                </div>
                
                {/* Légende */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-b from-electric-aqua via-electric-aqua-700 to-electric-aqua-900"></div>
                    <span className="text-xs">Numéros réguliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-b from-neon-coral via-neon-coral-700 to-neon-coral-900"></div>
                    <span className="text-xs">Complémentaire</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-sm font-medium mb-5 opacity-70">Prédiction alternative 1</h3>
                <div className="flex flex-col items-center gap-8">
                  {/* 6 numéros principaux - Disposition horizontale avec défilement */}
                  <div className="flex items-center space-x-10 overflow-x-auto pb-4 w-full justify-center">
                    {!isLoading && predictions.length > 1 ? (
                      // Afficher les numéros de la deuxième prédiction (alternative 1)
                      predictions[1].numbers.slice(0, 6).map((number, index) => (
                        <div key={`alt1-prediction-${index}`} className="flex flex-col items-center flex-shrink-0">
                          <LottoBall number={number} size="md" type="prediction" className="flex-shrink-0" />
                          <span className="text-xs mt-3 opacity-70">{index + 1}</span>
                        </div>
                      ))
                    ) : (
                      // Afficher un placeholder pendant le chargement
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={`alt1-prediction-loading-${index}`} className="flex flex-col items-center flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                          <span className="text-xs mt-3 opacity-70">{index + 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Numéro complémentaire en dessous */}
                  <div className="flex flex-col items-center mt-4">
                    {!isLoading && predictions.length > 1 && predictions[1].numbers.length > 6 ? (
                      <LottoBall 
                        number={predictions[1].numbers[6]} 
                        size="md" 
                        isBonus 
                        type="bonus" 
                        className="flex-shrink-0" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-5 opacity-70">Prédiction alternative 2</h3>
                <div className="flex flex-col items-center gap-8">
                  {/* 6 numéros principaux - Disposition horizontale avec défilement */}
                  <div className="flex items-center space-x-10 overflow-x-auto pb-4 w-full justify-center">
                    {!isLoading && predictions.length > 2 ? (
                      // Afficher les numéros de la troisième prédiction (alternative 2)
                      predictions[2].numbers.slice(0, 6).map((number, index) => (
                        <div key={`alt2-prediction-${index}`} className="flex flex-col items-center flex-shrink-0">
                          <LottoBall number={number} size="md" type="prediction" className="flex-shrink-0" />
                          <span className="text-xs mt-3 opacity-70">{index + 1}</span>
                        </div>
                      ))
                    ) : (
                      // Afficher un placeholder pendant le chargement
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={`alt2-prediction-loading-${index}`} className="flex flex-col items-center flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                          <span className="text-xs mt-3 opacity-70">{index + 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Numéro complémentaire en dessous */}
                  <div className="flex flex-col items-center mt-4">
                    {!isLoading && predictions.length > 2 && predictions[2].numbers.length > 6 ? (
                      <LottoBall 
                        number={predictions[2].numbers[6]} 
                        size="md" 
                        isBonus 
                        type="bonus" 
                        className="flex-shrink-0" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-background/20 animate-pulse flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sélection personnalisée */}
        <section className="mb-16">
          <div className="futuristic-card">
            <h2 className="text-xl font-bold mb-6 gradient-text">Sélection personnalisée</h2>
            
            {/* Explication des codes couleurs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-center text-xs opacity-70">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-cosmic-violet via-cosmic-violet-700 to-cosmic-violet-900"></div>
                <span>Numéros réguliers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-neon-coral via-neon-coral-700 to-neon-coral-900"></div>
                <span>Complémentaire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-400"></div>
                </div>
                <span>Sélectionnés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-400"></div>
                </div>
                <span>Exclus</span>
              </div>
            </div>
            
            <div className="futuristic-number-grid mx-auto overflow-x-auto overflow-y-hidden pb-4">
              <LottoBall number={1} size="sm" className="flex-shrink-0" />
              <LottoBall number={2} size="sm" className="flex-shrink-0" />
              <LottoBall number={3} size="sm" className="flex-shrink-0" />
              <LottoBall number={4} size="sm" className="flex-shrink-0" />
              <LottoBall number={5} size="sm" className="flex-shrink-0" />
              <LottoBall number={6} size="sm" className="flex-shrink-0" />
              <LottoBall number={7} size="sm" isSelected animated className="flex-shrink-0" />
              <LottoBall number={8} size="sm" className="flex-shrink-0" />
              <LottoBall number={9} size="sm" className="flex-shrink-0" />
              <LottoBall number={10} size="sm" className="flex-shrink-0" />
              <LottoBall number={11} size="sm" isExcluded animated className="flex-shrink-0" />
              <LottoBall number={12} size="sm" className="flex-shrink-0" />
              <LottoBall number={13} size="sm" isSelected animated className="flex-shrink-0" />
              <LottoBall number={14} size="sm" className="flex-shrink-0" />
              <LottoBall number={15} size="sm" isExcluded animated className="flex-shrink-0" />
              <LottoBall number={16} size="sm" className="flex-shrink-0" />
              <LottoBall number={17} size="sm" className="flex-shrink-0" />
              <LottoBall number={18} size="sm" className="flex-shrink-0" />
              <LottoBall number={19} size="sm" isSelected animated className="flex-shrink-0" />
              <LottoBall number={20} size="sm" className="flex-shrink-0" />
              <LottoBall number={21} size="sm" className="flex-shrink-0" />
              <LottoBall number={22} size="sm" isExcluded animated className="flex-shrink-0" />
              <LottoBall number={23} size="sm" className="flex-shrink-0" />
              <LottoBall number={24} size="sm" className="flex-shrink-0" />
              <LottoBall number={25} size="sm" className="flex-shrink-0" />
              <LottoBall number={26} size="sm" className="flex-shrink-0" />
              <LottoBall number={27} size="sm" isSelected animated className="flex-shrink-0" />
              <LottoBall number={28} size="sm" className="flex-shrink-0" />
              <LottoBall number={29} size="sm" className="flex-shrink-0" />
              <LottoBall number={30} size="sm" isExcluded animated className="flex-shrink-0" />
              <LottoBall number={31} size="sm" className="flex-shrink-0" />
              <LottoBall number={32} size="sm" className="flex-shrink-0" />
              <LottoBall number={33} size="sm" className="flex-shrink-0" />
              <LottoBall number={34} size="sm" className="flex-shrink-0" />
              <LottoBall number={35} size="sm" isSelected animated className="flex-shrink-0" />
              <LottoBall number={36} size="sm" className="flex-shrink-0" />
              <LottoBall number={37} size="sm" className="flex-shrink-0" />
              <LottoBall number={38} size="sm" className="flex-shrink-0" />
              <LottoBall number={39} size="sm" className="flex-shrink-0" />
              <LottoBall number={40} size="sm" className="flex-shrink-0" />
              <LottoBall number={41} size="sm" className="flex-shrink-0" />
              <LottoBall number={42} size="sm" isSelected animated className="flex-shrink-0" />
              <LottoBall number={43} size="sm" className="flex-shrink-0" />
              <LottoBall number={44} size="sm" className="flex-shrink-0" />
              <LottoBall number={45} size="sm" className="flex-shrink-0" />
              <LottoBall number={46} size="sm" className="flex-shrink-0" />
              <LottoBall number={47} size="sm" isBonus isSelected animated className="flex-shrink-0" />
              <LottoBall number={48} size="sm" className="flex-shrink-0" />
              <LottoBall number={49} size="sm" className="flex-shrink-0" />
            </div>
          </div>
        </section>
      </main>
      
      <footer className="container-2025 py-6 border-t border-border/20">
        <div className="text-center text-sm opacity-60">
          © 2026 Lotto Sylvain - Visualisation futuriste des données de loterie
        </div>
      </footer>
    </div>
  );
};

export default App;
