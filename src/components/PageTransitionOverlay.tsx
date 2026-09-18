import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../motion/useReducedMotion';

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
  onHoldSwap: () => void;
  onTransitionComplete: () => void;
}

export function PageTransitionOverlay({
  isTransitioning,
  onHoldSwap,
  onTransitionComplete,
}: PageTransitionOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isTransitioning || !panelRef.current) return;

    const panel = panelRef.current;

    if (reducedMotion) {
      onHoldSwap();
      window.scrollTo(0, 0);
      onTransitionComplete();
      return;
    }

    // Master Page Transition Timeline (Total < 500ms)
    // 1. Wipe up from bottom (scaleY 0 -> 1, origin bottom, 250ms, exit easing)
    // 2. Hold 120ms while route swaps, scroll resets to top during hold
    // 3. Wipe away upward (scaleY 1 -> 0, origin top, 250ms)
    const tl = gsap.timeline({
      onComplete: () => {
        onTransitionComplete();
      },
    });

    gsap.set(panel, {
      display: 'block',
      scaleY: 0,
      transformOrigin: 'bottom center',
    });

    // Wipe Up
    tl.to(panel, {
      scaleY: 1,
      duration: 0.25,
      ease: 'power3.in',
    })
      // Hold & Route Swap
      .call(() => {
        onHoldSwap();
        window.scrollTo(0, 0);
      })
      .to({}, { duration: 0.12 }) // 120ms hold
      // Wipe away upward
      .call(() => {
        gsap.set(panel, { transformOrigin: 'top center' });
      })
      .to(panel, {
        scaleY: 0,
        duration: 0.25,
        ease: 'power3.out',
      })
      .set(panel, { display: 'none' });

    return () => {
      tl.kill();
    };
  }, [isTransitioning, onHoldSwap, onTransitionComplete, reducedMotion]);

  return (
    <div
      ref={panelRef}
      style={{ display: 'none', transform: 'scaleY(0)' }}
      className="fixed inset-0 bg-[#0e1f12] z-[9990] pointer-events-none transform-gpu will-change-transform flex items-center justify-center"
    >
      <div className="flex items-center gap-2 text-[#e1f6e1] font-mono-code text-xs tracking-widest uppercase">
        <span className="w-2 h-2 rounded-full bg-[#35e639]"></span>
        <span>SIGNAL TELEMETRY SYNC</span>
      </div>
    </div>
  );
}
