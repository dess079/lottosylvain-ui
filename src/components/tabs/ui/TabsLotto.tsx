import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './index';
import PreviousDrawTab from '../PreviousDrawTab';
import GraphTab from '../GraphTab';
import PredictionTab from '../PredictionTab';
import LineChartTab from '../LineChartTab';
import PieChartTab from '../PieChartTab';
import ScatterPlotTab from '../ScatterPlotTab';
import PredictionSection from '../../prediction/PredictionSection';
import AITab from '../AITab';
import './TabsLotto.css';

const TabsLotto: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'previous' | 'graph' | 'prediction' | 'section' | 'line' | 'pie' | 'scatter' | 'ai'>('prediction');
  const tabsListRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'previous' | 'graph' | 'prediction' | 'section' | 'line' | 'pie' | 'scatter' | 'ai');
  };

  return (
    <Tabs defaultValue="prediction" onValueChange={handleTabChange}>
      <TabsList className="flex">
        <div className="flex" id="tabs-container" ref={tabsListRef}>
          <TabsTrigger value="prediction" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Prédiction complète</TabsTrigger>
          <TabsTrigger value="previous" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Dernier tirage officiel</TabsTrigger>
          <TabsTrigger value="graph" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Graphique temporel</TabsTrigger>
          <TabsTrigger value="section" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Prédiction IA</TabsTrigger>
          <TabsTrigger value="line" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Graphique linéaire</TabsTrigger>
          <TabsTrigger value="pie" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Graphique en secteurs</TabsTrigger>
          <TabsTrigger value="scatter" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">Graphique de dispersion</TabsTrigger>
          <TabsTrigger value="ai" className="bar-tab-trigger min-w-[10rem] text-center whitespace-nowrap font-semibold transition-all duration-300">IA Lotto649</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="prediction" className="tabs-lotto-animation"><PredictionSection /></TabsContent>
      <TabsContent value="previous" className="container tabs-lotto-animation"><PreviousDrawTab isActive={activeTab === 'previous'} /></TabsContent>
      <TabsContent value="graph" className="tabs-lotto-animation"><GraphTab isActive={activeTab === 'graph'} /></TabsContent>
      <TabsContent value="section" className="tabs-lotto-animation"><PredictionTab isActive={activeTab === 'prediction'} /></TabsContent>
      <TabsContent value="line" className="tabs-lotto-animation"><LineChartTab isActive={activeTab === 'line'} /></TabsContent>
      <TabsContent value="pie" className="tabs-lotto-animation"><PieChartTab isActive={activeTab === 'pie'} /></TabsContent>
      <TabsContent value="scatter" className="tabs-lotto-animation"><ScatterPlotTab isActive={activeTab === 'scatter'} /></TabsContent>
      <TabsContent value="ai" className="tabs-lotto-animation"><AITab /></TabsContent>
    </Tabs>
  );
};

export default TabsLotto;
