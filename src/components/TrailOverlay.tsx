import React, { useEffect, useRef, useState } from 'react';

interface TrailOverlayProps {
  id: string; // Recibe la ID para trazar un camino único por personaje
  startX: number;
  startY: number;
  startYTop: number;
  barWidth: number;
  color: string;
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

export const TrailOverlay: React.FC<TrailOverlayProps> = ({
  id,
  startX,
  startY,
  startYTop,
  barWidth,
  color,
  onComplete,
  onProgress,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const dummyFlightRef = useRef<SVGPathElement>(null);
  const cameraLayerRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  // Dimensiones responsivas del escenario
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

  // Sizing locks perfectly with CharacterCard for flawless visual continuity
  const isDesktop = dimensions.width >= 768;
  const cardW = isDesktop ? 840 : (dimensions.width - 32);
  const cardH = isDesktop ? 580 : 540;

  const x0 = cx - cardW / 2;
  const x1 = cx + cardW / 2;
  const y0 = cy - cardH / 2;
  const y2 = cy + cardH / 2;
  const vLimit = startYTop - 80;
  // Start below the visible bar base so the round linecap is clipped by the viewport edge
  const trailStartY = startY + barWidth / 2 + 2;
  const verticalPrefixLength = Math.abs(vLimit - trailStartY);
  const STEM_PHASE = 0.07; // ~300ms stem growth before the random flight path continues

  // Define persistent camera scroll offset
  const Y_offset = -dimensions.height * 1.3;
  const y0_world = y0 + Y_offset;
  const y2_world = y2 + Y_offset;

  const pathParamsRef = useRef<{
    style: 'loop-left' | 'loop-right' | 'double-wave-left' | 'double-wave-right' | 'swoop-left' | 'swoop-right' | 'tornado';
    vars: Record<string, number>;
  } | null>(null);

  if (!pathParamsRef.current) {
    const styles = [
      'loop-left',
      'loop-right',
      'double-wave-left',
      'double-wave-right',
      'swoop-left',
      'swoop-right',
      'tornado'
    ] as const;
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    
    const vars: Record<string, number> = {};
    for (let i = 1; i <= 12; i++) {
      vars[`r${i}`] = Math.random() * 2 - 1; // Valores entre -1 y 1
    }
    pathParamsRef.current = { style: randomStyle, vars };
  }

  // Flight Path (Dynamically randomized yet viewport-bound per click mount)
  const getFlightPathData = (): string => {
    const prefix = `M ${startX} ${trailStartY} L ${startX} ${vLimit}`;
    if (!pathParamsRef.current) return `${prefix} L ${x1} -200`;

    const { style, vars } = pathParamsRef.current;
    
    const r1 = vars.r1;
    const r2 = vars.r2;
    const r3 = vars.r3;
    const r4 = vars.r4;
    const r5 = vars.r5;
    const r6 = vars.r6;
    const r7 = vars.r7;
    const r8 = vars.r8;
    const r9 = vars.r9;
    const r10 = vars.r10;
    const r11 = vars.r11;
    const r12 = vars.r12;

    switch (style) {
      case 'loop-left':
        return `${prefix} ` +
          `C ${startX - 180 + r1*40} ${vLimit - 40 + r2*20}, ${startX - 300 + r3*50} ${vLimit - 100 + r4*30}, ${startX - 250 + r5*50} ${vLimit - 150 + r6*30} ` +
          `C ${startX - 200 + r7*50} ${vLimit - 250 + r8*30}, ${startX + 150 + r9*60} ${vLimit - 300 + r10*40}, ${cx + 80 + r11*60} ${vLimit - 380 + r12*40} ` +
          `C ${cx + 250 + r1*60} ${vLimit - 500 + r2*40}, ${x1 + 100 + r3*40} ${-150 + r4*35}, ${x1} -200`;

      case 'loop-right':
        return `${prefix} ` +
          `C ${startX + 180 + r1*40} ${vLimit - 40 + r2*20}, ${startX + 300 + r3*50} ${vLimit - 100 + r4*30}, ${startX + 250 + r5*50} ${vLimit - 150 + r6*30} ` +
          `C ${startX + 200 + r7*50} ${vLimit - 250 + r8*30}, ${startX - 150 + r9*60} ${vLimit - 300 + r10*40}, ${cx - 80 + r11*60} ${vLimit - 380 + r12*40} ` +
          `C ${cx - 200 + r1*60} ${vLimit - 500 + r2*40}, ${x1 + 80 + r3*40} ${-150 + r4*35}, ${x1} -200`;

      case 'double-wave-left':
        return `${prefix} ` +
          `C ${startX - 120 + r1*30} ${vLimit - 60}, ${startX - 220 + r2*30} ${vLimit - 130}, ${startX - 180 + r3*40} ${vLimit - 200 + r4*30} ` +
          `C ${startX - 140 + r5*30} ${vLimit - 270}, ${startX + 140 + r6*40} ${vLimit - 330}, ${startX + 180 + r7*40} ${vLimit - 400 + r8*30} ` +
          `C ${startX + 220 + r9*40} ${vLimit - 470}, ${x1 + 60} ${-160 + r10*30}, ${x1} -200`;

      case 'double-wave-right':
        return `${prefix} ` +
          `C ${startX + 120 + r1*30} ${vLimit - 60}, ${startX + 220 + r2*30} ${vLimit - 130}, ${startX + 180 + r3*40} ${vLimit - 200 + r4*30} ` +
          `C ${startX + 140 + r5*30} ${vLimit - 270}, ${startX - 140 + r6*40} ${vLimit - 330}, ${startX - 180 + r7*40} ${vLimit - 400 + r8*30} ` +
          `C ${startX - 220 + r9*40} ${vLimit - 470}, ${x1 + 60} ${-160 + r10*30}, ${x1} -200`;

      case 'swoop-left':
        return `${prefix} ` +
          `C ${startX - 150 + r1*40} ${vLimit - 40}, ${startX - 280 + r2*50} ${vLimit - 90}, ${startX - 300 + r3*60} ${vLimit - 150 + r4*40} ` +
          `C ${startX - 320 + r5*60} ${vLimit - 220}, ${cx - 280 + r6*60} ${vLimit - 350}, ${cx - 150 + r7*50} ${vLimit - 420 + r8*40} ` +
          `C ${cx - 50 + r9*50} ${vLimit - 490}, ${x1 + 120} -120, ${x1} -200`;

      case 'swoop-right':
        return `${prefix} ` +
          `C ${startX + 150 + r1*40} ${vLimit - 40}, ${startX + 280 + r2*50} ${vLimit - 90}, ${startX + 300 + r3*60} ${vLimit - 150 + r4*40} ` +
          `C ${startX + 320 + r5*60} ${vLimit - 220}, ${cx + 280 + r6*60} ${vLimit - 350}, ${cx + 150 + r7*50} ${vLimit - 420 + r8*40} ` +
          `C ${cx + 50 + r9*50} ${vLimit - 490}, ${x1 + 120} -120, ${x1} -200`;

      case 'tornado':
      default:
        return `${prefix} ` +
          `C ${startX + 100 + r1*30} ${vLimit - 50}, ${startX - 100 + r2*30} ${vLimit - 120}, ${startX - 50 + r3*30} ${vLimit - 180 + r4*20} ` +
          `C ${startX + 200 + r5*40} ${vLimit - 240}, ${cx - 100 + r6*40} ${vLimit - 300}, ${cx + 120 + r7*40} ${vLimit - 360 + r8*30} ` +
          `C ${cx + 320 + r9*50} ${vLimit - 420}, ${x1 - 10} ${-140 + r10*20}, ${x1} -200`;
    }
  };

  const getDynamicUnifiedPathData = (currCameraY: number, currTranslateY: number): string => {
    const flightPath = getFlightPathData();
    const y0_w = y0 + currTranslateY + currCameraY;
    const y2_w = y2 + currTranslateY + currCameraY;

    // Beautiful curve connecting (x1, -200) to (cx, y2_w)
    const transitionCurve = `C ${x1 - 80} -100, ${cx - 120} ${y2_w + 120}, ${cx} ${y2_w}`;

    // Wraps the card exactly at its world position
    const R = 24;
    const wrapContour = `L ${x1 - R} ${y2_w} ` +
                        `Q ${x1} ${y2_w} ${x1} ${y2_w - R} ` +
                        `L ${x1} ${y0_w + R} ` +
                        `Q ${x1} ${y0_w} ${x1 - R} ${y0_w} ` +
                        `L ${x0 + R} ${y0_w} ` +
                        `Q ${x0} ${y0_w} ${x0} ${y0_w + R} ` +
                        `L ${x0} ${y2_w - R} ` +
                        `Q ${x0} ${y2_w} ${x0 + R} ${y2_w} ` +
                        `L ${cx} ${y2_w}`;

    return `${flightPath} ${transitionCurve} ${wrapContour}`;
  };

  const getDynamicFlightAndTransitionData = (currCameraY: number, currTranslateY: number): string => {
    const flightPath = getFlightPathData();
    const y2_w = y2 + currTranslateY + currCameraY;
    const transitionCurve = `C ${x1 - 80} -100, ${cx - 120} ${y2_w + 120}, ${cx} ${y2_w}`;
    return `${flightPath} ${transitionCurve}`;
  };

  const initialTranslateY = -dimensions.height - 150;
  const initialUnifiedPathD = getDynamicUnifiedPathData(0, initialTranslateY);
  const initialFlightAndTransitionD = getDynamicFlightAndTransitionData(0, initialTranslateY);

  // Unified high fidelity animation
  useEffect(() => {
    // Cubic-bezier solver for high-fidelity custom easing curves
    const solveCubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
      return (x: number) => {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        let t = x;
        // Newton-Raphson iteration to solve for parametric t
        for (let i = 0; i < 8; i++) {
          const currentX = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
          const derivativeX = 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
          if (Math.abs(derivativeX) < 1e-6) break;
          t -= (currentX - x) / derivativeX;
        }
        return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
      };
    };

    const cameraBezier = solveCubicBezier(0.45, 0, 0.85, 1);

    const getStemReveal = (normalizedT: number) => {
      if (normalizedT >= STEM_PHASE) return 1;
      const p = normalizedT / STEM_PHASE;
      return 1 - Math.pow(1 - p, 3);
    };

    const applyFrame = (normalizedT: number) => {
      const t = Math.min(Math.max(normalizedT, 0), 1);

      // Camera Y position: completely smooth progressive cubic-bezier ease
      const t_start = 0.15;
      const t_end = 0.95;
      let cameraY = 0;
      if (t < t_start) {
        cameraY = 0;
      } else if (t <= t_end) {
        const pt = (t - t_start) / (t_end - t_start);
        const ease = cameraBezier(pt);
        cameraY = ease * Y_offset;
      } else {
        cameraY = Y_offset;
      }

      // Card Translate Y
      let cardTranslateY = 0;
      if (t < 0.45) {
        cardTranslateY = -dimensions.height - 150;
      } else if (t <= 0.80) {
        const p_card = (t - 0.45) / 0.35;
        const ease = 1 - Math.pow(1 - p_card, 3); // smooth cubic ease-out
        cardTranslateY = (-dimensions.height - 150) * (1 - ease);
      } else {
        cardTranslateY = 0;
      }

      // Generate accurate dynamic frames based on real-time layout
      const currentUnifiedD = getDynamicUnifiedPathData(cameraY, cardTranslateY);
      const currentFlightAndTransitionD = getDynamicFlightAndTransitionData(cameraY, cardTranslateY);

      if (pathRef.current) {
        pathRef.current.setAttribute('d', currentUnifiedD);
      }
      if (dummyFlightRef.current) {
        dummyFlightRef.current.setAttribute('d', currentFlightAndTransitionD);
      }

      // Measure lengths dynamically on first execution on the current layout
      let totalLength = 5000;
      let flightLength = 2000;
      let flightFraction = 0.45;

      if (pathRef.current) {
        totalLength = pathRef.current.getTotalLength() || 5000;
      }
      if (dummyFlightRef.current) {
        flightLength = dummyFlightRef.current.getTotalLength() || 2000;
      }
      if (totalLength > 0) {
        flightFraction = flightLength / totalLength;
      }

      const verticalFraction = totalLength > 0
        ? Math.min(verticalPrefixLength / totalLength, flightFraction)
        : 0;

      const stemReveal = verticalFraction * getStemReveal(t);

      // Drawing progress function: completely continuous
      let drawProgress = 0;
      if (t <= 0.45) {
        const p = t / 0.45;
        drawProgress = p * flightFraction;
      } else if (t <= 0.80) {
        const p = (t - 0.45) / 0.35;
        const ease = 1.0 - Math.pow(1.0 - p, 3); // beautiful cubic ease-out matching card settle
        drawProgress = flightFraction + ease * (1.0 - flightFraction);
      } else {
        drawProgress = 1.0;
      }

      drawProgress = Math.max(stemReveal, drawProgress);

      // Apply camera translate transform to the whole world container
      if (cameraLayerRef.current) {
        cameraLayerRef.current.style.transform = `translateY(${-cameraY}px)`;
      }

      // Direct DOM style and attributes injection
      if (pathRef.current) {
        pathRef.current.style.strokeDasharray = `${totalLength}`;
        pathRef.current.style.strokeDashoffset = `${totalLength - drawProgress * totalLength}`;
      }

      if (onProgressRef.current) {
        onProgressRef.current(t);
      }

      return t;
    };

    let animId: number;
    const startTime = performance.now();
    const duration = 4200; // Indiana Jones high fidelity journey of 4.2s

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = applyFrame(elapsed / duration);

      if (t < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current();
      }
    };

    applyFrame(0);
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [id, dimensions.height, cx, startX, Y_offset, y0, y2, x0, x1, verticalPrefixLength, STEM_PHASE]);

  const activeStrokeWidth = barWidth;

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none z-[50] overflow-hidden"
      id="transition-overlay-container"
    >
      {/* Cinematic Camera Viewport Container */}
      <div
        ref={cameraLayerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: `translateY(0px)`, transition: 'none' }}
      >
        <svg className="w-full h-full block overflow-visible">
          <path
            ref={pathRef}
            d={initialUnifiedPathD}
            fill="none"
            stroke={color}
            strokeWidth={activeStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: '5000',
              strokeDashoffset: '5000',
            }}
          />

          {/* Dummy path for measuring flight fraction */}
          <path
            ref={dummyFlightRef}
            d={initialFlightAndTransitionD}
            fill="none"
            stroke="none"
            style={{ display: 'none' }}
          />
        </svg>
      </div>
    </div>
  );
};
