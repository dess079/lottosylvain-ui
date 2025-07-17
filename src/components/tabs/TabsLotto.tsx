import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shadcn';
import PreviousDrawTab from './PreviousDrawTab';
import GraphTab from './GraphTab';
import PredictionTab from './PredictionTab';
import LineChartTab from './LineChartTab';
import PieChartTab from './PieChartTab';
import ScatterPlotTab from './ScatterPlotTab';
import './TabsLotto.css';

/**
 * Composant d'onglets pour Lotto 649 avec chargement paresseux
 * Gère l'état des onglets et la transmission des props aux composants enfants
 */
const TabsLotto: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'previous' | 'graph' | 'prediction' | 'line' | 'pie' | 'scatter'>('previous');

  /**
   * Gère le changement d'onglet et met à jour l'état actif
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'previous' | 'graph' | 'prediction' | 'line' | 'pie' | 'scatter');
  };

  return (
      <Tabs defaultValue="previous" onValueChange={handleTabChange} className="w-full" style={{ paddingTop: '0px' }}>
        <TabsList className="flex w-full justify-between bg-muted/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50">
          <button className="p-2" aria-label="Scroll Left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex w-full space-x-4">
            <TabsTrigger 
              value="previous" 
              className="flex-1 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
            >
              Dernier tirage officiel
            </TabsTrigger>
            <TabsTrigger 
              value="graph" 
              className="flex-1 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
            >
              Graphique temporel
            </TabsTrigger>
            <TabsTrigger 
              value="prediction" 
              className="flex-1 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
            >
              Prédiction IA
            </TabsTrigger>
            <TabsTrigger 
              value="line" 
              className="flex-1 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
            >
              Graphique linéaire
            </TabsTrigger>
            <TabsTrigger 
              value="pie" 
              className="flex-1 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
            >
              Graphique en secteurs
            </TabsTrigger>
            <TabsTrigger 
              value="scatter" 
              className="flex-1 text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-lime-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 data-[state=inactive]:bg-background/60 data-[state=inactive]:text-muted-foreground data-[state=inactive]:border data-[state=inactive]:border-border/30 rounded-xl font-semibold transition-all duration-300 hover:bg-muted hover:text-foreground"
            >
              Graphique de dispersion
            </TabsTrigger>
          </div>
          <button className="p-2" aria-label="Scroll Right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </TabsList>

        <TabsContent value="previous" className="mt-8 tabs-lotto-animation">
          <PreviousDrawTab isActive={activeTab === 'previous'} />
        </TabsContent>

        <TabsContent value="graph" className="mt-8 tabs-lotto-animation">
          <GraphTab isActive={activeTab === 'graph'} />
        </TabsContent>

        <TabsContent value="prediction" className="mt-8 tabs-lotto-animation">
          <PredictionTab isActive={activeTab === 'prediction'} />
        </TabsContent>

        <TabsContent value="line" className="mt-8 tabs-lotto-animation">
          <LineChartTab isActive={activeTab === 'line'} />
        </TabsContent>

        <TabsContent value="pie" className="mt-8 tabs-lotto-animation">
          <PieChartTab isActive={activeTab === 'pie'} />
        </TabsContent>

        <TabsContent value="scatter" className="mt-8 tabs-lotto-animation">
          <ScatterPlotTab isActive={activeTab === 'scatter'} />
        </TabsContent>

      </Tabs>
  );
};

export default TabsLotto;
