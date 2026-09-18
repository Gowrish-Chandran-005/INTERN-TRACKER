import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowForward, ArrowDownward, CheckCircle, Info, Link as LinkIcon, ShieldCheck } from './Icons';
import { MagneticButton } from './MagneticButton';
import { useReducedMotion } from '../motion/useReducedMotion';

interface HeroSectionProps {
  introFinished: boolean;
  onTriageClick: () => void;
  onExploreClick: () => void;
}

export function HeroSection({
  introFinished,
  onTriageClick,
  onExploreClick,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const highlightBlockRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const trustRowRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const floatingGlyphRef = useRef<HTMLDivElement>(null);

  // Gradient blobs
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: window.innerWidth / 2, y: 300 });
  const blob1Pos = useRef({ x: window.innerWidth / 2, y: 300 });
  const blob2Pos = useRef({ x: window.innerWidth / 2, y: 300 });
  const rafId = useRef<number | null>(null);

  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Ambient mouse-following blobs with heavy lerp (factor 0.02)
  useEffect(() => {
    if (!isDesktop || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animateBlobs = () => {
      // Lerp blob 1
      blob1Pos.current.x += (mousePos.current.x - blob1Pos.current.x) * 0.02;
      blob1Pos.current.y += (mousePos.current.y - blob1Pos.current.y) * 0.02;

      // Lerp blob 2 with slight offset to drift apart
      blob2Pos.current.x += (mousePos.current.x - 80 - blob2Pos.current.x) * 0.015;
      blob2Pos.current.y += (mousePos.current.y + 60 - blob2Pos.current.y) * 0.015;

      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate3d(${blob1Pos.current.x - 200}px, ${blob1Pos.current.y - 200}px, 0)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate3d(${blob2Pos.current.x - 180}px, ${blob2Pos.current.y - 180}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animateBlobs);
    };

    rafId.current = requestAnimationFrame(animateBlobs);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isDesktop, reducedMotion]);

  // Master Hero Timeline chaining off intro loader
  useEffect(() => {
    if (!introFinished || !heroRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          [
            headlineLine1Ref.current,
            headlineLine2Ref.current,
            chipRef.current,
            subcopyRef.current,
            ctaRowRef.current,
            trustRowRef.current,
            previewCardRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        if (highlightBlockRef.current) {
          gsap.set(highlightBlockRef.current, { scaleX: 1 });
        }
        return;
      }

      // Initial state
      gsap.set([headlineLine1Ref.current, headlineLine2Ref.current], { y: '110%', opacity: 1 });
      gsap.set(highlightBlockRef.current, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set([chipRef.current, subcopyRef.current], { y: 16, opacity: 0 });
      gsap.set([ctaRowRef.current, trustRowRef.current], { y: 20, opacity: 0 });
      gsap.set(previewCardRef.current, { y: 30, opacity: 0 });

      const tl = gsap.timeline();

      // 1. Headline lines reveal (80ms stagger, cubic-bezier(0.16, 1, 0.3, 1))
      tl.to([headlineLine1Ref.current, headlineLine2Ref.current], {
        y: '0%',
        duration: 0.7,
        stagger: 0.08,
        ease: 'power4.out',
        onStart: () => {
          [headlineLine1Ref.current, headlineLine2Ref.current].forEach((el) => {
            if (el) el.style.willChange = 'transform';
          });
        },
        onComplete: () => {
          [headlineLine1Ref.current, headlineLine2Ref.current].forEach((el) => {
            if (el) el.style.willChange = 'auto';
          });
        },
      });

      // 2. 300ms after final line lands, accent highlight block wipes in (scaleX 0 to 1, 450ms)
      tl.to(
        highlightBlockRef.current,
        {
          scaleX: 1,
          duration: 0.45,
          ease: 'power4.out',
          onStart: () => {
            if (highlightBlockRef.current) highlightBlockRef.current.style.willChange = 'transform';
          },
          onComplete: () => {
            if (highlightBlockRef.current) highlightBlockRef.current.style.willChange = 'auto';
          },
        },
        '+=0.3'
      );

      // 3. Subcopy and label chip fade up 16px, 100ms stagger, overlapping highlight wipe by 200ms
      tl.to(
        [chipRef.current, subcopyRef.current],
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          onStart: () => {
            [chipRef.current, subcopyRef.current].forEach((el) => {
              if (el) el.style.willChange = 'transform, opacity';
            });
          },
          onComplete: () => {
            [chipRef.current, subcopyRef.current].forEach((el) => {
              if (el) el.style.willChange = 'auto';
            });
          },
        },
        '-=0.2'
      );

      // 4. CTA row rises 20px and fades in last
      tl.to(
        [ctaRowRef.current, trustRowRef.current, previewCardRef.current],
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          onStart: () => {
            [ctaRowRef.current, trustRowRef.current, previewCardRef.current].forEach((el) => {
              if (el) el.style.willChange = 'transform, opacity';
            });
          },
          onComplete: () => {
            [ctaRowRef.current, trustRowRef.current, previewCardRef.current].forEach((el) => {
              if (el) el.style.willChange = 'auto';
            });
          },
        },
        '-=0.2'
      );

      // Ambient hero glyph float: translateY ±12px over 4s and rotates ±3deg over 6s (sine.inOut, yoyo)
      if (floatingGlyphRef.current) {
        gsap.to(floatingGlyphRef.current, {
          y: 12,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to(floatingGlyphRef.current, {
          rotation: 3,
          duration: 6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [introFinished, reducedMotion]);

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20 flex flex-col items-center overflow-hidden"
    >
      {/* Ambient blurred radial gradient blobs (Desktop only, single rAF) */}
      {isDesktop && !reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            ref={blob1Ref}
            className="absolute w-[400px] h-[400px] rounded-full bg-[#d0e9d3]/40 blur-[90px] transform-gpu will-change-transform"
          />
          <div
            ref={blob2Ref}
            className="absolute w-[360px] h-[360px] rounded-full bg-[#35e639]/15 blur-[80px] transform-gpu will-change-transform"
          />
        </div>
      )}

      {/* Centered Header Block */}
      <div className="max-w-[820px] w-full text-center flex flex-col items-center relative z-10">
        {/* Eyebrow Chip Pill */}
        <div
          ref={chipRef}
          className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#def4de] text-[#0e1f12] mb-6 border border-[#bbcbb3]/40 transform-gpu"
        >
          <span className="font-mono-code text-[11px] tracking-widest uppercase font-semibold">
            TRIAGE, NOT ANOTHER JOB BOARD
          </span>
        </div>

        {/* Headline with signature reveal and highlight block */}
        <h1 className="font-sans-display text-4xl sm:text-5xl md:text-[56px] text-[#0e1f12] font-bold tracking-tight leading-[1.12] mb-6">
          <span className="block overflow-hidden pb-1">
            <span
              ref={headlineLine1Ref}
              className="block transform-gpu"
            >
              Stop guessing which
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span
              ref={headlineLine2Ref}
              className="relative inline-block transform-gpu"
            >
              internships are{' '}
              <span className="relative inline-block px-2 text-[#0e1f12]">
                {/* 450ms wipe-in accent block */}
                <span
                  ref={highlightBlockRef}
                  className="absolute inset-0 bg-[#35e639]/30 rounded-lg -z-10 transform-gpu"
                />
                worth it.
              </span>
            </span>
          </span>
        </h1>

        {/* Body Paragraph */}
        <p
          ref={subcopyRef}
          className="font-sans-display text-lg sm:text-xl text-[#3c4b38] max-w-2xl mx-auto leading-relaxed mb-8 transform-gpu"
        >
          Paste any listing. Get an evidence-based read on fit, a grounded outreach draft, and
          everything tracked automatically.
        </p>

        {/* Action Button Row */}
        <div
          ref={ctaRowRef}
          className="flex flex-wrap items-center justify-center gap-4 transform-gpu"
        >
          <MagneticButton
            id="hero-cta-triage"
            variant="primary"
            onClick={onTriageClick}
          >
            <span>Launch Triage Stack</span>
            <ArrowForward className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            id="hero-cta-how-it-works"
            variant="ghost"
            onClick={onExploreClick}
          >
            <span>See how it works</span>
            <ArrowDownward className="w-4 h-4 text-[#4e6351]" />
          </MagneticButton>
        </div>

        {/* Micro Trust Counter */}
        <div
          ref={trustRowRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[#4e6351] font-mono-code text-xs transform-gpu"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006e0c] animate-pulse"></span>
            <span>1,240+ listings triaged this week</span>
          </div>
          <span className="text-[#bbcbb3] hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#006e0c]" />
            <span>No spam, zero fluff analysis</span>
          </div>
        </div>
      </div>

      {/* Centered Hero Visual Panel */}
      <div
        ref={previewCardRef}
        className="mt-12 w-full max-w-5xl mx-auto relative z-10 transform-gpu"
      >
        <div className="w-full bg-[#def4de] rounded-[24px] border border-[#d1e9d1] p-6 md:p-10 relative flex flex-col md:flex-row items-center justify-between min-h-[460px] shadow-sm">
          {/* Left Interactive Triage Artifact */}
          <div className="w-full md:w-72 bg-white rounded-xl p-5 border border-[#bbcbb3]/40 flex flex-col gap-3 relative z-10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#006e0c]" />
                <span className="font-mono-code text-xs text-[#3c4b38] font-medium">
                  stripe_systems_2025.pdf
                </span>
              </div>
              <span className="font-mono-code text-[10px] text-[#4e6353] bg-[#eaffe9] px-2 py-0.5 rounded-full border border-[#bbcbb3]/40">
                Triaged
              </span>
            </div>

            <div className="bg-[#e4f9e3] p-3 rounded-lg flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="font-sans-display text-sm font-semibold text-[#0e1f12]">
                  FinTech Systems Intern
                </span>
                <span className="font-mono-code text-xs font-bold text-[#006e0c]">
                  94% FIT
                </span>
              </div>
              <span className="font-mono-code text-[11px] text-[#4e6353]">
                Stripe Core Ledger · Summer 2025
              </span>
            </div>

            {/* Discrete Evidence Tags */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono-code py-1.5 px-2.5 rounded-full bg-[#e4f9e3] text-[#006e0c] border border-[#bbcbb3]/30">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Distributed SQL</span>
                </span>
                <span className="text-[#4e6353] text-[11px]">Matched</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono-code py-1.5 px-2.5 rounded-full bg-[#e4f9e3] text-[#006e0c] border border-[#bbcbb3]/30">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Financial Ledger Logic</span>
                </span>
                <span className="text-[#4e6353] text-[11px]">Matched</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono-code py-1.5 px-2.5 rounded-full bg-[#ffdad6]/40 text-[#0e1f12] border border-[#ba1a1a]/20">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#ba1a1a]" />
                  <span>Rust Embedded</span>
                </span>
                <span className="text-[#ba1a1a] font-mono-code text-[10px]">
                  Preferred Gap
                </span>
              </div>
            </div>
          </div>

          {/* Central Monoline Hero Illustration with subtle floating animation */}
          <div className="w-full flex-1 flex flex-col items-center justify-center my-8 md:my-0 relative">
            <div
              ref={floatingGlyphRef}
              className="relative w-full max-w-[340px] md:max-w-[380px] aspect-square flex items-center justify-center transform-gpu"
            >
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1URUc6VVTGfMjAitZ4ymUsEkOXXDhPaFqhkrR36gLxDKhSKXGDmoBMiiJbHKvZ_jhIdcx6LdsiKD1sYlMiJjtW9ck-nXVG7BAUu8P_hho1ciz79n726dYPhEjZJUqVEgOIp536U56Jqta8KiAm190NeH7aPGkCPEIQiwICAbrofxXdMvhQkSKTW7z7-Rq0llCFVbsLD1SyAZEP42tJaoB6KLcME0z5NvHxGnEciveRbLfUzSNTlaMDZbw"
                alt="Student with laptop and evidence documents in monoline style"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </div>
          </div>

          {/* Right Quick Evidence Score Card */}
          <div className="w-full md:w-64 bg-white rounded-xl p-5 border border-[#bbcbb3]/40 flex flex-col gap-4 relative z-10 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#bbcbb3]/20">
              <span className="font-sans-display text-sm font-semibold text-[#0e1f12]">
                Signal Readout
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#35e639]"></span>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono-code text-xs text-[#4e6353]">
                    Mentorship Depth
                  </span>
                  <span className="font-mono-code text-xs text-[#0e1f12] font-semibold">
                    Tier 1
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#def4de] rounded-full overflow-hidden">
                  <div className="w-5/6 h-full bg-[#006e0c] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono-code text-xs text-[#4e6353]">
                    Conversion Rate
                  </span>
                  <span className="font-mono-code text-xs text-[#0e1f12] font-semibold">
                    78%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#def4de] rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-[#006e0c] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono-code text-xs text-[#4e6353]">
                    Cold Reach ROI
                  </span>
                  <span className="font-mono-code text-xs text-[#006e0c] font-bold">
                    High Priority
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#def4de] rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#35e639] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onTriageClick}
                className="w-full py-2.5 px-3 rounded-full bg-[#def4de] text-[#0e1f12] font-mono-code text-xs font-semibold text-center block hover:bg-[#35e639] hover:text-[#002201] transition-colors"
              >
                Generate Outreach Draft →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
