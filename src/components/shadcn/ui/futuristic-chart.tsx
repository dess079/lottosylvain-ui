import React, { useRef, useEffect } from 'react';

interface FuturisticChartProps {
  data: number[];
  labels?: string[];
  title?: string;
  height?: number;
  width?: number;
  variant?: 'cosmic' | 'aqua' | 'coral';
  className?: string;
}

/**
 * Graphique futuriste avec effets 3D et animation
 * Utilise Canvas pour un rendu optimisé et des visuels avancés
 */
const FuturisticChart: React.FC<FuturisticChartProps> = ({
  data,
  labels,
  title,
  height = 300,
  width = 500,
  variant = 'cosmic',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Définir les couleurs en fonction de la variante
  const getColors = () => {
    switch (variant) {
      case 'cosmic':
        return { 
          primary: '#a855f7', 
          secondary: '#8b5cf6', 
          highlight: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.5)'
        };
      case 'aqua':
        return { 
          primary: '#06b6d4', 
          secondary: '#0ea5e9', 
          highlight: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.5)'
        };
      case 'coral':
        return { 
          primary: '#f43f5e', 
          secondary: '#fb7185', 
          highlight: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.5)'
        };
      default:
        return { 
          primary: '#a855f7', 
          secondary: '#8b5cf6', 
          highlight: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.5)'
        };
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Pour assurer que le canvas soit net sur les écrans à haute densité de pixels
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    
    // Réinitialiser le canvas
    ctx.clearRect(0, 0, width, height);
    
    const colors = getColors();
    const maxValue = Math.max(...data);
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 10;
    
    // Dessiner le fond
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Dessiner la grille
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Lignes horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Animation des barres
    const animateChart = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);
      
      // Redessiner le fond
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      // Redessiner la grille
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
      
      // Effet de pulsation
      const pulseOffset = Math.sin(timestamp / 1000) * 0.1 + 0.9;
      
      // Dessiner les barres avec effet 3D
      data.forEach((value, index) => {
        const normalizedValue = value / maxValue;
        const barHeight = chartHeight * normalizedValue * pulseOffset;
        const x = padding + index * (barWidth + 10);
        const y = height - padding - barHeight;
        
        // Ombre des barres
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        
        // Gradient pour effet 3D
        const gradient = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight);
        gradient.addColorStop(0, colors.secondary);
        gradient.addColorStop(1, colors.primary);
        
        // Dessiner la barre principale
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 5);
        ctx.fill();
        
        // Réinitialiser l'ombre pour le texte
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Dessiner le reflet sur la barre
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, barWidth / 2, 10, 3);
        ctx.fill();
        
        // Valeur au-dessus de la barre
        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth / 2, y - 10);
        
        // Label en dessous
        if (labels && labels[index]) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(labels[index], x + barWidth / 2, height - padding + 15);
        }
      });
      
      requestAnimationFrame(animateChart);
    };
    
    requestAnimationFrame(animateChart);
    
    // Nettoyage
    return () => {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    };
  }, [data, labels, height, width, variant]);

  return (
    <div className={`relative ${className}`}>
      {title && (
        <h3 className="text-sm font-medium mb-2 opacity-70">{title}</h3>
      )}
      <div className="relative rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          style={{ width, height }}
          className="rounded-lg"
        />
        {/* Effet de brillance */}
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-t from-transparent to-white/5"></div>
      </div>
    </div>
  );
};

export default FuturisticChart;
