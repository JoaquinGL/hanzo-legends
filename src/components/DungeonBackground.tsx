import React, { useEffect, useState } from 'react';

interface Blob {
  id: number;
  color: string;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: string;
  duration: string;
  color: string;
}

interface DungeonBackgroundProps {
  selectedCharColor?: string;
  transitionProgress?: number;
  isTransitioning?: boolean;
}

export const DungeonBackground: React.FC<DungeonBackgroundProps> = ({
  selectedCharColor,
  transitionProgress = 0,
  isTransitioning = false,
}) => {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Smooth mouse move tracking with physics inertia (lerp)
  useEffect(() => {
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const update = () => {
      // Lerp constant of 0.08 offers incredibly fluid and silky movement
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      setMousePos({ x: currentX, y: currentY });
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Generate elegant sparkling particles on mount
  useEffect(() => {
    const generated: Sparkle[] = Array.from({ length: 35 }).map((_, i) => {
      const r = Math.random();
      // Extremely delicate color palette matching character themes: soft sun gold, light celestial blue, ambient white
      let color = 'rgba(251, 188, 6, 0.65)'; // gold
      if (r < 0.35) {
        color = 'rgba(125, 211, 252, 0.7)'; // celestial sky blue
      } else if (r < 0.7) {
        color = 'rgba(255, 255, 255, 0.85)'; // pure shining white
      }

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 3, // Very tiny (1.5px to 4.5px) for micro-sparkle premium feel
        delay: `${Math.random() * 5}s`,
        duration: `${4 + Math.random() * 5}s`,
        color,
      };
    });
    setSparkles(generated);
  }, []);

  useEffect(() => {
    // Generate lovely soft ambient color blobs in the background
    const colors = [
      'rgba(251, 188, 6, 0.15)',  // william gold
      'rgba(118, 87, 0, 0.08)',   // gimlice bronze
      'rgba(52, 168, 83, 0.15)',  // robin green
      'rgba(0, 88, 189, 0.12)',   // herminice blue
      'rgba(255, 152, 0, 0.12)',  // tigri orange
    ];

    const initialBlobs: Blob[] = colors.map((color, idx) => ({
      id: idx,
      color,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 250 + Math.random() * 200,
      speedX: 0.05 + Math.random() * 0.05,
      speedY: 0.05 + Math.random() * 0.05,
    }));

    setBlobs(initialBlobs);

    // Minor physics tick to float them around
    let animId: number;
    let localBlobs = [...initialBlobs];
    
    const tick = () => {
      localBlobs = localBlobs.map(b => {
        let nx = b.x + b.speedX;
        let ny = b.y + b.speedY;

        let nSpeedX = b.speedX;
        let nSpeedY = b.speedY;

        if (nx > 100 || nx < 0) nSpeedX = -b.speedX;
        if (ny > 100 || ny < 0) nSpeedY = -b.speedY;

        return {
          ...b,
          x: nx,
          y: ny,
          speedX: nSpeedX,
          speedY: nSpeedY
        };
      });

      setBlobs(localBlobs);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div 
      id="ambient-background" 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Underlying smooth radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#f2f3fd_60%,_#d8d9e3_100%)] opacity-95" />

      {/* Reactive Mouse-Tracking Gradient Overlay (Incredibly subtle pastel hues that follow the mouse with lag-free inertia) */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}% ${mousePos.y}%, rgba(224, 231, 255, 0.35) 0%, rgba(243, 232, 255, 0.2) 35%, rgba(251, 207, 232, 0.05) 75%, transparent 100%)`
        }}
      />

      {/* Secondary micro light spot reacting directly to high frequency mouse movements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}% ${mousePos.y}%, rgba(147, 197, 253, 0.07) 0%, rgba(167, 139, 250, 0.04) 50%, transparent 100%)`
        }}
      />

      {/* Clean destiny background themed with core hero color, showing up based on transitionProgress */}
      {selectedCharColor && (
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, #ffffff 15%, ${selectedCharColor}05 45%, ${selectedCharColor}10 75%, ${selectedCharColor}18 100%)`,
            opacity: transitionProgress,
          }}
        />
      )}

      {/* Floating abstract aura blobs */}
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full filter blur-[80px]"
          style={{
            backgroundColor: blob.color,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'background-color 1s ease',
          }}
        />
      ))}

      {/* Elegant random sparkling particles */}
      {sparkles.map((sparkle) => (
        <div
          key={`sparkle-${sparkle.id}`}
          className="absolute rounded-full animate-elegant-glitter pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            boxShadow: `0 0 ${sparkle.size * 1.5}px ${sparkle.color}`,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      ))}

      {/* Retro matrix dots matrix patterns overlay for a tech style */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Embedded styles for hardware-accelerated glitter floating */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes elegant-glitter {
          0%, 100% {
            opacity: 0.08;
            transform: translateY(0px) scale(0.6) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: translateY(-14px) scale(1.25) rotate(180deg);
          }
        }
        .animate-elegant-glitter {
          animation-name: elegant-glitter;
        }
      `}} />
    </div>
  );
};
