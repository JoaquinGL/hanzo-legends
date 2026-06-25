import React from 'react';
import { Character } from '../types';
import { RefreshCw, X } from 'lucide-react';

interface CharacterCardProps {
  character: Character | null;
  onClose: () => void;
  isTransitioning?: boolean;
  transitionProgress?: number;
  variant?: 'default' | 'finale';
  footerAction?: {
    label: string;
    onClick: () => void;
  };
}

const Paragraphs: React.FC<{ paragraphs: string[]; className?: string }> = ({ paragraphs, className = '' }) => (
  <div className={className}>
    {paragraphs.map((paragraph, index) => (
      <p key={index} className={index > 0 ? 'mt-2' : ''}>
        {paragraph}
      </p>
    ))}
  </div>
);

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 my-3 md:my-2">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-base md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);
const StatValue: React.FC<{ value: number; active: boolean; color: string }> = ({ value, active, color }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  const [pulse, setPulse] = React.useState(false);
  const [glowEffect, setGlowEffect] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      setDisplayValue(0);
      setPulse(false);
      setGlowEffect(false);
      return;
    }

    setPulse(true);
    setGlowEffect(true);
    
    const glowTimer = setTimeout(() => {
      setGlowEffect(false);
    }, 600);

    const duration = 450; 
    const end = value;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * end);
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(end);
        setTimeout(() => setPulse(false), 200);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(glowTimer);
    };
  }, [value, active]);

  return (
    <div className="relative flex items-center justify-end min-w-[2rem] ml-2 h-6 md:h-5">
      {glowEffect && (
        <span 
          className="absolute w-6 h-6 rounded-full border opacity-0 animate-stat-ping pointer-events-none"
          style={{ 
            borderColor: color,
            boxShadow: `0 0 10px ${color}`
          }}
        />
      )}
      <span 
        className={`font-mono font-bold text-base md:text-xs transition-all duration-300 block text-right select-none ${
          active 
            ? 'opacity-100' 
            : 'opacity-30'
        }`}
        style={{
          color: pulse ? (color === '#ffffff' ? '#334155' : color) : '#334155',
          textShadow: pulse ? `0 0 8px ${color}88` : 'none',
          transform: pulse ? 'scale(1.2) translateY(-0.5px)' : 'scale(1.0) translateY(0)',
        }}
      >
        {displayValue}
      </span>
    </div>
  );
};

