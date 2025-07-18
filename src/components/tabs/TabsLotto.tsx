import React, { useState, useRef, useEffect } from 'react';
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
  const tabsListRef = useRef<HTMLDivElement>(null);

  /**
   * Gère le changement d'onglet et met à jour l'état actif
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'previous' | 'graph' | 'prediction' | 'line' | 'pie' | 'scatter');
  };

  return (
    <div className="flex w-full max-w-6xl p-32">
    <Tabs defaultValue="previous" onValueChange={handleTabChange}>
      <TabsList className="flex">
      
        <div className="flex" id="tabs-container" ref={tabsListRef}>
          <TabsTrigger 
            value="previous" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Dernier tirage officiel
          </TabsTrigger>
          <TabsTrigger 
            value="graph" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique temporel
          </TabsTrigger>
          <TabsTrigger 
            value="prediction" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Prédiction IA
          </TabsTrigger>
          <TabsTrigger 
            value="line" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique linéaire
          </TabsTrigger>
          <TabsTrigger 
            value="pie" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique en secteurs
          </TabsTrigger>
          <TabsTrigger 
            value="scatter" 
            className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300"
          >
            Graphique de dispersion
          </TabsTrigger>
        </div>

      </TabsList>

      {/* Tabs content */}
      <TabsContent value="previous" className="mt-16 tabs-lotto-animation">
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
   </div>
  );
};

export default TabsLotto;
