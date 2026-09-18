import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';
import { useReducedMotion } from '../motion/useReducedMotion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  id,
  type = 'button',
  variant = 'primary',
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  // Springs for button outer translation
  const springX = useSpring(0, { stiffness: 300, damping: 20 });
  const springY = useSpring(0, { stiffness: 300, damping: 20 });

  // Inner label parallax springs (40% of button translation)
  const labelSpringX = useSpring(0, { stiffness: 300, damping: 20 });
  const labelSpringY = useSpring(0, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || reducedMotion || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    // Only engage within 60px distance threshold
    const threshold = 60 + Math.max(rect.width, rect.height) / 2;
    if (distance < threshold) {
      // Max 6px displacement
      const maxDisplacement = 6;
      const factor = Math.min(1, distance / threshold);
      const targetX = (deltaX / distance) * maxDisplacement * factor;
      const targetY = (deltaY / distance) * maxDisplacement * factor;

      springX.set(targetX);
      springY.set(targetY);
      labelSpringX.set(targetX * 0.4);
      labelSpringY.set(targetY * 0.4);
    }
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
    labelSpringX.set(0);
    labelSpringY.set(0);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-sans-display transition-colors select-none';
  const variantStyles = {
    primary:
      'rounded-full bg-[#35e639] text-[#0e1f12] font-bold px-7 py-3.5 hover:brightness-105 active:scale-[0.98] border border-transparent shadow-none',
    secondary:
      'rounded-full border border-[#bbcbb3]/60 bg-white text-[#0e1f12] font-semibold px-6 py-3 hover:bg-[#e4f9e3] transition-colors',
    ghost:
      'text-[#0e1f12] font-semibold hover:underline px-4 py-3 inline-flex items-center gap-1.5 transition-colors',
  }[variant];

  const content = (
    <motion.span
      style={{
        x: isDesktop && !reducedMotion ? labelSpringX : 0,
        y: isDesktop && !reducedMotion ? labelSpringY : 0,
      }}
      className="inline-flex items-center gap-2 transform-gpu"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        id={id}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: isDesktop && !reducedMotion ? springX : 0,
          y: isDesktop && !reducedMotion ? springY : 0,
        }}
        className={`${baseStyles} ${variantStyles} ${className} transform-gpu`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      id={id}
      type={type}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: isDesktop && !reducedMotion ? springX : 0,
        y: isDesktop && !reducedMotion ? springY : 0,
      }}
      className={`${baseStyles} ${variantStyles} ${className} transform-gpu`}
    >
      {content}
    </motion.button>
  );
}
