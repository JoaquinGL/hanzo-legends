import React, { useEffect, useState, useRef } from 'react';
import { Character } from '../types';
import { RefreshCw, X } from 'lucide-react';
import finalImage from '../assets/images/final.png';

const FINAL_DESCRIPTION = [
  'Nacido de la unión de Cloud y Hanzo para convertirse en el guardián absoluto, la fusión definitiva entre espada y tormenta.',
  'En él conviven dos fuerzas inseparables: la precisión samurái del detalle y la potencia disruptiva de la nube que escala sin límites.',
  'No trabaja dentro del sistema, lo atraviesa actuando simultáneamente en todos los niveles del tablero, estrategia, experiencia y ejecución.',
  'Dicen los veteranos que no es un personaje, es un late game event que aparece cuando el producto está en apuros, y aun así lo resuelve en un solo turno crítico.',
];

interface FinalPathJourneyProps {
  characters: Character[];
  onClose: () => void;
  onReset: () => void;
}

export const FinalPathJourney: React.FC<FinalPathJourneyProps> = ({
  characters,
  onClose,
  onReset,
}) => {
  const [time, setTime] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  const [startCoords, setStartCoords] = useState<
    {
      x: number;
      y: number;
      yTop: number;
      width: number;
    }[]
  >([]);

  const N = characters.length;
  // Total experience duration is 7.5 seconds for a cinematic, breathing pace
  const TOTAL_DURATION = 7500;

  // Capture precise positions of the active SoundBar nodes
  useEffect(() => {
    const updateCoords = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const coords = characters.map((char, index) => {
        const el = document.getElementById(`bar-main-${char.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.bottom,
            yTop: rect.top,
            width: rect.width || 36,
          };
        }
        const step = W / (N + 1);
        return {
          x: step * (index + 1),
          y: H,
          yTop: H * 0.85,
          width: 36,
        };
      });
      setStartCoords(coords);
    };

    updateCoords();
    const timer = setTimeout(updateCoords, 40);

    window.addEventListener('resize', updateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCoords);
    };
  }, [characters, N]);

  // RequestAnimationFrame high precision countdown loop
  useEffect(() => {
    let active = true;
    const tick = (now: number) => {
      if (!active) return;
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      const elapsed = now - startTimeRef.current;
      const current = Math.min(elapsed, TOTAL_DURATION);
      setTime(current);

      if (elapsed < TOTAL_DURATION) {
        requestRef.current = requestAnimationFrame(tick);
      }
    };

    requestRef.current = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(requestRef.current);
    };
  }, [TOTAL_DURATION]);

  const elapsedSec = time / 1000;
  const W = window.innerWidth;
  const H = window.innerHeight;

  // Vertically centered closing card — paths converge near its upper edge
  const FINAL_CARD_HEIGHT_EST = 560;
  const cardTopY = H * 0.5 - FINAL_CARD_HEIGHT_EST / 2;
  const logoBottomY = cardTopY + 105;

  // HIGH PRECISION VIEWPORT CO-ORIENTATION & CAMERA ASCENT TIMER:
  // - Starts climbing at t = 0.2s and reaches 88% of centering at t = 4.2s (momentum stage where ribbons almost reach top).
  // - At t = 4.2s, the card begins to descend. During this 1.2s glide, the camera pulls the remaining 12% with quadratic ease-out.
  // - This ensures the camera is ALWAYS smoothly and dynamically drifting, coming to rest precisely when the card lands!
  let cameraProgress = 0;
  if (elapsedSec > 0.2) {
    if (elapsedSec < 4.2) {
      const p1 = (elapsedSec - 0.2) / 4.0;
      cameraProgress = 0.88 * Math.pow(p1, 3.5);
    } else if (elapsedSec < 5.4) {
      const p2 = (elapsedSec - 4.2) / 1.2;
      const easeOut = 1 - Math.pow(1 - p2, 2); // Smooth quadratic ease-out
      cameraProgress = 0.88 + 0.12 * easeOut;
    } else {
      cameraProgress = 1.0;
    }
  }

  // Define the target Y in viewport coordinates dynamically as the camera rises.
  // - When cameraProgress is 0, the target is located high above screen (-H * 0.7), so the paths shoot upward first.
  // - As cameraProgress approaches 1.0, the target moves down to logoBottomY, revealing the convergence point elegantly.
  const currentTargetY = -H * 0.7 + (logoBottomY - -H * 0.7) * cameraProgress;

  // Purely deterministic parametric curve calculations (completely static shape once drawn!)
  const getPointAtU = (
    u: number,
    i: number,
    coord: { x: number; y: number; yTop: number },
    targetYVal: number,
  ) => {
    const startX = coord.x;
    const startYTop = coord.yTop;
    const targetX = W / 2;

    // Direct upward vertical translation
    const y = startYTop + (targetYVal - startYTop) * u;

    // Linear horizontal interpolation towards center axis
    const baseX = startX + (targetX - startX) * u;

    // Envelope constraint to keep start (u=0) and end (u=1) perfectly anchored
    const envelope = Math.sin(u * Math.PI);

    // Common central axis orbital rotation around W / 2 (convergencia orbital)
    const orbitalAngle = i * ((Math.PI * 2) / N) + u * Math.PI * 1.55;

    // Orbit radius swells outward slightly and closes to 0 at ends
    const maxRadius = W * 0.11;
    const orbitalRadius = maxRadius * envelope;

    // Pre-calculated scenic random curves (fully static, zero time variables!)
    const freq1 = 2.0 * Math.PI + i * 0.35;
    const freq2 = 4.0 * Math.PI - i * 0.22;
    const wave1 = Math.sin(u * freq1) * (W * 0.038);
    const wave2 = Math.cos(u * freq2) * (W * 0.012);
    const organicDeviation = (wave1 + wave2) * envelope;

    // Combine base connection, orbital rotation, and organic detours
    const x = baseX + Math.cos(orbitalAngle) * orbitalRadius + organicDeviation;

    return { x, y };
  };

  // Generate paths matching the soundbar base layout precisely with zero gaps
  const renderedPaths = characters.map((char, i) => {
    const coord = startCoords[i];
    if (!coord) return { d: '', color: char.color, width: 36, opacity: 0 };

    const points: string[] = [];
    const step = 0.008; // High precision segment counts

    // Flight progress parameters:
    // - Staggered takeoff delay is very tight (30ms per ribbon)
    const delay = i * 0.03;
    const activeSec = Math.max(0, elapsedSec - delay);

    // Smooth dual-phase ribbon growth matching the camera interpolation completely!
    let maxU = 0;
    if (elapsedSec < 4.2) {
      if (activeSec > 0) {
        const pU = Math.min(1, activeSec / 4.0);
        maxU = pU * 0.88;
      }
    } else if (elapsedSec < 5.4) {
      const pU2 = (elapsedSec - 4.2) / 1.2;
      const easeOutU = 1 - Math.pow(1 - pU2, 2); // Smooth quadratic ease-out
      maxU = 0.88 + 0.12 * easeOutU;
    } else {
      maxU = 1.0;
    }

    // Chimney base: locks ribbon start perfectly at the soundbar bottom to prevent gaps
    points.push(`${coord.x.toFixed(1)},${H.toFixed(1)}`);
    points.push(`${coord.x.toFixed(1)},${coord.yTop.toFixed(1)}`);

    // Parametric coordinates traced behind the ribbon head
    if (maxU > 0) {
      for (let u = 0; u <= maxU; u += step) {
        const { x, y } = getPointAtU(u, i, coord, currentTargetY);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      const { x, y } = getPointAtU(maxU, i, coord, currentTargetY);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    const d = `M ${points.join(' L ')}`;

    // Keep final paths fully visible and atmospheric without fade-out
    const opacity = 0.95;

    return {
      d,
      color: char.color,
      width: coord.width,
      opacity,
    };
  });

  // LOGO DROPPING TIMING BLOCK:
  // - Starts dropping from above the screen at t = 4.2 seconds (exactly when camera has settled and strips re-centered).
  // - Lands with a fluid, smooth and direct 1.2-second quartic ease-out descent.
  const logoStartSec = 4.2;
  const logoEndSec = 5.4;
  const showLogo = elapsedSec >= logoStartSec;
  let logoYOffset = -550; // Starts completely out of the viewport
  let logoOpacity = 0;

  if (showLogo) {
    const pLogo = Math.min(
      1,
      (elapsedSec - logoStartSec) / (logoEndSec - logoStartSec),
    );
    const easeLogo = 1 - Math.pow(1 - pLogo, 4); // Quartic ease-out descent
    logoYOffset = -550 * (1 - easeLogo);
    logoOpacity = 1.0;
  }

  // Display replay/retry action button after the logo card is fully presented and settled
  const isFinished = elapsedSec >= 5.6;

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const maxTilt = 8;

    setTilt({
      x: -y * maxTilt,
      y: x * maxTilt,
      active: true,
    });
  };

  const handleImageMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  return (
    <div
      id='final-path-journey-root'
      className='fixed inset-0 w-full h-full z-[100] bg-transparent flex flex-col justify-center items-center overflow-hidden pointer-events-none select-none'
    >
      {/* High fidelity static trace lines overlay */}
      <div className='absolute inset-0 w-full h-full pointer-events-none z-0'>
        <svg className='absolute inset-0 w-full h-full block overflow-visible pointer-events-none'>
          {renderedPaths.map((path, idx) => {
            if (!path.d) return null;

            return (
              <g
                key={`final-strip-path-${idx}`}
                style={{ opacity: path.opacity }}
                className='transition-opacity duration-300'
              >
                {/* Visual glow backdrop aura */}
                <path
                  d={path.d}
                  fill='none'
                  stroke={path.color}
                  strokeWidth={path.width * 1.25}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='opacity-20 blur-[5px]'
                />

                {/* Main continuous high resolution ribbon matching the bar shapes */}
                <path
                  d={path.d}
                  fill='none'
                  stroke={path.color}
                  strokeWidth={path.width}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='opacity-95'
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Backdrop: click outside to close */}
      {showLogo && (
        <div
          className='fixed inset-0 z-[5] pointer-events-auto bg-slate-950/35 backdrop-blur-[2px]'
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Centered logo destination dropping elegantly from outside the viewport on top of the paths */}
      {showLogo && (
        <div
          id='final-card-container'
          className='fixed inset-0 flex items-center justify-center px-4 sm:px-6 z-10 pointer-events-none overflow-x-hidden'
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            id='final-card-body'
            className='relative flex flex-col md:flex-row items-stretch md:items-stretch gap-5 md:gap-6 lg:gap-10 bg-white border border-slate-200/80 shadow-[0_24px_50px_rgba(0,0,0,0.22),0_8px_20px_rgba(0,0,0,0.08)] rounded-2xl w-full max-w-[900px] md:max-w-[960px] min-w-0 max-h-[calc(100vh-32px)] px-4 xs:px-6 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-14 overflow-hidden pointer-events-auto'
            style={{
              transform: `translateY(${logoYOffset.toFixed(1)}px)`,
              opacity: logoOpacity,
              fontFamily: '"Space Grotesk", sans-serif',
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <div className='absolute -inset-10 rounded-full bg-slate-200/5 blur-3xl pointer-events-none' />

          <button
            type='button'
            onClick={onClose}
            className='absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 active:scale-95 transition-colors p-2 z-20 flex items-center justify-center cursor-pointer'
            aria-label='Cerrar'
          >
            <X className='w-7 h-7 stroke-[2]' />
          </button>

          {/* Illustration with 3D tilt on hover — fixed, no scroll */}
          <div
            className='relative w-full max-w-full md:w-[46%] lg:w-[48%] shrink-0 min-w-0 flex items-center justify-center overflow-x-hidden overflow-y-visible cursor-pointer select-none pb-12 md:pb-0 md:self-center'
            style={{ perspective: '1000px' }}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
          >
            <div
              className='flex w-full max-w-full items-center justify-center overflow-hidden md:overflow-visible pointer-events-none p-1 sm:p-2 md:p-3'
              style={{
                transform: tilt.active
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transition: tilt.active
                  ? 'transform 0.1s ease-out'
                  : 'transform 0.6s cubic-bezier(0.25, 1, 0.4, 1)',
                transformOrigin: 'center center',
              }}
            >
              <img
                src={finalImage}
                alt='El Samurai de la Nube'
                className='max-h-[min(220px,34vh)] xs:max-h-[min(260px,38vh)] sm:max-h-[min(300px,40vh)] md:max-h-[min(520px,calc(100vh-280px))] lg:max-h-[min(560px,calc(100vh-260px))] max-w-full w-auto h-auto object-contain object-center pointer-events-auto animate-[logoRevealScaleIn_800ms_cubic-bezier(0.16,1,0.3,1)_forwards]'
              />
            </div>
          </div>

          {/* Text column — title + description scroll; footer button fixed */}
          <div className='flex flex-col flex-1 min-w-0 min-h-0 w-full max-w-full text-left pb-12 md:pb-0'>
            <div
              className='flex-1 min-h-0 overflow-x-hidden overflow-y-auto scrollbar-thin pr-1 -mr-1 pb-16 md:pb-0'
            >
              <h2
                className='text-4xl sm:text-[2.5rem] md:text-3xl font-headline font-semibold text-slate-800 tracking-tight leading-tight shrink-0 mb-4 md:mb-3 pr-10'
                style={{
                  animation:
                    'logoRevealSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards',
                  opacity: 0,
                }}
              >
                El Samurai de la Nube
              </h2>

              <div
                className='text-slate-600 leading-relaxed text-base md:text-xs md:leading-snug mb-10 md:mb-0'
                style={{
                  animation:
                    'logoRevealSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 600ms forwards',
                  opacity: 0,
                }}
              >
                {FINAL_DESCRIPTION.map((paragraph, index) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className={index > 0 ? 'mt-2' : ''}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div
              className='w-full flex flex-col items-start shrink-0 pt-5 md:pt-6 transition-all duration-700'
              style={{
                opacity: isFinished ? 1 : 0,
                transform: isFinished
                  ? 'translateY(0) scale(1)'
                  : 'translateY(10px) scale(0.98)',
                pointerEvents: isFinished ? 'auto' : 'none',
              }}
            >
              <button
                onClick={onReset}
                className='flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 font-sans text-base md:text-xs font-semibold uppercase tracking-wider'
              >
                <RefreshCw className='w-3 h-3 animate-spin-reverse' />
                Repetir experiencia
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes logoRevealScaleIn {
          0% {
            transform: scale(0.75);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes logoRevealSlideUp {
          0% {
            transform: translateY(12px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `,
        }}
      />
    </div>
  );
};
