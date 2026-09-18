import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../motion/useReducedMotion';

interface IntroLoaderProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export function IntroLoader({ onComplete, forceShow = false }: IntroLoaderProps) {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  // 14 squares grid coordinates representing the 3 Signal bars (3 + 5 + 6 = 14 squares)
  // bar 1 (left): 3 squares
  // bar 2 (middle): 5 squares
  // bar 3 (right, taller, accent green): 6 squares
  const glyphBlocks = [
    // Column 1 (Dark forest green) - 3 blocks
    { col: 0, row: 3, color: '#0e1f12' },
    { col: 0, row: 4, color: '#0e1f12' },
    { col: 0, row: 5, color: '#0e1f12' },
    // Column 1.5 - spacer
    // Column 2 (Dark forest green) - 5 blocks
    { col: 1, row: 1, color: '#0e1f12' },
    { col: 1, row: 2, color: '#0e1f12' },
    { col: 1, row: 3, color: '#0e1f12' },
    { col: 1, row: 4, color: '#0e1f12' },
    { col: 1, row: 5, color: '#0e1f12' },
    // Column 3 (Vibrant primary lime) - 6 blocks
    { col: 2, row: 0, color: '#35e639' },
    { col: 2, row: 1, color: '#35e639' },
    { col: 2, row: 2, color: '#35e639' },
    { col: 2, row: 3, color: '#35e639' },
    { col: 2, row: 4, color: '#35e639' },
    { col: 2, row: 5, color: '#35e639' },
  ];

  const handleFinish = useCallback(() => {
    document.body.style.overflow = '';
    setShouldRender(false);
    onComplete();
  }, [onComplete]);

