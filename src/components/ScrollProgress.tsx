import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../motion/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!barRef.current || reducedMotion) return;

    const bar = barRef.current;
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[999] pointer-events-none bg-transparent">
      <div
        ref={barRef}
        className="w-full h-full bg-[#35e639] transform-gpu will-change-transform"
      />
    </div>
  );
}
