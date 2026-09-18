import React, { useEffect, useRef, type ReactNode, type ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type RevealType = 'lines' | 'fade' | 'rise';

interface RevealProps {
  as?: ElementType;
  delay?: number;
  stagger?: number;
  type?: RevealType;
  className?: string;
  id?: string;
  children: ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({
  as: Component = 'div',
  delay = 0,
  stagger = 0.08,
  type = 'lines',
  className = '',
  id,
  children,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reduced motion fallback: plain 200ms opacity fade without movement
    if (reducedMotion) {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          delay,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            once: true,
            onEnter: () => {
              // Trigger killed automatically when once: true
            },
          },
        }
      );
      return;
    }

    const ctx = gsap.context(() => {
      if (type === 'lines') {
        const lineElements = el.querySelectorAll('.reveal-line-inner');
        if (lineElements.length > 0) {
          gsap.fromTo(
            lineElements,
            { y: '110%', opacity: 1 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.65,
              delay,
              stagger,
              ease: 'power4.out', // cubic-bezier(0.16, 1, 0.3, 1)
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                once: true,
              },
              onStart: function () {
                lineElements.forEach((node) => {
                  (node as HTMLElement).style.willChange = 'transform';
                });
              },
              onComplete: function () {
                lineElements.forEach((node) => {
                  (node as HTMLElement).style.willChange = 'auto';
                });
              },
            }
          );
        } else {
          // Fallback if no lines were marked
          gsap.fromTo(
            el,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                once: true,
              },
              onStart: () => {
                el.style.willChange = 'transform, opacity';
              },
              onComplete: () => {
                el.style.willChange = 'auto';
              },
            }
          );
        }
      } else if (type === 'rise') {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            delay,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              once: true,
            },
            onStart: () => {
              el.style.willChange = 'transform, opacity';
            },
            onComplete: () => {
              el.style.willChange = 'auto';
            },
          }
        );
      } else {
        // fade
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.55,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              once: true,
            },
            onStart: () => {
              el.style.willChange = 'opacity';
            },
            onComplete: () => {
              el.style.willChange = 'auto';
            },
          }
        );
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [delay, stagger, type, reducedMotion]);

  // Helper to split text children into line wrappers if lines requested
  const renderContent = () => {
    if (type !== 'lines') return children;

    // If string, split by newline or render cleanly
    if (typeof children === 'string') {
      const parts = children.split('\n');
      return parts.map((line, idx) => (
        <span key={idx} className="block overflow-hidden pb-0.5">
          <span className="reveal-line-inner block transform-gpu">{line}</span>
        </span>
      ));
    }

    // If array of elements or mixed, wrap in overflow-hidden
    if (React.isValidElement(children)) {
      return (
        <span className="block overflow-hidden pb-0.5">
          <span className="reveal-line-inner block transform-gpu">{children}</span>
        </span>
      );
    }

    return children;
  };

  return (
    <Component ref={containerRef} id={id} className={className}>
      {renderContent()}
    </Component>
  );
};