const CharacterThemedBackground: React.FC<{ character: Character }> = ({ character }) => {
  const color = character.color;

  switch (character.id) {
    case 'william':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g stroke={color} strokeWidth="1" strokeDasharray="3 6" opacity="0.12">
            <line x1="180" y1="360" x2="0" y2="0" />
            <line x1="180" y1="360" x2="200" y2="0" />
            <line x1="180" y1="360" x2="400" y2="0" />
            <line x1="180" y1="360" x2="600" y2="0" />
            <line x1="180" y1="360" x2="800" y2="0" />
            <line x1="180" y1="360" x2="840" y2="200" />
            <line x1="180" y1="360" x2="840" y2="400" />
            <line x1="180" y1="360" x2="840" y2="580" />
            <line x1="180" y1="360" x2="600" y2="580" />
            <line x1="180" y1="360" x2="400" y2="580" />
            <line x1="180" y1="360" x2="0" y2="580" />
          </g>

          <path 
            d="M 120 220 Q 180 200 240 220 Q 240 320 180 400 Q 120 320 120 220 Z" 
            stroke={color} 
            strokeWidth="1.5" 
            fill={`${color}03`} 
            opacity="0.15"
          />
          <path 
            d="M 140 235 Q 180 220 220 235 Q 220 310 180 375 Q 140 310 140 235 Z" 
            stroke={color} 
            strokeWidth="0.75" 
            fill="none" 
            opacity="0.10"
          />
          
          <circle cx="180" cy="360" r="160" stroke={color} strokeWidth="1" opacity="0.08" />
          <circle cx="180" cy="360" r="220" stroke={color} strokeWidth="1" strokeDasharray="10 5" opacity="0.06" />
          
          <path d="M 640 100 Q 640 115 655 115 Q 640 115 640 130 Q 640 115 625 115 Q 640 115 640 100 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.12" />
          <path d="M 520 220 Q 520 230 530 230 Q 520 230 520 240 Q 520 230 510 230 Q 520 230 520 220 Z" stroke={color} strokeWidth="0.75" fill="none" opacity="0.10" />
          <path d="M 720 380 Q 720 390 730 390 Q 720 390 720 400 Q 720 390 710 390 Q 720 390 720 380 Z" stroke={color} strokeWidth="0.75" fill="none" opacity="0.10" />
        </svg>
      );

    case 'gimlice':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M 0 580 L 150 400 L 300 580 Z" stroke={color} strokeWidth="1.5" fill={`${color}02`} opacity="0.12" />
          <path d="M 120 580 L 350 280 L 580 580 Z" stroke={color} strokeWidth="2" fill={`${color}01`} opacity="0.10" />
          <path d="M 450 580 L 650 350 L 840 580 Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.08" />
          
          <line x1="150" y1="400" x2="350" y2="280" stroke={color} strokeWidth="1" strokeDasharray="5 5" opacity="0.15" />
          <line x1="350" y1="280" x2="650" y2="350" stroke={color} strokeWidth="1" strokeDasharray="5 5" opacity="0.15" />
          
          <polygon points="180,360 210,310 270,310 300,360 270,410 210,410" stroke={color} strokeWidth="1.5" fill="none" opacity="0.12" />
          <polygon points="190,360 215,320 265,320 290,360 265,400 215,400" stroke={color} strokeWidth="1" fill="none" opacity="0.08" />
          
          <line x1="180" y1="360" x2="300" y2="360" stroke={color} strokeWidth="0.75" opacity="0.08" />
          <line x1="210" y1="310" x2="270" y2="410" stroke={color} strokeWidth="0.75" opacity="0.08" />
          <line x1="270" y1="310" x2="210" y2="410" stroke={color} strokeWidth="0.75" opacity="0.08" />
          
          <path d="M0 480 C 150 520, 300 460, 480 510 C 660 560, 750 490, 840 530" stroke={color} strokeWidth="1" strokeDasharray="8 4" opacity="0.10" />
        </svg>
      );

    case 'robin':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M -50 180 C 180 80, 420 320, 890 140" stroke={color} strokeWidth="1.5" opacity="0.15" />
          <path d="M -20 220 C 210 120, 450 360, 920 180" stroke={color} strokeWidth="1" opacity="0.10" />
          <path d="M -80 140 C 150 40, 390 280, 860 100" stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.12" />
          
          <circle cx="180" cy="380" r="140" stroke={color} strokeWidth="1" opacity="0.08" />
          <circle cx="180" cy="380" r="90" stroke={color} strokeWidth="1" strokeDasharray="4 2" opacity="0.12" />
          <circle cx="180" cy="380" r="50" stroke={color} strokeWidth="1.5" opacity="0.15" />
          
          <g stroke={color} strokeWidth="1" fill={`${color}03`} opacity="0.12">
            <path d="M 450 100 Q 480 80 510 110 Q 470 130 450 100 Z" transform="rotate(15, 450, 100)" />
            <path d="M 680 240 Q 705 220 730 245 Q 695 265 680 240 Z" transform="rotate(-25, 680, 240)" />
            <path d="M 520 420 Q 550 400 580 430 Q 540 450 520 420 Z" transform="rotate(40, 520, 420)" />
            <path d="M 320 220 Q 340 205 360 225 Q 335 240 320 220 Z" transform="rotate(-10, 320, 220)" />
          </g>
        </svg>
      );

    case 'herminice':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g transform="translate(180, 340)">
            <circle cx="0" cy="0" r="170" stroke={color} strokeWidth="2" strokeDasharray="20 8 4 8" opacity="0.14" />
            <circle cx="0" cy="0" r="140" stroke={color} strokeWidth="1" opacity="0.08" />
            <circle cx="0" cy="0" r="120" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.15" />
            <circle cx="0" cy="0" r="90" stroke={color} strokeWidth="1.5" opacity="0.10" />
            <circle cx="0" cy="0" r="50" stroke={color} strokeWidth="1" strokeDasharray="10 5" opacity="0.12" />
            
            <line x1="-190" y1="0" x2="190" y2="0" stroke={color} strokeWidth="0.75" opacity="0.08" />
            <line x1="0" y1="-190" x2="0" y2="190" stroke={color} strokeWidth="0.75" opacity="0.08" />
            
            <circle cx="95" cy="95" r="4" fill={color} opacity="0.15" />
            <circle cx="-95" cy="-95" r="4" fill={color} opacity="0.15" />
            <circle cx="-95" cy="95" r="4" fill={color} opacity="0.15" />
            <circle cx="95" cy="-95" r="4" fill={color} opacity="0.15" />
            
            <circle cx="140" cy="0" r="6" stroke={color} strokeWidth="1" fill="none" opacity="0.12" />
            <circle cx="-140" cy="0" r="6" stroke={color} strokeWidth="1" fill="none" opacity="0.12" />
          </g>

          <path d="M 550 140 Q 550 155 565 155 Q 550 155 550 170 Q 550 155 535 155 Q 550 155 550 140 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.15" />
          <path d="M 740 220 Q 740 230 750 230 Q 740 230 740 240 Q 740 230 730 230 Q 740 230 740 220 Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.18" />
          <path d="M 620 420 Q 620 430 630 430 Q 620 430 620 440 Q 620 430 610 430 Q 620 430 620 420 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.12" />
        </svg>
      );

    case 'misifu':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g transform="translate(180, 345) rotate(-20)">
            <ellipse cx="0" cy="0" rx="220" ry="110" stroke={color} strokeWidth="1.5" strokeDasharray="15 5 5 5" opacity="0.12" />
            <ellipse cx="0" cy="0" rx="170" ry="85" stroke={color} strokeWidth="1" opacity="0.08" />
            <ellipse cx="0" cy="0" rx="120" ry="60" stroke={color} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.15" />
            <ellipse cx="0" cy="0" rx="80" ry="40" stroke={color} strokeWidth="1.5" opacity="0.16" />
            <ellipse cx="0" cy="0" rx="40" ry="20" stroke={color} strokeWidth="2" opacity="0.20" fill={`${color}05`} />
          </g>

          <g stroke={color} strokeWidth="1.5" fill="none" opacity="0.12">
            <path d="M 520 180 Q 570 140 620 180 Q 570 220 520 180 Z" />
            <line x1="570" y1="150" x2="570" y2="210" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            
            <path d="M 680 180 Q 730 140 780 180 Q 730 220 680 180 Z" />
            <line x1="730" y1="150" x2="730" y2="210" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          
          <path d="M -40 220 Q 250 500 880 300" stroke={color} strokeWidth="1" strokeDasharray="10 10" opacity="0.12" />
          <path d="M -40 260 Q 250 540 880 340" stroke={color} strokeWidth="0.75" opacity="0.06" />
        </svg>
      );

    case 'bigotitos':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g transform="translate(180, 320)">
            <circle cx="0" cy="0" r="150" stroke={color} strokeWidth="1.5" opacity="0.10" />
            <circle cx="0" cy="0" r="150" stroke={color} strokeWidth="1" strokeDasharray="3 6" opacity="0.12" />
            <circle cx="0" cy="0" r="110" stroke={color} strokeWidth="1" opacity="0.08" />
            <circle cx="0" cy="0" r="70" stroke={color} strokeWidth="1.5" opacity="0.10" />
            
            <line x1="-150" y1="0" x2="150" y2="0" stroke={color} strokeWidth="0.75" opacity="0.08" />
            <line x1="0" y1="-150" x2="0" y2="150" stroke={color} strokeWidth="0.75" opacity="0.08" />
            <line x1="-106" y1="-106" x2="106" y2="106" stroke={color} strokeWidth="0.75" opacity="0.06" />
            <line x1="-106" y1="106" x2="106" y2="-106" stroke={color} strokeWidth="0.75" opacity="0.06" />

            <path d="M 0 0 C 30 -40, 70 -40, 110 0 C 70 40, 30 40, 0 0 Z" stroke={color} strokeWidth="1" opacity="0.10" fill="none" />
            <path d="M 0 0 C -30 -40, -70 -40, -110 0 C -70 40, -30 40, 0 0 Z" stroke={color} strokeWidth="1" opacity="0.10" fill="none" />
          </g>

          <g stroke={color} strokeWidth="1" opacity="0.10" fill={`${color}03`}>
            <rect x="520" y="180" width="14" height="400" rx="4" />
            <rect x="545" y="140" width="14" height="440" rx="4" />
            <rect x="570" y="110" width="14" height="470" rx="4" />
            <rect x="595" y="80" width="14" height="500" rx="4" />
            <rect x="620" y="110" width="14" height="470" rx="4" />
            <rect x="645" y="140" width="14" height="440" rx="4" />
            <rect x="670" y="180" width="14" height="400" rx="4" />
          </g>
          
          <line x1="450" y1="0" x2="840" y2="390" stroke={color} strokeWidth="1" strokeDasharray="15 15" opacity="0.12" />
          <line x1="550" y1="0" x2="840" y2="290" stroke={color} strokeWidth="1.5" strokeDasharray="15 15" opacity="0.08" />
          <line x1="350" y1="0" x2="840" y2="490" stroke={color} strokeWidth="1" strokeDasharray="15 15" opacity="0.08" />
        </svg>
      );

    case 'tigri':
      return (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          viewBox="0 0 840 580" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <g stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.06">
            <path d="M 80 180 L 220 380" />
            <path d="M 120 160 L 260 360" />
            <path d="M 160 140 L 300 340" />
          </g>
          
          <path d="M 280 580 Q 320 440 280 390 Q 340 430 360 580 Z" stroke={color} strokeWidth="1" fill={`${color}02`} opacity="0.15" />
          <path d="M 400 580 Q 455 360 400 320 Q 475 390 490 580 Z" stroke={color} strokeWidth="1.5" fill={`${color}03`} opacity="0.18" />
          <path d="M 520 580 Q 560 460 530 410 Q 580 440 590 580 Z" stroke={color} strokeWidth="1" fill={`${color}02`} opacity="0.15" />
          
          <circle cx="180" cy="360" r="150" stroke={color} strokeWidth="1" opacity="0.08" />
          <circle cx="180" cy="360" r="210" stroke={color} strokeWidth="1" strokeDasharray="6 4" opacity="0.06" />
          <circle cx="180" cy="360" r="270" stroke={color} strokeWidth="1.5" strokeDasharray="20 10" opacity="0.04" />
        </svg>
      );

    default:
      return null;
  }
};

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onClose,
  isTransitioning,
  transitionProgress,
  variant = 'default',
  footerAction,
}) => {
  if (!character) return null;

  const isFinale = variant === 'finale' || character.id === 'final';

  // Track if we animated via custom transition to bypass the keyframes entry reset (animate-scale-up) at completion
  const hasTransitionedRef = React.useRef(false);
  if (isTransitioning) {
    hasTransitionedRef.current = true;
  }

  const isTransitionActive = isTransitioning && transitionProgress !== undefined;
  const progress = transitionProgress ?? 1;

  const [animate, setAnimate] = React.useState(false);
  const [visibleTotals, setVisibleTotals] = React.useState<Record<string, boolean>>({});
  const [tilt, setTilt] = React.useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitionActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates scaled between -1 and 1
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);
    
    // Max tilt set to 8 degrees to ensure the look is extremely subtle and elegant
    const maxTiltX = 8;
    const maxTiltY = 8;
    
    setTilt({
      x: -y * maxTiltX,
      y: x * maxTiltY,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  React.useEffect(() => {
    if (isTransitionActive) {
      setAnimate(false);
      setVisibleTotals({});
      return;
    }

    setAnimate(false);
    setVisibleTotals({});

    const triggerTimeout = setTimeout(() => {
      setAnimate(true);
    }, 120);

    const keys = isFinale ? [] : character.attributes.map((attr) => attr.name);
    const timers: NodeJS.Timeout[] = [];

    keys.forEach((key, index) => {
      const completionDelay = 120 + (index * 120) + 700;
      const timer = setTimeout(() => {
        setVisibleTotals(prev => ({ ...prev, [key]: true }));
      }, completionDelay);
      timers.push(timer);
    });

    return () => {
      clearTimeout(triggerTimeout);
      timers.forEach(clearTimeout);
    };
  }, [character.id, isTransitionActive]);

  // 1. Backdrop Opacity & Blur curves
  let backdropOpacity = 1;
  let backdropFilter = "blur(4px)";
  if (isTransitionActive) {
    if (progress < 0.35) {
      backdropOpacity = 0;
      backdropFilter = "blur(0px)";
    } else {
      const p = Math.min(1, (progress - 0.35) / 0.35);
      backdropOpacity = p;
      backdropFilter = `blur(${4 * p}px)`;
    }
  }

  // 2. Card entry: appears descending from above as the stable destination of the journey (starts at t = 0.45 and arrives at 0)
  let translateY = "translateY(0px)";
  let cardOpacity = 1;
  if (isTransitionActive) {
    if (progress < 0.45) {
      translateY = `translateY(${-window.innerHeight - 150}px)`;
      cardOpacity = 0;
    } else {
      // Descends smoothly between t = 0.45 and t = 0.80
      const p_card = Math.min(1.0, (progress - 0.45) / 0.35);
      const ease = 1 - Math.pow(1 - p_card, 3); // smooth cubic ease-out
      translateY = `translateY(${(-window.innerHeight - 150) * (1 - ease)}px)`;
      cardOpacity = p_card; // smooth fade-in coinciding with translation
    }
  }

  // 3. Card contents opacity: slides up slightly and fades in at the very end (from 0.80 to 1.0)
  let contentOpacity = 1;
  let contentTranslateY = "translateY(0px)";
  if (isTransitionActive) {
    if (progress < 0.80) {
      contentOpacity = 0;
      contentTranslateY = "translateY(25px)";
    } else {
      const p = (progress - 0.80) / 0.20;
      contentOpacity = p;
      contentTranslateY = `translateY(${15 * (1 - p)}px)`;
    }
  }

  // 4. Card Border Color is handled entirely by the SVG wrapPath, avoiding any double-borders or visual jumps
  return (
    <>
      {/* Background Dim Backdrop - Layered at z-[45] (below TrailOverlay at z-[50]) */}
      <div 
        id="modal-backdrop"
        className="fixed inset-0 bg-slate-950/30 z-[45]"
        style={{
          opacity: backdropOpacity,
          backdropFilter: backdropFilter,
          pointerEvents: isTransitionActive ? 'none' : 'auto',
          transition: isTransitionActive ? 'none' : 'opacity 0.2s ease-out, backdrop-filter 0.2s ease-out',
        }}
        onClick={onClose}
      />

      {/* Pop-Out Card Container - Layered at z-[55] (above TrailOverlay at z-[50]) */}
      <div 
        id="modal-container" 
        className={`fixed inset-0 flex items-center justify-center p-4 z-[55] overflow-y-auto md:overflow-visible max-md:py-12 ${
          isTransitionActive ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        onClick={(e) => {
          if ((e.target as HTMLElement).id === "modal-container") {
            onClose();
          }
        }}
      >
        {/* Pop-Out Card Body - Predefined and locked to fit our flight trajectory bounds without layout jumps */}
        <div 
          id="modal-card-body"
          className={`relative rounded-3xl w-[calc(100vw-32px)] max-w-[420px] md:max-w-none md:w-[900px] h-[540px] xs:h-[590px] md:h-[min(700px,calc(100vh-32px))] max-h-[calc(100vh-64px)] shadow-[0_24px_80px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.04)] flex flex-col md:flex-row border border-slate-200/60 overflow-hidden z-10 select-none ${
            (isTransitionActive || hasTransitionedRef.current) ? '' : 'animate-scale-up'
          }`}
          style={{ 
            transform: translateY,
            opacity: cardOpacity,
            transition: isTransitionActive ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
            background: '#ffffff',
          }}
        >
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none select-none z-0">
          <CharacterThemedBackground character={character} />
        </div>
 
        {/* Simple Close X Button on the top right - no glow, no shadow */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 active:scale-95 transition-colors p-2 z-[60] flex items-center justify-center cursor-pointer"
          aria-label="Cerrar"
        >
          <X className="w-7 h-7 stroke-[2]" />
        </button>
 
        {/* Left Side: 3D Popout Illustration Container with clean transparent background and no ambient pulse shadow or gradients */}
        <div 
          id="character-art-panel" 
          className="character-image-wrapper relative w-full h-[250px] md:h-full md:w-[42%] bg-transparent flex items-end justify-center overflow-visible z-10 shrink-0 select-none pb-0 pt-0 cursor-pointer"
          style={{
            opacity: contentOpacity,
            transform: contentTranslateY,
            transition: isTransitionActive ? 'none' : 'opacity 0.4s ease-out, transform 0.4s ease-out',
            perspective: '1000px',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle 3D dynamic rotating wrapper that aligns beautifully at bottom origin */}
          <div
            className="absolute inset-0 flex items-end justify-center overflow-visible pointer-events-none"
            style={{
              transform: tilt.active 
                ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)` 
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              transition: tilt.active ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.25, 1, 0.4, 1)',
              transformOrigin: 'bottom center',
            }}
          >
            {/* Main illustration with transparent background and 3D tilt on hover */}
            <img 
              id="modal-character-img"
              src={character.image} 
              alt={isFinale ? character.title : character.name}
              className="character-image absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-14 h-[250px] md:h-[135%] z-12 object-contain origin-bottom max-w-none md:max-w-none pointer-events-auto transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
 
        {/* Right Side: Hero sheet content */}
        <div 
          id="character-info-panel" 
          className="w-full md:w-[58%] p-4 xs:p-6 sm:p-8 md:px-9 md:py-7 flex flex-col bg-transparent relative z-20 min-h-0 overflow-y-auto scrollbar-thin pb-6"
          style={{
            opacity: contentOpacity,
            transform: contentTranslateY,
            transition: isTransitionActive ? 'none' : 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <div className="relative z-25 max-w-md mx-auto md:max-w-none w-full px-2 sm:px-4 md:px-0 flex-1 flex flex-col min-h-0">
            <header className="shrink-0">
              {!isFinale && character.name && (
                <span 
                  className="text-base md:text-xs font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase"
                  style={{ color: character.color }}
                >
                  {character.name}
                </span>
              )}

              <h2
                id="modal-character-title"
                className={`text-4xl sm:text-[2.5rem] md:text-3xl font-headline font-semibold text-slate-800 tracking-tight leading-tight ${
                  isFinale || !character.name ? '' : 'mt-1'
                }`}
              >
                {character.title}
              </h2>

              {!isFinale && character.subtitle && (
                <p 
                  className="text-lg md:text-xs font-bold tracking-wide uppercase mt-1 mb-3 md:mb-3"
                  style={{ color: character.color }}
                >
                  {character.subtitle}
                </p>
              )}

              {!isFinale && (
                <div 
                  className="w-16 h-1 mb-4 md:mb-5 rounded-full"
                  style={{ backgroundColor: character.color }}
                />
              )}

              <Paragraphs
                paragraphs={character.description}
                className={`text-slate-600 leading-relaxed text-base md:text-xs md:leading-snug ${
                  isFinale ? 'mt-4 mb-2' : 'mb-5 md:mb-3'
                }`}
              />
            </header>

            {!isFinale && character.attributes.length > 0 && (
              <div>
                <SectionDivider label="Atributos Legendarios" />

                <div className="space-y-4 md:space-y-3.5">
                  {character.attributes.map((attr, index) => {
                    const barWidth = animate ? attr.value : 0;
                    const isTotalVisible = !!visibleTotals[attr.name];

                    return (
                      <div key={attr.name}>
                        <div className="flex items-baseline justify-between gap-3 mb-1.5">
                          <span className="text-slate-800 font-bold uppercase tracking-wide text-base md:text-xs">
                            {attr.name}
                          </span>
                          <StatValue value={attr.value} active={isTotalVisible} color={character.color} />
                        </div>

                        <Paragraphs
                          paragraphs={attr.description}
                          className="text-slate-500 leading-snug text-base md:text-xs md:leading-tight mb-2 md:mb-1"
                        />

                        <div className="h-2 md:h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                          <div 
                            className="h-full rounded-full absolute left-0 top-0 transition-all overflow-hidden"
                            style={{ 
                              width: `${barWidth}%`, 
                              backgroundColor: character.color,
                              boxShadow: `0 0 6px ${character.color}88`,
                              transitionProperty: animate ? 'width' : 'none',
                              transitionDuration: animate ? '700ms' : '0ms',
                              transitionTimingFunction: animate ? 'cubic-bezier(0.25, 1, 0.4, 1)' : 'unset',
                              transitionDelay: animate ? `${index * 120}ms` : '0ms'
                            }}
                          >
                            {animate && !isTotalVisible && (
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-bar-shimmer"
                                style={{ width: '150px' }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {character.extra && character.extra.length > 0 && (
                  <footer className="mt-4 md:mt-3 pt-1">
                    <SectionDivider label="Extra" />
                    <Paragraphs
                      paragraphs={character.extra}
                      className="text-slate-500 leading-relaxed text-base md:text-xs md:leading-snug italic"
                    />
                  </footer>
                )}
              </div>
            )}

            {footerAction && (
              <footer className="mt-auto pt-6 border-t border-slate-200/80 flex justify-center shrink-0">
                <button
                  type="button"
                  onClick={footerAction.onClick}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 font-sans text-base md:text-xs font-semibold uppercase tracking-wider"
                >
                  <RefreshCw className="w-3 h-3" />
                  {footerAction.label}
                </button>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Elegant styles injected natively for micro-pings and shimmers */}
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes stat-ping {
        0% {
          transform: scale(0.6);
          opacity: 0.9;
        }
        100% {
          transform: scale(1.9);
          opacity: 0;
        }
      }
      .animate-stat-ping {
        animation: stat-ping 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      
      @keyframes bar-shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      .animate-bar-shimmer {
        animation: bar-shimmer 1s infinite linear;
      }
    `}} />
    </>
  );
};
