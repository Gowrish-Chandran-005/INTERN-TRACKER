import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../motion/useReducedMotion';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const cursorState = useRef<'default' | 'pointer' | 'text'>('default');
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check if mouse/desktop device and not reduced motion
    const checkEligible = () => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isLargeScreen = window.innerWidth >= 1024;
      setIsEnabled(isFinePointer && isLargeScreen && !reducedMotion);
    };

    checkEligible();
    window.addEventListener('resize', checkEligible);
    return () => window.removeEventListener('resize', checkEligible);
  }, [reducedMotion]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('input, textarea, [contenteditable="true"]')) {
        cursorState.current = 'text';
      } else if (
        target.closest('a, button, [role="button"], input[type="submit"], .cursor-pointer')
      ) {
        cursorState.current = 'pointer';
      } else {
        cursorState.current = 'default';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animateCursor = () => {
      // Dot follows at lerp 0.2
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.2;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.2;

      // Outer ring follows at lerp 0.08
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        let scaleStyle = 'scale(1)';
        if (cursorState.current === 'pointer') {
          scaleStyle = 'scale(2.5)';
        } else if (cursorState.current === 'text') {
          scaleStyle = 'scale(0.3, 1.8)';
        }

        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) ${scaleStyle}`;
      }

      rafId.current = requestAnimationFrame(animateCursor);
    };

    rafId.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Outer ring (lerp 0.08) */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-[#006e0c] transform-gpu will-change-transform transition-[border-color,opacity] duration-150"
      />

      {/* Center dot (lerp 0.2) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#006e0c] transform-gpu will-change-transform"
      />
    </div>
  );
}
