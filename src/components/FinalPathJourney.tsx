import React, { useEffect, useState, useRef } from 'react';
import { Character } from '../types';
import { RefreshCw } from 'lucide-react';

interface FinalPathJourneyProps {
  characters: Character[];
  onReset: () => void;
}

export const FinalPathJourney: React.FC<FinalPathJourneyProps> = ({
  characters,
  onReset,
}) => {
  const [time, setTime] = useState(0);
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

  // Center target location for the closing destination/logo
  const destScreenY = H * 0.35;
  const logoBottomY = destScreenY + 115;

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

      {/* Centered logo destination dropping elegantly from outside the viewport on top of the paths */}
      {showLogo && (
        <div
          className='absolute flex flex-col items-center justify-center text-center pointer-events-none bg-white border border-slate-200/80 shadow-[0_24px_50px_rgba(0,0,0,0.22),0_8px_20px_rgba(0,0,0,0.08)] rounded-2xl p-7 sm:p-10 w-[calc(100vw-32px)] max-w-[420px] z-10'
          style={{
            top: `${destScreenY}px`,
            left: '50%',
            transform: `translate(-50%, ${logoYOffset.toFixed(1)}px)`,
            opacity: logoOpacity,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {/* Subtle emblem ambient glow backplate */}
          <div className='absolute -inset-10 rounded-full bg-slate-200/5 blur-3xl pointer-events-none' />

          <div className='mb-4 flex items-center justify-center shrink-0 animate-[logoRevealScaleIn_800ms_cubic-bezier(0.16,1,0.3,1)_forwards] text-slate-950'>
            <svg
              width='72'
              height='12'
              viewBox='0 0 72 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='h-3 w-auto sm:hidden'
              aria-hidden
            >
              <path d='M2 0V12' stroke='currentColor' strokeWidth='4' />
              <path d='M70 0V12' stroke='currentColor' strokeWidth='4' />
              <path d='M70 6H2' stroke='currentColor' strokeWidth='4' />
            </svg>
            <svg
              aria-labelledby='hanzoLogoSmall'
              xmlns='http://www.w3.org/2000/svg'
              width='67'
              height='15'
              viewBox='0 0 67 15'
              fill='none'
              className='hidden h-3.5 w-auto sm:block md:hidden'
            >
              <title id='hanzoLogoSmall'>Hanzo logo</title>
              <path d='M3 7.5H65' stroke='currentColor' strokeWidth='5' />
              <path d='M64.5 15V0' stroke='currentColor' strokeWidth='5' />
              <path d='M2.5 15V0' stroke='currentColor' strokeWidth='5' />
            </svg>
            <svg
              aria-labelledby='hanzoLogoMedium'
              xmlns='http://www.w3.org/2000/svg'
              width='96'
              height='17'
              viewBox='0 0 96 17'
              fill='none'
              className='hidden h-4 w-auto md:block lg:hidden'
            >
              <title id='hanzoLogoMedium'>Hanzo logo</title>
              <path d='M2 8.5H92.7042' stroke='currentColor' strokeWidth='5' />
              <path d='M93.3521 17V0' stroke='currentColor' strokeWidth='5' />
              <path d='M2.64789 17V0' stroke='currentColor' strokeWidth='5' />
            </svg>
            <svg
              aria-labelledby='hanzoLogoLarge'
              xmlns='http://www.w3.org/2000/svg'
              width='114'
              height='20'
              viewBox='0 0 114 20'
              fill='none'
              className='hidden h-5 w-auto lg:block'
            >
              <title id='hanzoLogoLarge'>Hanzo logo</title>
              <path d='M6 10H108' stroke='currentColor' strokeWidth='6' />
              <path d='M111 20V0' stroke='currentColor' strokeWidth='6' />
              <path d='M3 20V0' stroke='currentColor' strokeWidth='6' />
            </svg>
          </div>

          <h2
            className='text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-none mb-2 text-center whitespace-nowrap'
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              animation:
                'logoRevealSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards',
              opacity: 0,
            }}
          >
            Hanzo Legends.
          </h2>

          <p
            className='text-slate-500 font-medium tracking-widest uppercase text-[9px] sm:text-[10px] whitespace-nowrap mb-2'
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              animation:
                'logoRevealSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 600ms forwards',
              opacity: 0,
            }}
          >
            — capítulo final : la unión de caminos —
          </p>

          <div
            className='w-12 h-[1px] bg-slate-200/80 my-2 self-center'
            style={{
              animation:
                'logoRevealSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 700ms forwards',
              opacity: 0,
            }}
          />

          <span
            className='text-[10px] sm:text-[11px] text-slate-600 font-sans tracking-wide max-w-sm block leading-relaxed'
            style={{
              fontFamily: '"Inter", sans-serif',
              animation:
                'logoRevealSlideUp 800ms cubic-bezier(0.16, 1, 0.3, 1) 950ms forwards',
              opacity: 0,
            }}
          >
            Has recorrido todos los senderos de la leyenda. La hermandad ha
            unificado sus vibraciones para dar paso al nuevo amanecer.
          </span>
        </div>
      )}

      {/* Repeat experience button container on top of everything */}
      <div
        className='absolute bottom-16 z-[120] flex flex-col items-center justify-center transition-all duration-700 pointer-events-auto'
        style={{
          opacity: isFinished ? 1 : 0,
          transform: isFinished
            ? 'translateY(0) scale(1)'
            : 'translateY(20px) scale(0.95)',
          pointerEvents: isFinished ? 'auto' : 'none',
        }}
      >
        <button
          onClick={onReset}
          className='flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white/95 text-slate-700 hover:text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:border-slate-400 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 font-sans text-xs font-semibold uppercase tracking-wider'
        >
          <RefreshCw className='w-3 h-3 animate-spin-reverse' />
          Repetir experiencia
        </button>
      </div>

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
