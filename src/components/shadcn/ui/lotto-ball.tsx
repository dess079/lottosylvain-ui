import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { motion, Variants, useAnimate, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
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
    
    // Calcul de la distance pour l'effet d'éclairage dynamique
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
    
    // Limiter les valeurs pour éviter des rotations trop extrêmes
    x.set(Math.max(-60, Math.min(60, mouseX)));
    y.set(Math.max(-60, Math.min(60, mouseY)));
    
    // Effet de zoom au survol
    scale.set(isHovered ? 1.08 : 1);
  };
  
  // Tailles fixes des boules avec ajustements pour meilleur rendu 3D
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem]',
    md: 'w-16 h-16 text-base min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem]',
    lg: 'w-24 h-24 text-2xl font-extrabold min-w-[6rem] min-h-[6rem] max-w-[6rem] max-h-[6rem]'
  };
  
  // Détermine le type basé sur les props
  let resolvedType = type;
  if (isBonus) resolvedType = 'bonus';
  
  // Types de boules avec gradients améliorés et couleurs futuristes
  const typeClasses = {
    regular: 'bg-gradient-to-b from-cosmic-violet via-cosmic-violet-700 to-cosmic-violet-900',
    bonus: 'bg-gradient-to-b from-neon-coral via-neon-coral-700 to-neon-coral-900',
    prediction: 'bg-gradient-to-b from-electric-aqua via-electric-aqua-700 to-electric-aqua-900'
  };
  
  // Couleurs de brillance pour chaque type
  const glowColors = {
    regular: 'rgba(168, 85, 247, 0.7)', // cosmic-violet
    bonus: 'rgba(244, 63, 94, 0.7)', // neon-coral
    prediction: 'rgba(6, 182, 212, 0.7)' // electric-aqua
  };
  
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
        'rounded-full flex items-center justify-center font-bold text-white',
        'relative cursor-pointer transform transition-all perspective-1000',
        'aspect-square flex-shrink-0 flex-grow-0 inline-block', // Garantit que la boule est parfaitement ronde et ne s'étire pas
        sizeClasses[size],
        typeClasses[resolvedType],
        isHighlighted && 'ring-4 ring-white/70 z-10',
        stateClass,
        className
      )}
      style={{
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        boxShadow: `
          inset 0 -10px 20px rgba(0,0,0,0.5),
          inset 0 6px 12px rgba(255,255,255,0.6),
          0 15px 35px -5px rgba(0,0,0,0.5),
          0 0 ${isHovered ? '25px' : '15px'} ${glowColors[resolvedType]}
        `,
        overflow: 'hidden',
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
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 70%)'
          }}
        />
      </div>

      {/* Effet de brillance supérieure */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white/40 blur-sm"
          style={{ 
            borderRadius: '100% 100% 50% 50%', 
            transform: 'translateY(-50%) rotateX(60deg)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.2))'
          }}
        />
        
        {/* Petit point brillant de réflexion */}
        <div 
          className="absolute top-[15%] left-[20%] w-[10%] h-[10%] bg-white/90 rounded-full blur-[1px]"
          style={{ transform: 'translateZ(2px)' }}
        />
        
        {/* Ombre intérieure en bas */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1/3 blur-sm opacity-70",
            isHighlighted ? "animate-pulse" : ""
          )}
          style={{ 
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            transform: 'translateZ(-5px)'
          }}
        />
      </div>
      
      {/* Texture fine */}
      <div 
        className="absolute inset-0 rounded-full opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '8px 8px'
        }}
      />
      
      {/* Numéro avec meilleur rendu 3D */}
      <motion.span 
        className="relative z-10 tracking-tight font-bold transform flex items-center justify-center w-full h-full" 
        style={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.6)',
          transform: 'translateZ(10px)',
          fontFamily: "'Space Grotesk', sans-serif", // Police plus moderne et claire
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { delay: animated ? 0.1 + (number % 10) * 0.08 : 0 }
        }}
      >
        {number < 10 ? `0${number}` : number}
      </motion.span>
      
      {/* Effet de pulsation lorsqu'il est mis en évidence */}
      {isHighlighted && (
        <motion.div 
          className="absolute inset-0 rounded-full bg-white/25 z-0"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.35, 0.15] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut" 
          }}
        />
      )}
      
      {/* Halo lumineux autour de la boule (plus visible au survol) */}
      <motion.div 
        className="absolute -inset-4 rounded-full pointer-events-none z-[-1]"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.7 : isHighlighted ? 0.5 : 0.3,
          scale: isHovered ? 1.15 : 1
        }}
        style={{
          background: `radial-gradient(circle, ${glowColors[resolvedType]} 0%, transparent 70%)`
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Reflet dynamique qui se déplace en fonction de la position de la souris */}
      <motion.div
        className="absolute w-full h-full rounded-full overflow-hidden pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)',
          opacity: isHovered ? 0.7 : 0.3,
          x: x,
          y: y,
          transformStyle: 'preserve-3d',
          transform: 'scale(0.85) translateZ(4px)'
        }}
      />
      
      {/* Anneau de mise en évidence pour les animations interactives */}
      <motion.div 
        ref={scope}
        className="absolute -inset-1 rounded-full pointer-events-none opacity-0"
        animate={isSelected ? { opacity: 1 } : { opacity: 0 }}
      />

      {/* Effet de grain pour plus de réalisme */}
      <div 
        className="absolute inset-0 rounded-full mix-blend-overlay opacity-10"
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundSize: 'cover'
        }}
      />
    </motion.div>
  );
};

export default LottoBall;