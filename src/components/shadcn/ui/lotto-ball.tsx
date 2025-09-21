import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { motion, Variants, useAnimate, useMotionValue, useTransform, useSpring } from 'framer-motion';
import './lotto-ball.css';

interface LottoBallProps {
  number: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type?: 'regular' | 'bonus' | 'prediction';
  isHighlighted?: boolean;
  isSelected?: boolean;
  isExcluded?: boolean;
  isBonus?: boolean;
  className?: string;
  onClick?: () => void;
  animated?: boolean;
}

/**
 * Composant de boule de lotto avec effet 3D avancé et animations ultra-réalistes
 * Utilisé pour afficher les numéros tirés et les prédictions
 * Inclut des animations d'entrée, des effets au survol et des transitions fluides
 * Intègre des effets de relief, de brillance et de profondeur pour un rendu futuriste 2026
 * Optimisé pour une expérience utilisateur immersive avec interactions dynamiques
 */
const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'md',
  type = 'regular',
  isHighlighted = false,
  isSelected = false,
  isExcluded = false,
  isBonus = false,
  className,
  onClick,
  animated = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(!animated);
  const [scope, animate] = useAnimate();
  
  // Valeurs de motion pour l'effet 3D de perspective au survol
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  
  // Transformations pour l'effet 3D basé sur la position de la souris
  const rotateX = useTransform(y, [-100, 100], [35, -35]);
  const rotateY = useTransform(x, [-100, 100], [-35, 35]);
  
  // Ajouter un ressort pour des mouvements plus fluides
  const springRotateX = useSpring(rotateX, { stiffness: 400, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 400, damping: 25 });
  
  // Référence pour le suivi de la position de la souris
  const ballRef = useRef<HTMLDivElement>(null);

  
  // Animation d'apparition progressive avec délai basé sur le numéro
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setHasAppeared(true);
      }, 120 + (number % 10) * 90); // Animation décalée selon le numéro
      return () => clearTimeout(timer);
    }
  }, [animated, number]);
  
  // Animation de pulsation pour les boules sélectionnées
  useEffect(() => {
    if (isSelected && scope.current) {
      animate(scope.current, 
        { 
          boxShadow: [
            "0 0 15px 2px rgba(255,255,255,0.3)",
            "0 0 30px 8px rgba(255,255,255,0.6)",
            "0 0 15px 2px rgba(255,255,255,0.3)"
          ]
        }, 
        { 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }
      );
    }
  }, [isSelected, animate, scope]);
  
  // Gestion du suivi de la souris pour l'effet 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ballRef.current || !isHovered) return;
    
    const rect = ballRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculer la distance depuis le centre
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Limiter les valeurs pour éviter des rotations trop extrêmes
    x.set(Math.max(-60, Math.min(60, mouseX)));
    y.set(Math.max(-60, Math.min(60, mouseY)));
    
    // Effet de zoom au survol
    scale.set(isHovered ? 1.08 : 1);
  };
  
  // Détermine le type basé sur les props
  let resolvedType = type;
  if (isBonus) resolvedType = 'bonus';
  
  // États spéciaux avec effets améliorés
  let stateClass = '';
  if (isSelected) stateClass = 'ring-4 ring-offset-2 ring-offset-transparent ring-blue-400/80 scale-110';
  if (isExcluded) stateClass = 'ring-4 ring-offset-1 ring-offset-transparent ring-red-500/80 opacity-60';
  
  // Variables pour les animations
  const variants: Variants = {
    initial: { 
      scale: 0.4, 
      opacity: 0,
      y: 30,
      rotateY: 180,
      filter: 'blur(8px)'
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 15,
        delay: animated ? (number % 10) * 0.08 : 0
      }
    },
    hover: {
      scale: 1.15, 
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: {
      scale: 0.92,
      y: 4,
      rotateZ: 5,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }
    },
    selected: {
      scale: 1.1,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    excluded: {
      scale: 0.95,
      opacity: 0.6,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
  
  
  return (
    <motion.div 
      ref={ballRef}
      className={cn(
        'lotto-ball',
        `lotto-ball-${size}`,
        `lotto-ball-${resolvedType}`,
        isHighlighted && 'lotto-ball-highlight',
        stateClass,
        className
      )}
      style={{
        // Styles 3D spéciaux uniquement
        perspective: '1200px',
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        scale: scale.get()
      }}
      variants={variants}
      initial="initial"
      animate={hasAppeared ? "animate" : "initial"}
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        // Réinitialiser la position
        x.set(0);
        y.set(0);
        scale.set(1);
      }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      transition={{ 
        rotateX: { duration: 0.15, ease: 'linear' },
        rotateY: { duration: 0.15, ease: 'linear' },
        scale: { duration: 0.2, ease: 'backOut' }
      }}
    >
      {/* Effet de profondeur 3D - intérieur de la boule */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{ transform: 'translateZ(-8px)' }}
      >
        <div 
          className="absolute inset-0 opacity-15"
          style={{ 
            background: 'rgba(255,255,255,0.06)'
          }}
        />
      </div>

      {/* Effet de brillance supérieure */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white/50 blur-sm"
          style={{ 
            borderRadius: '100% 100% 50% 50%', 
            transform: 'translateY(-30%) rotateX(70deg)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.3))'
          }}
        />
        
        {/* Petit point brillant de réflexion */}
        <div 
          className="absolute top-[15%] left-[20%] w-[15%] h-[15%] bg-white rounded-full blur-[1px]"
          style={{ transform: 'translateZ(2px)' }}
        />
      </div>

      {/* Numéro de la boule centré */}
      <span className="z-10 relative flex items-center justify-center w-full h-full">
        {number}
      </span>
    </motion.div>
  );
};

export default LottoBall;