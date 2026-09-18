import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../motion/useReducedMotion';
import { CheckCircle, Info, Check, ArrowForward } from './Icons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PathData {
  id: string;
  sourceIndex: number;
  targetIndex: number;
  type: 'matched' | 'gap';
  d: string;
  length: number;
  endX: number;
  endY: number;
}

export function EvidenceDiagram({ onNextStep }: { onNextStep?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const leftTokensRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightTokensRef = useRef<(HTMLDivElement | null)[]>([]);
  const fitSegmentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const markersRef = useRef<(SVGCircleElement | null)[]>([]);

  const [paths, setPaths] = useState<PathData[]>([]);
  const reducedMotion = useReducedMotion();

  const studentTokens = [
    { id: 's1', label: 'Raft Consensus KV', detail: 'github.com/student/distributed-kv' },
    { id: 's2', label: 'Financial Ledger Logic', detail: 'CS244B Coursework Project' },
    { id: 's3', label: 'Zero-Copy TCP Buffer', detail: 'High performance socket harness' },
    { id: 's4', label: 'Go Memory Profiling', detail: 'Optimized allocations under load' },
    { id: 's5', label: 'Postgres Idempotency', detail: 'Transactional rollback test suite' },
  ];

  const roleTokens = [
    { id: 'r1', label: 'Distributed SQL & Raft', detail: 'Stripe Core Ledger requirement' },
    { id: 'r2', label: 'Ledger State Compaction', detail: 'Double-entry integrity check' },
    { id: 'r3', label: 'High Throughput IO', detail: 'Sub-millisecond settlement' },
    { id: 'r4', label: 'Rust Embedded Engine', detail: 'Preferred team migration stack' },
    { id: 'r5', label: 'Audit Logging Pipeline', detail: 'Zero-data-loss compliance' },
  ];

  // Connections mapping (matched first, gap last)
  const connectionRules = [
    { sourceIndex: 0, targetIndex: 0, type: 'matched' as const },
    { sourceIndex: 1, targetIndex: 1, type: 'matched' as const },
    { sourceIndex: 2, targetIndex: 2, type: 'matched' as const },
    { sourceIndex: 4, targetIndex: 4, type: 'matched' as const },
    // Gap lines draw last
    { sourceIndex: 3, targetIndex: 3, type: 'gap' as const },
  ];

  const calculatePaths = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const computedPaths: PathData[] = [];

    connectionRules.forEach((rule, idx) => {
      const sourceEl = leftTokensRef.current[rule.sourceIndex];
      const targetEl = rightTokensRef.current[rule.targetIndex];

      if (!sourceEl || !targetEl) return;

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const startX = sourceRect.right - containerRect.left;
      const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
      const endX = targetRect.left - containerRect.left;
      const endY = targetRect.top + targetRect.height / 2 - containerRect.top;

      const c1X = startX + (endX - startX) * 0.5;
      const c1Y = startY;
      const c2X = startX + (endX - startX) * 0.5;
      const c2Y = endY;

      const d = `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`;
      const approxLength = Math.hypot(endX - startX, endY - startY) * 1.25;

      computedPaths.push({
        id: `path-${idx}`,
        sourceIndex: rule.sourceIndex,
        targetIndex: rule.targetIndex,
        type: rule.type,
        d,
        length: Math.max(200, Math.round(approxLength)),
        endX,
        endY,
      });
    });

    setPaths(computedPaths);
  }, []);

  // Recalculate on resize with debounced observer
  useEffect(() => {
    calculatePaths();

    let timeoutId: number;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(calculatePaths, 80);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', calculatePaths);

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', calculatePaths);
    };
  }, [calculatePaths]);

  // Section 6 Timeline Animation
  useEffect(() => {
    if (paths.length === 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Plain 200ms opacity fade for reduced motion
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: 'power1.out' }
        );
        pathsRef.current.forEach((p) => {
          if (p) {
            p.style.strokeDashoffset = '0';
          }
        });
        fitSegmentsRef.current.forEach((seg) => {
          if (seg) {
            seg.style.transform = 'scaleX(1)';
          }
        });
        return;
      }

      // Initialize all paths
      pathsRef.current.forEach((p, idx) => {
        if (!p) return;
        const len = paths[idx]?.length || 300;
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });

      // Initialize tokens
      leftTokensRef.current.forEach((tok) => {
        if (tok) gsap.set(tok, { opacity: 0, x: -12 });
      });
      rightTokensRef.current.forEach((tok) => {
        if (tok) gsap.set(tok, { opacity: 0, x: 12 });
      });

      // Initialize fit segments
      fitSegmentsRef.current.forEach((seg) => {
        if (seg) gsap.set(seg, { scaleX: 0, transformOrigin: 'left center' });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // Staggered order: matched lines first, gap lines last
      const matchedIndices: number[] = [];
      const gapIndices: number[] = [];

      paths.forEach((p, idx) => {
        if (p.type === 'matched') matchedIndices.push(idx);
        else gapIndices.push(idx);
      });

      const sequence = [...matchedIndices, ...gapIndices];

      sequence.forEach((pathIdx, stepOrder) => {
        const pathData = paths[pathIdx];
        const pathEl = pathsRef.current[pathIdx];
        const srcEl = leftTokensRef.current[pathData.sourceIndex];
        const tgtEl = rightTokensRef.current[pathData.targetIndex];
        const markerEl = markersRef.current[pathIdx];

        // Token fades in 50ms before line
        const tokenTime = stepOrder * 0.08;
        if (srcEl) {
          tl.to(
            srcEl,
            { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
            tokenTime
          );
        }
        if (tgtEl) {
          tl.to(
            tgtEl,
            { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
            tokenTime
          );
        }

        // Line draws with stroke-dashoffset from full to 0 over 400ms
        const lineStartTime = tokenTime + 0.05;
        if (pathEl) {
          tl.to(
            pathEl,
            {
              strokeDashoffset: 0,
              duration: 0.4,
              ease: 'power3.out',
              onStart: () => {
                pathEl.style.willChange = 'stroke-dashoffset';
              },
              onComplete: () => {
                pathEl.style.willChange = 'auto';
              },
            },
            lineStartTime
          );
        }

        // After gap line finishes, endpoint marker pulses scale 1 to 1.3 to 1 once
        if (pathData.type === 'gap' && markerEl) {
          const markerTime = lineStartTime + 0.4;
          tl.to(
            markerEl,
            {
              scale: 1.3,
              duration: 0.15,
              ease: 'power2.out',
              transformOrigin: 'center center',
            },
            markerTime
          ).to(
            markerEl,
            {
              scale: 1,
              duration: 0.15,
              ease: 'power2.in',
            },
            markerTime + 0.15
          );
        }
      });

      // Fit band component fills segments left to right (200ms per segment, 100ms stagger)
      const fitBandStartTime = sequence.length * 0.08 + 0.45;
      fitSegmentsRef.current.forEach((seg, idx) => {
        if (!seg) return;
        tl.to(
          seg,
          {
            scaleX: 1,
            duration: 0.2,
            ease: 'power3.out',
            onStart: () => {
              seg.style.willChange = 'transform';
            },
            onComplete: () => {
              seg.style.willChange = 'auto';
            },
          },
          fitBandStartTime + idx * 0.1
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [paths, reducedMotion]);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#def4de] text-[#0e1f12] text-xs font-mono-code font-semibold mb-3 border border-[#bbcbb3]/40">
          <span className="w-2 h-2 rounded-full bg-[#006e0c] mr-2"></span>
          <span>EVIDENCE REASONING GRAPH</span>
        </div>
        <h2 className="font-sans-display text-2xl sm:text-3xl font-bold text-[#0e1f12]">
          Bipartite Skill-to-Requirement Verification
        </h2>
        <p className="font-sans-display text-sm text-[#4e6351] mt-2">
          Green lines indicate deterministic git artifact matches; amber dashed lines mark addressable stack gaps.
        </p>
      </div>

      {/* Main Graph Container */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl border border-[#bbcbb3]/40 p-6 md:p-10 shadow-sm overflow-hidden"
      >
        {/* Absolute SVG connector overlay */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {paths.map((p, idx) => {
            const isMatch = p.type === 'matched';
            return (
              <g key={p.id}>
                <path
                  ref={(el) => { pathsRef.current[idx] = el; }}
                  d={p.d}
                  fill="none"
                  stroke={isMatch ? '#1e9e4a' : '#e8a33d'}
                  strokeWidth="2"
                  strokeDasharray={isMatch ? undefined : '6 4'}
                  className="transform-gpu"
                />
                {/* Endpoint marker */}
                <circle
                  ref={(el) => { markersRef.current[idx] = el; }}
                  cx={p.endX}
                  cy={p.endY}
                  r={isMatch ? '3.5' : '4'}
                  fill={isMatch ? '#1e9e4a' : '#e8a33d'}
                  className="transform-gpu"
                />
              </g>
            );
          })}
        </svg>

        {/* 2 Column Layout with Spacing in Between */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-36 relative z-20">
          {/* Left Column: Student Verified Skills */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#bbcbb3]/30">
              <span className="font-mono-code text-xs font-bold text-[#0e1f12] uppercase tracking-wider">
                YOUR VERIFIED CODEBASE ARTIFACTS
              </span>
              <span className="font-mono-code text-[11px] text-[#006e0c] font-semibold bg-[#eaffe9] px-2 py-0.5 rounded-full border border-[#bbcbb3]/30">
                5 Repos Scanned
              </span>
            </div>

            {studentTokens.map((tok, idx) => (
              <div
                key={tok.id}
                ref={(el) => { leftTokensRef.current[idx] = el; }}
                className="p-3.5 bg-[#e4f9e3]/60 rounded-xl border border-[#bbcbb3]/40 flex items-center justify-between shadow-sm transform-gpu"
              >
                <div>
                  <h4 className="font-sans-display text-sm font-bold text-[#0e1f12]">
                    {tok.label}
                  </h4>
                  <span className="font-mono-code text-[11px] text-[#4e6351]">
                    {tok.detail}
                  </span>
                </div>
                <CheckCircle className="w-4 h-4 text-[#006e0c] shrink-0 ml-2" />
              </div>
            ))}
          </div>

          {/* Right Column: Role Technical Stack */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#bbcbb3]/30">
              <span className="font-mono-code text-xs font-bold text-[#0e1f12] uppercase tracking-wider">
                STRIPE CORE LEDGER STACK
              </span>
              <span className="font-mono-code text-[11px] text-[#4e6351] bg-[#def4de] px-2 py-0.5 rounded-full">
                Target Requirements
              </span>
            </div>

            {roleTokens.map((tok, idx) => {
              const isGap = idx === 3;
              return (
                <div
                  key={tok.id}
                  ref={(el) => { rightTokensRef.current[idx] = el; }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between shadow-sm transform-gpu ${
                    isGap
                      ? 'bg-[#fef4e6]/70 border-[#e8a33d]/40'
                      : 'bg-white border-[#bbcbb3]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isGap ? (
                      <Info className="w-4 h-4 text-[#e8a33d] shrink-0" />
                    ) : (
                      <Check className="w-4 h-4 text-[#006e0c] shrink-0" />
                    )}
                    <div>
                      <h4 className="font-sans-display text-sm font-bold text-[#0e1f12]">
                        {tok.label}
                      </h4>
                      <span className="font-mono-code text-[11px] text-[#4e6351]">
                        {tok.detail}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono-code text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isGap
                        ? 'bg-[#fef4e6] text-[#e8a33d] border border-[#e8a33d]/40'
                        : 'bg-[#e4f9e3] text-[#006e0c]'
                    }`}
                  >
                    {isGap ? 'Preferred Gap' : 'Matched'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fit Band Component (Segmented Fill left-to-right) */}
        <div className="mt-12 pt-6 border-t border-[#bbcbb3]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="font-mono-code text-xs text-[#4e6351] uppercase tracking-wider block">
                COMPOSITE FIT BAND READOUT
              </span>
              <span className="font-sans-display text-base font-bold text-[#0e1f12]">
                Tier 1 Candidate · 94.2% Verified Alignment
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono-code text-xs">
              <span className="flex items-center gap-1.5 text-[#006e0c]">
                <span className="w-2 h-2 rounded-full bg-[#1e9e4a]"></span>
                4 Matched
              </span>
              <span className="flex items-center gap-1.5 text-[#e8a33d]">
                <span className="w-2 h-2 rounded-full bg-[#e8a33d]"></span>
                1 Addressable Gap
              </span>
            </div>
          </div>

          {/* 6 Segments for fit band */}
          <div className="grid grid-cols-6 gap-1.5 h-3 bg-[#def4de]/40 p-1 rounded-full border border-[#bbcbb3]/30">
            {[0, 1, 2, 3, 4, 5].map((segIdx) => (
              <div
                key={segIdx}
                className="w-full h-full bg-[#def4de] rounded-full overflow-hidden"
              >
                <div
                  ref={(el) => { fitSegmentsRef.current[segIdx] = el; }}
                  className={`w-full h-full rounded-full transform-gpu ${
                    segIdx < 5 ? 'bg-[#006e0c]' : 'bg-[#e8a33d]'
                  }`}
                />
              </div>
            ))}
          </div>

          {onNextStep && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onNextStep}
                className="px-6 py-2.5 rounded-full bg-[#35e639] text-[#0e1f12] font-bold text-xs font-mono-code flex items-center gap-2 hover:brightness-105 transition-all"
              >
                <span>Draft Grounded Cold Outreach</span>
                <ArrowForward className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