  const skipToEnd = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        y: '-100%',
        scale: 1.15,
        opacity: 0,
        duration: 0.25,
        ease: 'power4.in',
        onComplete: handleFinish,
      });
    } else {
      handleFinish();
    }
  }, [handleFinish]);

  useEffect(() => {
    setMounted(true);

    if (reducedMotion) {
      sessionStorage.setItem('signal_intro_seen', 'true');
      onComplete();
      return;
    }

    const seen = sessionStorage.getItem('signal_intro_seen');
    if (seen && !forceShow) {
      onComplete();
      return;
    }

    setShouldRender(true);
    sessionStorage.setItem('signal_intro_seen', 'true');
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [forceShow, reducedMotion, onComplete]);

  // Keyboard shortcut: Escape skips immediately
  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipToEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, skipToEnd]);

  // Animation timeline setup
  useEffect(() => {
    if (!shouldRender || !overlayRef.current) return;

    const tl = gsap.timeline({
      onComplete: handleFinish,
    });
    timelineRef.current = tl;

    // Reset initial states
    const validSquares = squaresRef.current.filter(Boolean);
    gsap.set(validSquares, { opacity: 0, scale: 0.6 });
    if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });
    if (overlayRef.current) gsap.set(overlayRef.current, { y: 0, scale: 1 });

    const counterObj = { val: 0 };

    // 0.1s - Glyph assembles (14 small squares fade & scale in from 0.6, 40ms stagger)
    tl.to(
      validSquares,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power3.out',
        onStart: () => {
          validSquares.forEach((sq) => {
            if (sq) sq.style.willChange = 'transform, opacity';
          });
        },
        onComplete: () => {
          validSquares.forEach((sq) => {
            if (sq) sq.style.willChange = 'auto';
          });
        },
      },
      0.1
    );

    // 0.2s - Monospace counter runs 000 to 100 & 1px accent line sweeps left to right
    tl.to(
      counterObj,
      {
        val: 100,
        duration: 0.95,
        ease: 'power4.out', // Decelerates hard at end
        onUpdate: () => {
          if (counterRef.current) {
            const num = Math.round(counterObj.val);
            counterRef.current.textContent = num < 10 ? `00${num}` : num < 100 ? `0${num}` : '100';
          }
        },
      },
      0.2
    );

    if (lineRef.current) {
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 0.95,
          ease: 'power4.out',
          onStart: () => {
            if (lineRef.current) lineRef.current.style.willChange = 'transform';
          },
          onComplete: () => {
            if (lineRef.current) lineRef.current.style.willChange = 'auto';
          },
        },
        0.2
      );
    }

    // 1.2s - Overlay scales to 1.15 and translates to y: -100% with exit easing
    // Signature exit easing: cubic-bezier(0.7, 0, 0.84, 0) -> power4.in / expo.in
    tl.to(
      overlayRef.current,
      {
        y: '-100%',
        scale: 1.15,
        duration: 0.45,
        ease: 'power4.in',
        onStart: () => {
          if (overlayRef.current) overlayRef.current.style.willChange = 'transform';
        },
      },
      1.2
    );

    return () => {
      tl.kill();
    };
  }, [shouldRender, handleFinish]);

  if (!mounted || !shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      id="intro-loader-overlay"
      onClick={skipToEnd}
      className="fixed inset-0 z-[100] bg-white flex flex-col justify-between p-8 md:p-14 select-none cursor-pointer transform-gpu"
      title="Click anywhere or press Esc to skip"
    >
      {/* Top bar info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#35e639]"></span>
          <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#4e6351]">
            SIGNAL PROTOCOL // INTERNSHIP TRIAGE
          </span>
        </div>
        <div className="font-mono-code text-[11px] text-[#6c7b66] border border-[#bbcbb3]/40 px-2.5 py-1 rounded-full">
          ESC TO SKIP
        </div>
      </div>

      {/* Center 14-square glyph mark */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-28 h-28 flex items-end justify-center gap-2">
          {/* Column 1 (3 blocks) */}
          <div className="flex flex-col-reverse gap-1.5 w-6">
            {glyphBlocks.slice(0, 3).map((block, idx) => (
              <div
                key={`c1-${idx}`}
                ref={(el) => { squaresRef.current[idx] = el; }}
                style={{ backgroundColor: block.color }}
                className="w-6 h-6 rounded-[4px] transform-gpu"
              />
            ))}
          </div>

          {/* Column 2 (5 blocks) */}
          <div className="flex flex-col-reverse gap-1.5 w-6">
            {glyphBlocks.slice(3, 8).map((block, idx) => (
              <div
                key={`c2-${idx}`}
                ref={(el) => { squaresRef.current[3 + idx] = el; }}
                style={{ backgroundColor: block.color }}
                className="w-6 h-6 rounded-[4px] transform-gpu"
              />
            ))}
          </div>

          {/* Column 3 (6 blocks, bright lime) */}
          <div className="flex flex-col-reverse gap-1.5 w-6">
            {glyphBlocks.slice(8, 14).map((block, idx) => (
              <div
                key={`c3-${idx}`}
                ref={(el) => { squaresRef.current[8 + idx] = el; }}
                style={{ backgroundColor: block.color }}
                className="w-6 h-6 rounded-[4px] transform-gpu"
              />
            ))}
          </div>
        </div>
        <div className="mt-6 font-mono-code text-[12px] font-semibold tracking-wider text-[#0e1f12]">
          SYNTHESIZING EVIDENCE DECK
        </div>
      </div>

      {/* Bottom Counter & Accent Line */}
      <div className="relative w-full">
        <div className="flex items-end justify-between pb-3">
          <div className="flex items-baseline gap-2">
            <span
              ref={counterRef}
              className="font-mono-code text-4xl md:text-5xl font-bold tracking-tight text-[#0e1f12]"
            >
              000
            </span>
            <span className="font-mono-code text-sm text-[#4e6351]">/ 100%</span>
          </div>
          <span className="font-mono-code text-[11px] text-[#4e6351] hidden sm:inline">
            SYSTEM BOOT · HIGH-TRUST REASONING
          </span>
        </div>

        {/* 1px accent line sweeping left to right */}
        <div className="w-full h-[2px] bg-[#bbcbb3]/30 overflow-hidden relative">
          <div
            ref={lineRef}
            className="w-full h-full bg-[#35e639] transform-gpu"
          />
        </div>
      </div>
    </div>
  );
}
