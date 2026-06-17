import React, { useState, useEffect } from 'react';
import { Character } from '../types';

interface SoundBarProps {
  character: Character;
  isSelected: boolean;
  isInteractive?: boolean;
  isDimmed?: boolean;
  isTotallyHidden?: boolean;
  onClick: () => void;
  index: number;
}

export const SoundBar: React.FC<SoundBarProps> = ({
  character,
  isSelected,
  isInteractive = true,
  isDimmed = false,
  isTotallyHidden = false,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [breatheScale, setBreatheScale] = useState(1);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [randomBaseHeight] = useState(() => {
    // Completely randomized base height between 7.5 and 14.0 vh for each bar on page load
    return 7.5 + Math.random() * 6.5;
  });

  useEffect(() => {
    // 500ms initial wait + index-based stagger (100ms per bar) + 900ms keyframe time
    const totalDuration = 500 + index * 100 + 900;
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, totalDuration);
    return () => clearTimeout(timer);
  }, [index]);

  // Very subtle, fluid and natural continuous breathing using CSS-friendly sinus scale
  useEffect(() => {
    if (!isIntroComplete) {
      setBreatheScale(1);
      return;
    }

    let animId: number;
    const startTimeStamp = Date.now();
    const speed = 1.0 + Math.random() * 0.3; // Slower, highly subtle speed

    const tick = () => {
      // Use elapsed time from start so wave starts exactly at 0 (sin(0) = 0), matching scale 1.0 perfectly
      const elapsed = (Date.now() - startTimeStamp) * 0.0015;
      const wave = Math.sin(elapsed * speed);
      
      // Extremely subtle breathing scale variant (between 0.985 and 1.015)
      const baseVariation = isSelected ? 0.01 : isHovered ? 0.012 : 0.015;
      setBreatheScale(1 + wave * baseVariation);

      animId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isSelected, isIntroComplete]);

  const baseHeight = randomBaseHeight;
  
  // Calculate heights according to current state
  let targetHeight = baseHeight;
  if (isSelected) {
    targetHeight = baseHeight + 5.5; 
  } else if (isHovered && isInteractive) {
    targetHeight = baseHeight + 3.0; 
  }

  return (
    <div
      id={`bar-group-${character.id}`}
      className={`relative flex flex-col items-center w-[40px] sm:w-[54px] transition-all duration-500 ${
        !isInteractive ? 'pointer-events-none cursor-default' : isDimmed ? 'opacity-30 scale-[0.88] pointer-events-none' : 'cursor-pointer'
      }`}
      onMouseEnter={() => isInteractive && !isDimmed && setIsHovered(true)}
      onMouseLeave={() => isInteractive && !isDimmed && setIsHovered(false)}
      onClick={isInteractive ? onClick : undefined}
      style={{
        visibility: isTotallyHidden ? 'hidden' : 'visible',
        transition: isTotallyHidden ? 'none' : undefined,
      }}
    >
      {/* Restored informative floating tooltip bubble on hover/selection */}
      <span
        id={`label-${character.id}`}
        className="absolute -top-16 font-sans font-semibold tracking-wider text-[11px] transition-all duration-300 rounded-xl px-2.5 py-1.5 shadow-md whitespace-nowrap z-25 pointer-events-none border border-slate-100 bg-white text-slate-700"
        style={{
          transform: isInteractive && (isHovered || isSelected) && !isDimmed ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
          opacity: isInteractive && (isHovered || isSelected) && !isDimmed ? 1 : 0,
        }}
      >
        {character.name}
        <span className="block text-[8px] text-center opacity-70 font-mono mt-0.5 leading-none uppercase">
          {character.subtitle}
        </span>
      </span>

      {/* Main Color Bar - Sitting completely flat with rounded-t-full top */}
      <div
        id={`bar-main-${character.id}`}
        className={`w-7 sm:w-9 rounded-t-full relative flex flex-col justify-end pb-3 items-center overflow-hidden border-t border-white/40 select-none
          ${!isIntroComplete ? 'animate-strip-intro' : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]'}
          ${isTotallyHidden ? 'opacity-0 pointer-events-none' : isSelected 
            ? 'opacity-100 ring-4 ring-white shadow-[0_-12px_30px_rgba(255,255,255,0.45)] brightness-105 z-20' 
            : 'opacity-85 shadow-md z-10'
          }`}
        style={{
          backgroundColor: character.color,
          height: `${targetHeight}vh`,
          transform: !isIntroComplete 
            ? undefined 
            : `scaleY(${isDimmed ? 1.0 : breatheScale})`,
          transformOrigin: 'bottom center',
          animationDelay: !isIntroComplete ? `${500 + index * 100}ms` : undefined,
          opacity: isTotallyHidden ? 0 : undefined,
          transition: isTotallyHidden ? 'none' : undefined,
          boxShadow: isTotallyHidden 
            ? 'none'
            : isHovered && isInteractive && !isDimmed
              ? `0 -6px 18px ${character.color}75` 
              : isSelected
                ? `0 -10px 25px ${character.color}90`
                : `0 -2px 6px ${character.color}15`,
        }}
      >
        {/* White glowing dot inside bar */}
        <div 
          className="w-1.5 h-1.5 rounded-full bg-white absolute top-3 shadow-[0_0_8px_#fff] transition-all duration-300"
          style={{
            transform: isHovered ? 'scale(1.3)' : isSelected ? 'scale(1.5)' : 'scale(1)',
            opacity: isSelected ? 0.95 : 0.7,
          }}
        />

        {/* Dynamic scanline transition effect inside chosen bar */}
        {isSelected && (
          <div 
            className="absolute left-0 right-0 h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-scanline pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};
