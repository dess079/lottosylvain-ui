import React from 'react';
import { 
  FuturisticToolbar, 
  FuturisticDataDisplay, 
  FuturisticChart,
  LottoBall
} from './components/shadcn';
import { LineChartIcon, TrendingUpIcon, PercentIcon, BarChart3Icon } from 'lucide-react';

/**
 * Page principale démontrant l'interface futuriste 2026
 */
const App: React.FC = () => {
  // Données de démonstration pour les graphiques
  const frequencyData = [14, 23, 8, 17, 9, 31, 26, 19, 12, 7];
  const frequencyLabels = ['1', '7', '13', '19', '25', '31', '37', '43', '45', '49'];
  
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
            subtitle="Basée sur 749 tirages historiques"
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
            value="749"
            subtitle="Dernière mise à jour: aujourd'hui"
            icon={<BarChart3Icon size={18} />}
            variant="primary"
          />
        </section>
        
        {/* Graphiques futuristes */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="futuristic-card">
            <h2 className="text-xl font-bold mb-6 gradient-text">Fréquence des numéros</h2>
            <FuturisticChart 
              data={frequencyData} 
              labels={frequencyLabels}
              title="Top 10 des numéros les plus fréquents"
              variant="cosmic"
              width={500}
              height={300}
            />
          </div>
          
          <div className="futuristic-card">
            <h2 className="text-xl font-bold mb-6 accent-gradient-text">Prédictions générées</h2>
            
            {/* Grille de numéros avec boules 3D */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 opacity-70">Prédiction principale</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <LottoBall number={7} size="lg" isHighlighted />
                <LottoBall number={13} size="lg" isHighlighted />
                <LottoBall number={19} size="lg" isHighlighted />
                <LottoBall number={27} size="lg" isHighlighted />
                <LottoBall number={35} size="lg" isHighlighted />
                <LottoBall number={42} size="lg" isHighlighted />
                <LottoBall number={47} size="lg" isBonus isHighlighted />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3 opacity-70">Prédiction alternative 1</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <LottoBall number={3} size="md" />
                  <LottoBall number={14} size="md" />
                  <LottoBall number={23} size="md" />
                  <LottoBall number={31} size="md" />
                  <LottoBall number={38} size="md" />
                  <LottoBall number={45} size="md" />
                  <LottoBall number={11} size="md" isBonus />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3 opacity-70">Prédiction alternative 2</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  <LottoBall number={5} size="md" />
                  <LottoBall number={18} size="md" />
                  <LottoBall number={24} size="md" />
                  <LottoBall number={29} size="md" />
                  <LottoBall number={36} size="md" />
                  <LottoBall number={43} size="md" />
                  <LottoBall number={16} size="md" isBonus />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sélection personnalisée */}
        <section className="mb-16">
          <div className="futuristic-card">
            <h2 className="text-xl font-bold mb-6 gradient-text">Sélection personnalisée</h2>
            
            <div className="futuristic-number-grid">
              <LottoBall number={1} size="sm" />
              <LottoBall number={2} size="sm" />
              <LottoBall number={3} size="sm" />
              <LottoBall number={4} size="sm" />
              <LottoBall number={5} size="sm" />
              <LottoBall number={6} size="sm" />
              <LottoBall number={7} size="sm" isSelected />
              <LottoBall number={8} size="sm" />
              <LottoBall number={9} size="sm" />
              <LottoBall number={10} size="sm" />
              <LottoBall number={11} size="sm" isExcluded />
              <LottoBall number={12} size="sm" />
              <LottoBall number={13} size="sm" isSelected />
              <LottoBall number={14} size="sm" />
              <LottoBall number={15} size="sm" isExcluded />
              <LottoBall number={16} size="sm" />
              <LottoBall number={17} size="sm" />
              <LottoBall number={18} size="sm" />
              <LottoBall number={19} size="sm" isSelected />
              <LottoBall number={20} size="sm" />
              <LottoBall number={21} size="sm" />
              <LottoBall number={22} size="sm" isExcluded />
              <LottoBall number={23} size="sm" />
              <LottoBall number={24} size="sm" />
              <LottoBall number={25} size="sm" />
              <LottoBall number={26} size="sm" />
              <LottoBall number={27} size="sm" isSelected />
              <LottoBall number={28} size="sm" />
              <LottoBall number={29} size="sm" />
              <LottoBall number={30} size="sm" isExcluded />
              <LottoBall number={31} size="sm" />
              <LottoBall number={32} size="sm" />
              <LottoBall number={33} size="sm" />
              <LottoBall number={34} size="sm" />
              <LottoBall number={35} size="sm" isSelected />
              <LottoBall number={36} size="sm" />
              <LottoBall number={37} size="sm" />
              <LottoBall number={38} size="sm" />
              <LottoBall number={39} size="sm" />
              <LottoBall number={40} size="sm" />
              <LottoBall number={41} size="sm" />
              <LottoBall number={42} size="sm" isSelected />
              <LottoBall number={43} size="sm" />
              <LottoBall number={44} size="sm" />
              <LottoBall number={45} size="sm" />
              <LottoBall number={46} size="sm" />
              <LottoBall number={47} size="sm" isBonus isSelected />
              <LottoBall number={48} size="sm" />
              <LottoBall number={49} size="sm" />
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
