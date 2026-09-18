import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from '../motion/Reveal';
import { useReducedMotion } from '../motion/useReducedMotion';
import { Check, Search, FileText, Activity, Layers, ArrowForward } from './Icons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSectionsProps {
  onTriageClick: () => void;
  onOpenGrounding: () => void;
}

export function ScrollSections({ onTriageClick, onOpenGrounding }: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const problemCardsRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Section 4b: PROBLEM CARDS
  // On enter, each rises 40px and fades in with 100ms stagger.
  // The large watermark number counts up from 00 to its value over 600ms once.
  useEffect(() => {
    if (!problemCardsRef.current) return;

    const cards = problemCardsRef.current.querySelectorAll('.problem-card');
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }

      cards.forEach((card, idx) => {
        const numEl = card.querySelector('.watermark-number') as HTMLElement;
        const targetVal = parseInt(numEl?.getAttribute('data-target') || '0', 10);
        const suffix = numEl?.getAttribute('data-suffix') || '';

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        });

        tl.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: idx * 0.1,
            ease: 'power4.out',
            onStart: () => {
              (card as HTMLElement).style.willChange = 'transform, opacity';
            },
            onComplete: () => {
              (card as HTMLElement).style.willChange = 'auto';
            },
          }
        );

        if (numEl) {
          const counter = { val: 0 };
          tl.to(
            counter,
            {
              val: targetVal,
              duration: 0.6,
              ease: 'power2.out',
              onUpdate: () => {
                const cur = Math.round(counter.val);
                numEl.textContent = `${cur < 10 ? `0${cur}` : cur}${suffix}`;
              },
            },
            `-=${0.5}`
          );
        }
      });
    }, problemCardsRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  // Section 4c: PINNED FEATURE SECTION
  // Pin for 300vh scroll scrub on desktop (>=1024px).
  // Cross-fades 4 mockups and highlights the active step indicator.
  useEffect(() => {
    if (!pinnedSectionRef.current || !isDesktop || reducedMotion) return;

    const section = pinnedSectionRef.current;
    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          // 4 quarters: 0 to 0.25 -> 0, 0.25 to 0.5 -> 1, 0.5 to 0.75 -> 2, 0.75 to 1 -> 3
          const quarter = Math.min(3, Math.floor(self.progress * 4));
          setActiveStepIndex(quarter);
        },
      });

      return () => {
        pinTrigger.kill();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, [isDesktop, reducedMotion]);

  // Section 4d: INFINITE MARQUEE TICKER
  // Linear loop, wraps seamlessly, pause on hover, reverses on scroll-up
  useEffect(() => {
    if (!marqueeTrackRef.current) return;

    const track = marqueeTrackRef.current;
    let marqueeTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(track, { x: 0 });
        return;
      }

      marqueeTween = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 45,
        ease: 'none',
      });

      // Reverse direction on scroll up using ScrollTrigger direction
      const scrollDirectionTrigger = ScrollTrigger.create({
        onUpdate: (self) => {
          if (marqueeTween) {
            if (self.direction === -1) {
              marqueeTween.timeScale(-1);
            } else {
              marqueeTween.timeScale(1);
            }
          }
        },
      });

      // Pause on hover
      const handleMouseEnter = () => marqueeTween?.pause();
      const handleMouseLeave = () => marqueeTween?.resume();

      track.addEventListener('mouseenter', handleMouseEnter);
      track.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        scrollDirectionTrigger.kill();
        track.removeEventListener('mouseenter', handleMouseEnter);
        track.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, track);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  const problemData = [
    {
      num: 40,
      suffix: 'h',
      title: 'ATS Black Holes',
      desc: 'Students waste 40+ hours per cycle tailoring cover letters that automated parsers discard in milliseconds.',
    },
    {
      num: 84,
      suffix: '%',
      title: 'Hidden Stack Traps',
      desc: '84% of job descriptions omit their core infrastructure, failing applicants on unspoken prerequisite libraries.',
    },
    {
      num: 3,
      suffix: 'm',
      title: 'Skim Discards',
      desc: 'Engineering managers spend under 3 minutes scanning cold outreaches that lack direct code citations.',
    },
    {
      num: 91,
      suffix: '%',
      title: 'Evidence Conversion',
      desc: 'Outreaches quoting verified git commits and matching architectures yield a 91% response rate boost.',
    },
  ];

  const stepsData = [
    {
      step: '01 / FIT DECONSTRUCTION',
      title: 'Instant Fit-Band Triage',
      desc: 'We extract unlisted requirements, team structure, and codebase expectations, providing clean Matched, Preferred, or Required gap verdicts.',
      metric: '94% Match Confidence',
    },
    {
      step: '02 / GROUNDED OUTREACH',
      title: 'Contextual Drafts Without Fluff',
      desc: 'No generic flattery. Signal builds crisp emails connecting specific projects from your GitHub directly to the team’s roadmap challenges.',
      metric: 'Zero-hallucination copy',
    },
    {
      step: '03 / ACTIVE RETENTION',
      title: 'Autonomous Recruitment Pipeline',
      desc: 'Track interviews, follow-up windows, and referral touches without opening another spreadsheet. A unified calm dashboard for recruitment season.',
      metric: 'Continuous git sync',
    },
    {
      step: '04 / EVIDENCE DECK AUDIT',
      title: 'Interactive Verification Matrix',
      desc: 'Inspect exact token-to-repo links before sending. Ensure every claimed capability is substantiated by public commits.',
      metric: 'Deterministic verification',
    },
  ];

  return (
    <div ref={containerRef} className="w-full bg-[#e4f9e3]/60">
      {/* 4d: Marquee Ticker */}
      <div className="w-full bg-[#0e1f12] text-[#e1f6e1] py-3.5 border-y border-[#3c4b38]/40 overflow-hidden select-none">
        <div
          ref={marqueeTrackRef}
          className="flex whitespace-nowrap font-mono-code text-xs uppercase tracking-widest cursor-pointer"
        >
          <span className="flex items-center gap-8 px-4">
            <span className="text-[#35e639]">● LIVE PROTOCOL TELEMETRY</span>
            <span>STRIPE CORE LEDGER: 94% FIT DETERMINED</span>
            <span>•</span>
            <span>DATADOG DISTRIBUTED TRACING: 88% MATCH</span>
            <span>•</span>
            <span className="text-[#35e639]">COLD REACH ROI: +3.4X OVER BASELINE</span>
            <span>•</span>
            <span>ZERO HALLUCINATION OUTREACH ENGINE</span>
            <span>•</span>
            <span>1,240+ LISTINGS TRIAGED THIS WEEK</span>
            <span>•</span>
          </span>
          {/* Duplicated track for seamless loop */}
          <span className="flex items-center gap-8 px-4">
            <span className="text-[#35e639]">● LIVE PROTOCOL TELEMETRY</span>
            <span>STRIPE CORE LEDGER: 94% FIT DETERMINED</span>
            <span>•</span>
            <span>DATADOG DISTRIBUTED TRACING: 88% MATCH</span>
            <span>•</span>
            <span className="text-[#35e639]">COLD REACH ROI: +3.4X OVER BASELINE</span>
            <span>•</span>
            <span>ZERO HALLUCINATION OUTREACH ENGINE</span>
            <span>•</span>
            <span>1,240+ LISTINGS TRIAGED THIS WEEK</span>
            <span>•</span>
          </span>
        </div>
      </div>

      {/* 4a & 4b: Problem Cards Section */}
      <section
        ref={problemCardsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#def4de] text-[#0e1f12] mb-4 border border-[#bbcbb3]/40">
            <span className="font-mono-code text-[11px] tracking-widest uppercase font-semibold">
              THE TRIAGE PROTOCOL
            </span>
          </div>

          <Reveal
            as="h2"
            type="lines"
            className="font-sans-display text-3xl sm:text-4xl lg:text-[40px] text-[#0e1f12] font-bold tracking-tight leading-tight"
          >
            High-trust intelligence before you hit apply.
          </Reveal>

          <p className="font-sans-display text-base sm:text-lg text-[#4e6351] mt-4 leading-relaxed">
            Most students waste 40+ hours sending identical resumes into applicant black holes.
            Signal maps reality to your actual skills.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemData.map((item, idx) => (
            <div
              key={idx}
              className="problem-card bg-white p-7 rounded-2xl border border-[#bbcbb3]/40 flex flex-col justify-between hover:border-[#6c7b66] transition-colors relative overflow-hidden shadow-sm transform-gpu"
            >
              {/* Large Watermark Number that counts up once */}
              <div
                data-target={item.num}
                data-suffix={item.suffix}
                className="watermark-number font-mono-code text-5xl font-bold text-[#def4de] select-none mb-4 leading-none"
              >
                00{item.suffix}
              </div>

              <div>
                <span className="font-mono-code text-[11px] text-[#4e6351] uppercase tracking-wider block mb-1">
                  0{idx + 1} / METRIC ANALYSIS
                </span>
                <h3 className="font-sans-display text-lg font-bold text-[#0e1f12] mb-2">
                  {item.title}
                </h3>
                <p className="font-sans-display text-sm text-[#4e6351] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#bbcbb3]/20 flex items-center justify-between">
                <span className="font-mono-code text-xs text-[#006e0c] font-semibold">
                  Evidence Verified
                </span>
                <Check className="w-4 h-4 text-[#006e0c]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4c: Pinned Feature Section (Desktop: 300vh scrub pin, Mobile: stacked pairs) */}
      <section
        ref={pinnedSectionRef}
        id="how-it-works"
        className="w-full bg-white border-y border-[#bbcbb3]/30 min-h-screen relative flex items-center py-16 lg:py-0"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          {/* Section Eyebrow */}
          <div className="mb-10 text-center lg:text-left">
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#006e0c] font-semibold bg-[#eaffe9] px-3 py-1 rounded-full border border-[#bbcbb3]/40">
              PINNED ARCHITECTURE // DEEP PROTOCOL
            </span>
            <h2 className="font-sans-display text-2xl sm:text-3xl font-bold text-[#0e1f12] mt-3">
              How Signal turns opaque job posts into actionable leverage.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: 4-Item Step List with scaleY 2px accent bars */}
            <div className="lg:col-span-5 space-y-6">
              {stepsData.map((step, idx) => {
                const isActive = isDesktop ? activeStepIndex === idx : true;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`relative pl-6 cursor-pointer transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    {/* 2px accent bar: scaleY 0 to 1 with origin top */}
                    <div
                      style={{
                        transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'top center',
                        transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#006e0c] rounded-full transform-gpu"
                    />

                    <span className="font-mono-code text-[11px] uppercase tracking-wider block font-semibold text-[#006e0c] mb-1">
                      {step.step}
                    </span>
                    <h3
                      className={`font-sans-display text-lg sm:text-xl font-bold mb-2 transition-colors ${
                        isActive ? 'text-[#0e1f12]' : 'text-[#4e6351]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="font-sans-display text-sm text-[#4e6351] leading-relaxed mb-3">
                      {step.desc}
                    </p>
                    <div className="inline-flex items-center gap-2 font-mono-code text-xs text-[#006e0c] font-medium bg-[#eaffe9] px-2.5 py-1 rounded-full border border-[#bbcbb3]/30">
                      <Check className="w-3.5 h-3.5" />
                      <span>{step.metric}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: 4 Stacked Interactive Product Mockup Images / Panels */}
            <div className="lg:col-span-7 relative h-[440px] sm:h-[480px] bg-[#def4de] rounded-2xl border border-[#bbcbb3]/50 p-6 md:p-8 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Mockup 1: Deterministic Parsing */}
              <div
                style={{
                  opacity: (isDesktop ? activeStepIndex === 0 : true) ? 1 : 0,
                  transform:
                    (isDesktop ? activeStepIndex === 0 : true)
                      ? 'scale(1) translateY(0px)'
                      : 'scale(0.96) translateY(-30px)',
                  transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: activeStepIndex === 0 ? 'auto' : 'none',
                }}
                className="absolute inset-6 bg-white rounded-xl p-6 border border-[#bbcbb3]/40 shadow-sm flex flex-col justify-between transform-gpu"
              >
                <div className="flex items-center justify-between border-b border-[#bbcbb3]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#006e0c]" />
                    <span className="font-mono-code text-xs font-semibold text-[#0e1f12]">
                      PARSER PIPELINE // AST TREE EXTRACTOR
                    </span>
                  </div>
                  <span className="font-mono-code text-[11px] bg-[#e4f9e3] text-[#006e0c] px-2 py-0.5 rounded-full font-bold">
                    COMPLETED
                  </span>
                </div>

                <div className="space-y-3 my-auto">
                  <div className="p-3 bg-[#eaffe9] rounded-lg border border-[#bbcbb3]/30">
                    <div className="flex justify-between text-xs font-mono-code mb-1">
                      <span className="font-semibold text-[#0e1f12]">Core Database Systems</span>
                      <span className="text-[#006e0c] font-bold">MATCH (100%)</span>
                    </div>
                    <p className="text-xs text-[#4e6351]">
                      Found: Raft consensus implementations in your github.com/student/distributed-kv
                    </p>
                  </div>

                  <div className="p-3 bg-[#eaffe9] rounded-lg border border-[#bbcbb3]/30">
                    <div className="flex justify-between text-xs font-mono-code mb-1">
                      <span className="font-semibold text-[#0e1f12]">High-Throughput IO</span>
                      <span className="text-[#006e0c] font-bold">MATCH (92%)</span>
                    </div>
                    <p className="text-xs text-[#4e6351]">
                      Found: Zero-copy networking in C++ benchmark suite
                    </p>
                  </div>

                  <div className="p-3 bg-[#ffdad6]/40 rounded-lg border border-[#ba1a1a]/20">
                    <div className="flex justify-between text-xs font-mono-code mb-1">
                      <span className="font-semibold text-[#0e1f12]">Rust Async runtime</span>
                      <span className="text-[#ba1a1a] font-bold">PREFERRED GAP (80%)</span>
                    </div>
                    <p className="text-xs text-[#4e6351]">
                      Stripe uses Tokio; your profile shows Go routines. Signal highlights transferable concurrency theory.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onTriageClick}
                  className="w-full py-2.5 rounded-lg bg-[#35e639] text-[#0e1f12] font-bold text-xs font-mono-code flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <span>Open Interactive Triage Stack</span>
                  <ArrowForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mockup 2: Fit-Band Mapping */}
              <div
                style={{
                  opacity: isDesktop ? (activeStepIndex === 1 ? 1 : 0) : 0,
                  transform:
                    activeStepIndex === 1
                      ? 'scale(1) translateY(0px)'
                      : activeStepIndex > 1
                      ? 'scale(0.96) translateY(-30px)'
                      : 'scale(0.96) translateY(30px)',
                  transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: activeStepIndex === 1 ? 'auto' : 'none',
                }}
                className="absolute inset-6 bg-white rounded-xl p-6 border border-[#bbcbb3]/40 shadow-sm flex flex-col justify-between transform-gpu"
              >
                <div className="flex items-center justify-between border-b border-[#bbcbb3]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#006e0c]" />
                    <span className="font-mono-code text-xs font-semibold text-[#0e1f12]">
                      FIT BAND VECTOR CALCULATION
                    </span>
                  </div>
                  <span className="font-mono-code text-[11px] text-[#0e1f12] font-bold">
                    94.2% FIT
                  </span>
                </div>

                <div className="space-y-4 my-auto">
                  <div>
                    <div className="flex justify-between text-xs font-mono-code mb-1.5">
                      <span className="text-[#4e6351]">Distributed Consistency</span>
                      <span className="font-bold text-[#006e0c]">High Signal (98%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#def4de] rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-[#006e0c] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-code mb-1.5">
                      <span className="text-[#4e6351]">Mentorship Band Alignment</span>
                      <span className="font-bold text-[#006e0c]">Tier 1 Principal Mentors</span>
                    </div>
                    <div className="w-full h-2 bg-[#def4de] rounded-full overflow-hidden">
                      <div className="w-[90%] h-full bg-[#35e639] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono-code mb-1.5">
                      <span className="text-[#4e6351]">Cold Outreach Response Model</span>
                      <span className="font-bold text-[#006e0c]">78% High Probability</span>
                    </div>
                    <div className="w-full h-2 bg-[#def4de] rounded-full overflow-hidden">
                      <div className="w-[78%] h-full bg-[#006e0c] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#e4f9e3] rounded-lg border border-[#bbcbb3]/30 text-xs font-mono-code text-[#0e1f12]">
                  Verdict: Top 2% algorithmic alignment. Recommendation: Apply immediately with targeted infrastructure pitch.
                </div>
              </div>

              {/* Mockup 3: Grounded Outreach */}
              <div
                style={{
                  opacity: isDesktop ? (activeStepIndex === 2 ? 1 : 0) : 0,
                  transform:
                    activeStepIndex === 2
                      ? 'scale(1) translateY(0px)'
                      : activeStepIndex > 2
                      ? 'scale(0.96) translateY(-30px)'
                      : 'scale(0.96) translateY(30px)',
                  transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: activeStepIndex === 2 ? 'auto' : 'none',
                }}
                className="absolute inset-6 bg-white rounded-xl p-6 border border-[#bbcbb3]/40 shadow-sm flex flex-col justify-between transform-gpu"
              >
                <div className="flex items-center justify-between border-b border-[#bbcbb3]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#006e0c]" />
                    <span className="font-mono-code text-xs font-semibold text-[#0e1f12]">
                      GROUNDED DRAFT ENGINE
                    </span>
                  </div>
                  <span className="font-mono-code text-[11px] bg-[#e4f9e3] text-[#006e0c] px-2 py-0.5 rounded-full font-bold">
                    VERIFIED CITATIONS
                  </span>
                </div>

                <div className="my-auto space-y-2.5 font-sans-display text-xs text-[#0e1f12]">
                  <p className="p-2.5 bg-[#eaffe9] rounded-lg border border-[#bbcbb3]/30">
                    <span className="font-mono-code text-[10px] text-[#006e0c] font-bold block mb-0.5">
                      GROUNDED SENTENCE [EVIDENCE: COMMIT #a9f201]
                    </span>
                    "I noticed the Core Ledger team is migrating to multi-region Raft. In my distributed-kv engine, I implemented snapshot compression that cut replication lag by 41%."
                  </p>
                  <p className="p-2.5 bg-[#ffdad6]/30 rounded-lg border border-[#ba1a1a]/20">
                    <span className="font-mono-code text-[10px] text-[#ba1a1a] font-bold block mb-0.5">
                      FACT CHECK WARNING (STATIC FLAG)
                    </span>
                    "Claim about 10M daily transactions unverified by code artifact. Replaced with documented benchmark stats."
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenGrounding}
                  className="w-full py-2.5 rounded-lg bg-[#def4de] text-[#0e1f12] font-mono-code text-xs font-semibold hover:bg-[#35e639] transition-colors"
                >
                  Test Grounding Link Editor →
                </button>
              </div>

              {/* Mockup 4: Autonomous Pipeline */}
              <div
                style={{
                  opacity: isDesktop ? (activeStepIndex === 3 ? 1 : 0) : 0,
                  transform:
                    activeStepIndex === 3
                      ? 'scale(1) translateY(0px)'
                      : 'scale(0.96) translateY(30px)',
                  transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: activeStepIndex === 3 ? 'auto' : 'none',
                }}
                className="absolute inset-6 bg-white rounded-xl p-6 border border-[#bbcbb3]/40 shadow-sm flex flex-col justify-between transform-gpu"
              >
                <div className="flex items-center justify-between border-b border-[#bbcbb3]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#006e0c]" />
                    <span className="font-mono-code text-xs font-semibold text-[#0e1f12]">
                      PIPELINE CADENCE TELEMETRY
                    </span>
                  </div>
                  <span className="font-mono-code text-[11px] bg-[#e4f9e3] text-[#006e0c] px-2 py-0.5 rounded-full font-bold">
                    3 ACTIVE ROLES
                  </span>
                </div>

                <div className="space-y-2 my-auto font-mono-code text-xs">
                  <div className="p-2.5 bg-white border border-[#bbcbb3]/40 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0e1f12]">Stripe · Systems Intern</div>
                      <div className="text-[11px] text-[#4e6351]">Shortlisted · Outreach Sent (2d ago)</div>
                    </div>
                    <span className="text-[#006e0c] text-[11px] font-bold">Next: Day 5 bump</span>
                  </div>

                  <div className="p-2.5 bg-white border border-[#bbcbb3]/40 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0e1f12]">Datadog · Tracing Engine</div>
                      <div className="text-[11px] text-[#4e6351]">Under review by Tech Lead</div>
                    </div>
                    <span className="text-[#006e0c] text-[11px] font-bold">Recruiter touch</span>
                  </div>

                  <div className="p-2.5 bg-white border border-[#bbcbb3]/40 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#0e1f12]">Figma · WebGL Canvas Core</div>
                      <div className="text-[11px] text-[#4e6351]">Triaged · 92% Fit Band</div>
                    </div>
                    <span className="text-[#4e6351] text-[11px]">Ready to pitch</span>
                  </div>
                </div>

                <div className="p-3 bg-[#def4de] rounded-lg border border-[#bbcbb3]/30 text-xs font-mono-code text-[#0e1f12] flex items-center justify-between">
                  <span>Zero spreadsheets required.</span>
                  <span className="font-bold text-[#006e0c]">Sync Active ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
