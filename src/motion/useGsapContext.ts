import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useGsapContext Hook
 * Scopes GSAP selectors to the provided ref element, runs the callback within
 * a gsap.context, and cleanly calls ctx.revert() on unmount.
 */
export function useGsapContext(
  scopeRef: RefObject<HTMLElement | null>,
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    if (!scopeRef.current) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
