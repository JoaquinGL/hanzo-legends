import React, { useState, useEffect } from 'react';
import { characters } from './data';
import { Character } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { SoundBar } from './components/SoundBar';
import { CharacterCard } from './components/CharacterCard';
import { DungeonBackground } from './components/DungeonBackground';
import { TrailOverlay } from './components/TrailOverlay';
import { Compass, Sparkles } from 'lucide-react';
import { FinalPathJourney } from './components/FinalPathJourney';

export default function App() {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isTransitionComplete, setIsTransitionComplete] = useState<boolean>(false);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);
  const [animationId, setAnimationId] = useState<number>(0);
  const [clickedCoords, setClickedCoords] = useState<{
    x: number;
    y: number;
    startYTop: number;
    barWidth: number;
  } | null>(null);

  const [visitedChars, setVisitedChars] = useState<Record<string, boolean>>({});
  const [isFinalAnimationActive, setIsFinalAnimationActive] = useState<boolean>(false);

  // Monitor selected character and tag as visited
  useEffect(() => {
    if (selectedChar) {
      setVisitedChars(prev => {
        if (prev[selectedChar.id]) return prev;
        return { ...prev, [selectedChar.id]: true };
      });
    }
  }, [selectedChar]);

  const allVisited = characters.length > 0 && characters.every(char => visitedChars[char.id]);

  const playConvergenceChord = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      characters.forEach((char, index) => {
        const freq = char.notes?.[0] || 220;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const startTime = ctx.currentTime + index * 0.12;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 3.0);
      });
    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  };

  const handleResetExperience = () => {
    setSelectedChar(null);
    setVisitedChars({});
    setIsFinalAnimationActive(false);
    setIsTransitioning(false);
    setIsTransitionComplete(false);
    setTransitionProgress(0);
  };

  // Trigger keyboard number keys dynamically to select characters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, number> = {};
      characters.forEach((_, idx) => {
        if (idx < 9) {
          keyMap[(idx + 1).toString()] = idx;
        } else if (idx === 9) {
          keyMap['0'] = idx;
        }
      });

      const index = keyMap[e.key];
      if (index !== undefined && index < characters.length) {
        const char = characters[index];
        setSelectedChar(char);
        setIsTransitionComplete(false);
        setIsTransitioning(true);
        setTransitionProgress(0);
        setAnimationId(prev => prev + 1);

        // Fetch position slightly after React render cycle
        setTimeout(() => {
          const el = document.getElementById(`bar-main-${char.id}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            setClickedCoords({
              x: rect.left + rect.width / 2,
              y: rect.bottom,
              startYTop: rect.top,
              barWidth: rect.width || 36,
            });
          }
        }, 40);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      id="app-root-frame" 
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden antialiased select-none bg-slate-950"
    >
      {/* 🧪 TESTING ENDING BUTTON FOR QA (DISCRETE TOP-RIGHT) 🧪 */}
      {!isFinalAnimationActive && (
        <button
          id="qa-test-ending"
          onClick={() => {
            playConvergenceChord();
            setIsFinalAnimationActive(true);
          }}
          className="fixed top-6 right-6 z-[99999] flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer text-xs tracking-wider uppercase pointer-events-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Testing Ending
        </button>
      )}
      {/* 1. Underlying Soft Glow Background - Stays static so stars/dust don't fly off */}
      <DungeonBackground 
        selectedCharColor={selectedChar?.color}
        transitionProgress={transitionProgress}
        isTransitioning={isTransitioning}
      />

      {/* 2. Interactive Three.JS WebGL Particle & Tron Trails Canvas Layer */}
      <ThreeCanvas
        characters={characters}
        selectedChar={selectedChar}
        onSelectChar={(char) => {
          setSelectedChar(char);
          setIsTransitionComplete(false);
        }}
        onTransitionComplete={() => {
          // Keep this callback as secondary or fallback
        }}
      />

      {/* 🎥 CINEMATIC CAMERA VIEWPORT LAYER 🎥 */}
      <div
        id="camera-cinematic-viewport"
        className="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none z-20"
      >
        {/* Floating Header Label */}
        <header 
          id="top-header" 
          className="w-full max-w-7xl mx-auto px-6 pt-6 flex justify-between items-center pointer-events-auto"
          style={{
            opacity: selectedChar ? Math.max(0, 1 - transitionProgress * 3.0) : 1,
            transform: selectedChar 
              ? `translateY(${-transitionProgress * 80}px)` 
              : 'translateY(0px)',
            transition: isTransitioning ? 'none' : 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
        </header>

        {/* Main Screen Layout content strictly centered in the upper portion */}
        <main 
          id="main-content" 
          className="flex-1 w-full max-w-7xl mx-auto px-6 pt-12 pb-[38vh] flex flex-col justify-center items-center relative pointer-events-none transition-all duration-[800ms] ease-out"
          style={{
            opacity: selectedChar 
              ? Math.max(0, 1 - transitionProgress * 2.5) 
              : isFinalAnimationActive
                ? 0
                : 1,
            transform: selectedChar 
              ? `translateY(${transitionProgress * 300}px) scale(${1 - transitionProgress * 0.12})` 
              : isFinalAnimationActive
                ? 'translateY(-80px) scale(0.96)'
                : 'translateY(0px) scale(1)',
          }}
        >
          {/* Hero title block */}
          <div className="text-center max-w-3xl flex flex-col items-center">
            <h1 id="brand-title" className="text-5xl md:text-6xl font-light text-slate-600 tracking-tight leading-none mb-1 text-center font-[Product Sans] animate-title-intro">
              Gatones y Mazmorras.
            </h1>
            
            <div className="w-32 h-[1px] bg-slate-300 my-4 opacity-70 origin-center animate-line-intro" />
            
            <span id="brand-subtitle" className="text-xl md:text-2xl text-slate-400 font-light tracking-wide text-center animate-subtitle-intro">
              conoce a los heroes y villanos de la leyenda.
            </span>

            {/* Unlocked special final button: Clean, magical, suggestion-oriented */}
            {allVisited && !selectedChar && !isFinalAnimationActive && (
              <div 
                className="mt-8 pointer-events-auto flex justify-center"
                style={{
                  animation: 'fadeInSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
              >
                <button
                  onClick={() => {
                    playConvergenceChord();
                    setIsFinalAnimationActive(true);
                  }}
                  className="group relative flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-slate-300 bg-white/90 text-slate-700 hover:text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(129,140,248,0.18)] hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer text-sm font-medium uppercase tracking-wider"
                >
                  {/* Subtle pulsing background ring */}
                  <span className="absolute -inset-1 rounded-full border border-indigo-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
                  
                  <Compass className="w-4 h-4 text-slate-500 group-hover:text-indigo-500 transition-colors duration-300 animate-[spin_10s_linear_infinite]" />
                  Unir caminos
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors duration-300 animate-pulse" />
                </button>
              </div>
            )}
          </div>
        </main>


        {/* 
          Bottom Interface - Vertical Bars Base sits exactly on the bottom of the screen (0 bottom spacing).
          Fades out completely to spotlight only our rocket launch.
        */}
        <div 
          id="interactive-bottom-shelf"
          className="fixed bottom-0 left-0 right-0 flex justify-center items-end bg-gradient-to-t from-slate-100/95 via-slate-50/45 to-transparent pt-12 pb-0 px-6 pointer-events-none transition-all duration-[800ms] ease-out"
          style={{
            opacity: selectedChar 
              ? Math.max(0, 1 - transitionProgress * 1.5) 
              : 1, // Keep fully visible during final animation or normal view
            transform: selectedChar 
              ? `translateY(${transitionProgress * 180}px) scale(${1 - transitionProgress * 0.05})` 
              : 'translateY(0px) scale(1)', // Keep anchored at bottom
          }}
        >
          <div className="flex items-end justify-center gap-0.5 sm:gap-1.5 pointer-events-auto pb-0">
            {characters.map((char, index) => (
              <SoundBar
                key={char.id}
                index={index}
                character={char}
                isSelected={selectedChar?.id === char.id}
                isInteractive={!isFinalAnimationActive}
                isDimmed={selectedChar !== null && selectedChar.id !== char.id}
                isTotallyHidden={isFinalAnimationActive || (isTransitioning && selectedChar?.id === char.id)}
                onClick={() => {
                  setSelectedChar(char);
                  setIsTransitionComplete(false);
                  setIsTransitioning(true);
                  setTransitionProgress(0);
                  setAnimationId(prev => prev + 1);

                  // Instantly capture the exact dimensions of the clicked bar
                  const el = document.getElementById(`bar-main-${char.id}`);
                  if (el) {
                    const rect = el.getBoundingClientRect();
                    setClickedCoords({
                      x: rect.left + rect.width / 2,
                      y: rect.bottom,
                      startYTop: rect.top,
                      barWidth: rect.width || 36,
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive modal detail card representation - rendered immediately and manages its entry sequence with the progress */}
      {selectedChar && (
        <CharacterCard 
          character={selectedChar} 
          isTransitioning={isTransitioning}
          transitionProgress={transitionProgress}
          onClose={() => {
            setSelectedChar(null);
            setIsTransitionComplete(false);
            setIsTransitioning(false);
            setTransitionProgress(0);
          }} 
        />
      )}

      {/* 3. Real-time SVG Laser Trail Overlay - Sits on the highest visual layer on top of the card details */}
      {selectedChar && clickedCoords && (
        <TrailOverlay
          key={`${selectedChar.id}-${animationId}`}
          id={selectedChar.id}
          startX={clickedCoords.x}
          startY={clickedCoords.y}
          startYTop={clickedCoords.startYTop}
          barWidth={clickedCoords.barWidth}
          color={selectedChar.color}
          onProgress={(prog) => {
            setTransitionProgress(prog);
          }}
          onComplete={() => {
            setIsTransitioning(false);
            setIsTransitionComplete(true);
            setTransitionProgress(1);
          }}
        />
      )}

      {/* 4. Magical Final Journey Experience Stage */}
      {isFinalAnimationActive && (
        <FinalPathJourney 
          characters={characters} 
          onReset={handleResetExperience} 
        />
      )}
    </div>
  );
}
