import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useReducedMotion } from '../motion/useReducedMotion';
import { CheckCircle, Info, Bookmark, X, ArrowForward, Check, ChevronRight } from './Icons';
import type { TriageRole } from '../types';

interface TriageCardStackProps {
  onRoleSelected?: (role: TriageRole) => void;
  onOpenEvidence?: (role: TriageRole) => void;
}

const INITIAL_ROLES: TriageRole[] = [
  {
    id: 'stripe-core-ledger',
    role: 'FinTech Systems Intern',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid)',
    season: 'Summer 2025',
    fitPercentage: 94,
    tags: [
      { label: 'Distributed SQL', type: 'matched' },
      { label: 'Financial Ledger Logic', type: 'matched' },
      { label: 'Rust Embedded', type: 'preferred_gap' },
    ],
    mentorshipDepth: 'Tier 1',
    conversionRate: 78,
    coldReachROI: 'High Priority',
    overview:
      'The Core Ledger team processes billions in daily ledger entries. You will build snapshot state compaction and optimize deterministic replication algorithms.',
    unlistedRequirements: [
      'Prior experience with distributed consensus (Raft/Paxos)',
      'Familiarity with idempotent database transaction design',
      'Comfort with high-concurrency benchmarks',
    ],
  },
  {
    id: 'datadog-apm-infra',
    role: 'Distributed Tracing Intern',
    company: 'Datadog',
    location: 'New York, NY',
    season: 'Summer 2025',
    fitPercentage: 91,
    tags: [
      { label: 'OpenTelemetry', type: 'matched' },
      { label: 'Go Runtime Profiling', type: 'matched' },
      { label: 'eBPF Probes', type: 'preferred_gap' },
    ],
    mentorshipDepth: 'Tier 1',
    conversionRate: 82,
    coldReachROI: 'High Priority',
    overview:
      'Join the APM Core team handling petabyte-scale span ingestion. Build ring-buffer sampling and adaptive trace rate limiters.',
    unlistedRequirements: [
      'Understanding of memory allocation profiles in Go',
      'Familiarity with distributed tracing semantics',
    ],
  },
  {
    id: 'linear-sync-core',
    role: 'Real-Time Sync Engine Intern',
    company: 'Linear',
    location: 'San Francisco / Remote',
    season: 'Summer 2025',
    fitPercentage: 96,
    tags: [
      { label: 'CRDT Conflict Logic', type: 'matched' },
      { label: 'Local-First SQLite', type: 'matched' },
      { label: 'TypeScript / Canvas', type: 'matched' },
    ],
    mentorshipDepth: 'Tier 1',
    conversionRate: 85,
    coldReachROI: 'High Priority',
    overview:
      'Build client-side mutation caches and optimistic update reconcilers for Linear’s synchronized desktop clients.',
    unlistedRequirements: [
      'Strong mental model for state trees and vector clocks',
      'Passion for 60fps local-first responsiveness',
    ],
  },
  {
    id: 'cloudflare-workers-infra',
    role: 'Edge Compute Engine Intern',
    company: 'Cloudflare',
    location: 'Austin, TX',
    season: 'Summer 2025',
    fitPercentage: 88,
    tags: [
      { label: 'V8 Isolates', type: 'matched' },
      { label: 'Rust Wasm', type: 'matched' },
      { label: 'Anycast Networking', type: 'preferred_gap' },
    ],
    mentorshipDepth: 'Tier 2',
    conversionRate: 74,
    coldReachROI: 'Moderate',
    overview:
      'Work on the V8 isolate execution harness that powers Cloudflare Workers worldwide with zero cold starts.',
    unlistedRequirements: [
      'Low-level systems programming in C++ or Rust',
      'Knowledge of POSIX memory virtualization',
    ],
  },
  {
    id: 'vercel-turbopack',
    role: 'Serverless Compiler Intern',
    company: 'Vercel',
    location: 'Remote',
    season: 'Summer 2025',
    fitPercentage: 89,
    tags: [
      { label: 'Rust Compiler AST', type: 'matched' },
      { label: 'Turbopack Incremental Cache', type: 'matched' },
      { label: 'SWC Plugins', type: 'required_gap' },
    ],
    mentorshipDepth: 'Tier 1',
    conversionRate: 79,
    coldReachROI: 'High Priority',
    overview:
      'Optimize Turbopack’s incremental computation graph for million-line monorepos and Next.js builds.',
    unlistedRequirements: [
      'Graph algorithms & dependency inversion trees',
      'Rust memory safety and concurrency abstractions',
    ],
  },
];

export function TriageCardStack({ onRoleSelected, onOpenEvidence }: TriageCardStackProps) {
  const [deck, setDeck] = useState<TriageRole[]>(INITIAL_ROLES);
  const [shortlisted, setShortlisted] = useState<TriageRole[]>([]);
  const [skipped, setSkipped] = useState<TriageRole[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const totalCards = INITIAL_ROLES.length;
  const currentIndex = totalCards - deck.length;
  const progressPercent = Math.min(1, Math.max(0, currentIndex / totalCards));

  // Motion values for drag
  const x = useMotionValue(0);
  // Rotation mapped to x-offset: ~1 degree per 20px, capped at 12 deg
  const rotate = useTransform(x, [-240, 240], [-12, 12]);
  const rightHintOpacity = useTransform(x, [0, 80], [0, 1]);
  const leftHintOpacity = useTransform(x, [0, -80], [0, 1]);

  const commitCard = useCallback(
    (dir: 'left' | 'right') => {
      if (deck.length === 0) return;
      const currentCard = deck[0];
      setDirection(dir);

      if (dir === 'right') {
        setShortlisted((prev) => [...prev, currentCard]);
      } else {
        setSkipped((prev) => [...prev, currentCard]);
      }

      // Advance deck
      setTimeout(
        () => {
          setDeck((prev) => prev.slice(1));
          setDirection(null);
          x.set(0);
        },
        reducedMotion ? 50 : 180
      );
    },
    [deck, reducedMotion, x]
  );

  // Keyboard controls: S shortlist, X skip, M maybe, arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowRight') {
        setActiveKey('S');
        commitCard('right');
        setTimeout(() => setActiveKey(null), 250);
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'ArrowLeft') {
        setActiveKey('X');
        commitCard('left');
        setTimeout(() => setActiveKey(null), 250);
      } else if (e.key === 'm' || e.key === 'M') {
        setActiveKey('M');
        // 'Maybe' puts it at the back of the queue
        if (deck.length > 0) {
          setDeck((prev) => [...prev.slice(1), prev[0]]);
        }
        setTimeout(() => setActiveKey(null), 250);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commitCard, deck]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 120;
    const velocityThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      commitCard('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      commitCard('left');
    } else {
      // Springs back to center (stiffness 400, damping 30)
    }
  };

  const currentCard = deck[0];
  const secondCard = deck[1];
  const thirdCard = deck[2];

  const resetDeck = () => {
    setDeck(INITIAL_ROLES);
    setShortlisted([]);
    setSkipped([]);
  };

  return (
    <section id="triage-stack-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header & Monospace Progress Telemetry */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#def4de] text-[#0e1f12] text-xs font-mono-code font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#006e0c]"></span>
            <span>TRIAGE COPILOT // RECRUITMENT DECK</span>
          </div>
          <h2 className="font-sans-display text-2xl sm:text-3xl font-bold text-[#0e1f12]">
            Evidence-Based Triage Stack
          </h2>
        </div>

        {/* Counter and Progress Bar */}
        <div className="w-full sm:w-64 bg-white p-3 rounded-xl border border-[#bbcbb3]/40 shadow-sm">
          <div className="flex justify-between items-center text-xs font-mono-code mb-1.5 text-[#4e6351]">
            <span>QUEUE PROGRESS</span>
            <span className="font-bold text-[#0e1f12]">
              {Math.min(totalCards, currentIndex + 1)} / {totalCards}
            </span>
          </div>
          {/* Progress bar animating scaleX over 300ms with origin left */}
          <div className="w-full h-1.5 bg-[#def4de] rounded-full overflow-hidden relative">
            <div
              style={{
                transform: `scaleX(${progressPercent})`,
                transformOrigin: 'left center',
                transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-full h-full bg-[#006e0c] rounded-full transform-gpu"
            />
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="relative min-h-[520px] flex items-center justify-center select-none">
        {deck.length === 0 ? (
          /* Empty Deck State */
          <div className="text-center p-10 bg-white rounded-2xl border border-[#bbcbb3]/40 max-w-md w-full shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#def4de] text-[#006e0c] flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-sans-display text-xl font-bold text-[#0e1f12] mb-2">
              Queue Fully Triaged!
            </h3>
            <p className="font-sans-display text-sm text-[#4e6351] mb-6">
              You shortlisted {shortlisted.length} role{shortlisted.length === 1 ? '' : 's'} and skipped{' '}
              {skipped.length}. You’re ready to review your evidence matrices and export grounded drafts.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onOpenEvidence && shortlisted[0] && onOpenEvidence(shortlisted[0])}
                className="w-full py-3 rounded-full bg-[#35e639] text-[#0e1f12] font-bold text-sm font-sans-display hover:brightness-105 transition-all"
              >
                Inspect Evidence Matrix →
              </button>
              <button
                type="button"
                onClick={resetDeck}
                className="w-full py-2.5 rounded-full border border-[#bbcbb3]/60 text-[#0e1f12] text-xs font-mono-code hover:bg-[#def4de] transition-colors"
              >
                Reset Triage Queue
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-[480px] h-[480px]">
            {/* Card 3 (Back card, offset y:24, scale 0.94, opacity 0.65) */}
            {thirdCard && (
              <div
                style={{
                  transform: 'translateY(24px) scale(0.94)',
                  opacity: 0.65,
                }}
                className="absolute inset-0 bg-white rounded-2xl border border-[#bbcbb3]/40 p-6 pointer-events-none shadow-sm transform-gpu"
              >
                <div className="flex justify-between items-center opacity-40">
                  <span className="font-mono-code text-xs text-[#4e6351]">{thirdCard.company}</span>
                  <span className="font-mono-code text-xs font-bold text-[#006e0c]">
                    {thirdCard.fitPercentage}% FIT
                  </span>
                </div>
              </div>
            )}

            {/* Card 2 (Middle card, offset y:12, scale 0.97, opacity 0.85) */}
            {secondCard && (
              <motion.div
                layout
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                }}
                style={{
                  transform: 'translateY(12px) scale(0.97)',
                  opacity: 0.85,
                }}
                className="absolute inset-0 bg-white rounded-2xl border border-[#bbcbb3]/50 p-6 pointer-events-none shadow-sm transform-gpu"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono-code text-xs text-[#4e6351]">{secondCard.company}</span>
                  <span className="font-mono-code text-xs font-bold text-[#006e0c]">
                    {secondCard.fitPercentage}% FIT
                  </span>
                </div>
                <h4 className="font-sans-display text-base font-bold text-[#0e1f12] mt-2">
                  {secondCard.role}
                </h4>
              </motion.div>
            )}

            {/* Card 1 (Front Interactive Card) */}
            <AnimatePresence mode="popLayout">
              {currentCard && (
                <motion.div
                  key={currentCard.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  style={{
                    x,
                    rotate,
                  }}
                  animate={
                    direction === 'right'
                      ? { x: 600, rotate: 25, opacity: 0 }
                      : direction === 'left'
                      ? { x: -600, rotate: -25, opacity: 0 }
                      : { x: 0, rotate: 0, opacity: 1 }
                  }
                  exit={
                    direction === 'right'
                      ? { x: 600, rotate: 25, opacity: 0 }
                      : { x: -600, rotate: -25, opacity: 0 }
                  }
                  transition={
                    direction
                      ? { duration: 0.3, ease: [0.7, 0, 0.84, 0] }
                      : { type: 'spring', stiffness: 400, damping: 30 }
                  }
                  className={`absolute inset-0 bg-white rounded-2xl border p-6 sm:p-7 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-md select-none transform-gpu ${
                    direction === 'right'
                      ? 'border-[#1e9e4a] ring-2 ring-[#1e9e4a]/30'
                      : direction === 'left'
                      ? 'border-[#bbcbb3] opacity-60 grayscale'
                      : 'border-[#bbcbb3]/60 hover:border-[#6c7b66]'
                  }`}
                >
                  {/* Dynamic Floating Action Hints during drag */}
                  <motion.div
                    style={{ opacity: rightHintOpacity }}
                    className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#def4de] border border-[#1e9e4a] text-[#006e0c] font-mono-code text-xs font-bold pointer-events-none flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>SHORTLIST</span>
                  </motion.div>

                  <motion.div
                    style={{ opacity: leftHintOpacity }}
                    className="absolute top-6 left-6 px-3 py-1 rounded-full bg-[#ffdad6]/60 border border-[#ba1a1a] text-[#ba1a1a] font-mono-code text-xs font-bold pointer-events-none flex items-center gap-1.5 shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>SKIP</span>
                  </motion.div>

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#bbcbb3]/20">
                      <div>
                        <span className="font-mono-code text-xs font-bold text-[#4e6351] uppercase tracking-wider">
                          {currentCard.company}
                        </span>
                        <div className="font-mono-code text-[11px] text-[#6c7b66]">
                          {currentCard.location} · {currentCard.season}
                        </div>
                      </div>

                      {/* Fit Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#def4de] border border-[#1e9e4a]/30 text-[#006e0c] font-mono-code text-xs font-bold">
                        <span>{currentCard.fitPercentage}% FIT</span>
                      </div>
                    </div>

                    {/* Role Title */}
                    <h3 className="font-sans-display text-xl sm:text-2xl font-bold text-[#0e1f12] mt-3 leading-snug">
                      {currentCard.role}
                    </h3>

                    {/* Overview snippet */}
                    <p className="font-sans-display text-xs sm:text-sm text-[#4e6351] mt-2 leading-relaxed">
                      {currentCard.overview}
                    </p>
                  </div>

                  {/* Tags and Match Indicators */}
                  <div className="space-y-2 py-3">
                    <span className="font-mono-code text-[10px] text-[#6c7b66] uppercase tracking-wider block">
                      EVIDENCE SUMMARY
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCard.tags.map((tag, idx) => {
                        const isMatch = tag.type === 'matched';
                        const isPrefGap = tag.type === 'preferred_gap';
                        return (
                          <div
                            key={idx}
                            className={`px-2.5 py-1 rounded-full text-xs font-mono-code flex items-center gap-1.5 border ${
                              isMatch
                                ? 'bg-[#def4de] text-[#006e0c] border-[#1e9e4a]/30'
                                : isPrefGap
                                ? 'bg-[#fef4e6] text-[#e8a33d] border-[#e8a33d]/40'
                                : 'bg-[#fdeeed] text-[#dd5a4a] border-[#dd5a4a]/40'
                            }`}
                          >
                            {isMatch ? (
                              <CheckCircle className="w-3 h-3 text-[#006e0c]" />
                            ) : (
                              <Info className="w-3 h-3" />
                            )}
                            <span>{tag.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#e4f9e3]/60 rounded-xl border border-[#bbcbb3]/30 text-center font-mono-code text-[11px]">
                    <div>
                      <div className="text-[#6c7b66] text-[10px]">Mentorship</div>
                      <div className="font-bold text-[#0e1f12]">{currentCard.mentorshipDepth}</div>
                    </div>
                    <div>
                      <div className="text-[#6c7b66] text-[10px]">Interview Rate</div>
                      <div className="font-bold text-[#0e1f12]">{currentCard.conversionRate}%</div>
                    </div>
                    <div>
                      <div className="text-[#6c7b66] text-[10px]">Cold Reach ROI</div>
                      <div className="font-bold text-[#006e0c]">{currentCard.coldReachROI}</div>
                    </div>
                  </div>

                  {/* Footer Action Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#bbcbb3]/20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenEvidence) onOpenEvidence(currentCard);
                      }}
                      className="text-xs font-mono-code text-[#006e0c] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Evidence Matrix</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="font-mono-code text-[10px] text-[#6c7b66]">
                      DRAG OR USE KEYS
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Physical Control Bar with Key-Press Indicators */}
      {deck.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            id="triage-btn-skip"
            onClick={() => commitCard('left')}
            className={`px-5 py-2.5 rounded-full border border-[#bbcbb3]/60 font-sans-display text-sm font-semibold flex items-center gap-2 hover:bg-[#ffdad6]/30 transition-all ${
              activeKey === 'X' ? 'bg-[#ffdad6]/60 border-[#ba1a1a] scale-95' : 'bg-white text-[#0e1f12]'
            }`}
          >
            <X className="w-4 h-4 text-[#ba1a1a]" />
            <span>Skip</span>
            <kbd className="ml-1 font-mono-code text-[10px] bg-[#e4f9e3] px-1.5 py-0.5 rounded border border-[#bbcbb3]/40 text-[#4e6351]">
              X
            </kbd>
          </button>

          <button
            type="button"
            id="triage-btn-maybe"
            onClick={() => {
              if (deck.length > 0) {
                setDeck((prev) => [...prev.slice(1), prev[0]]);
              }
            }}
            className={`px-5 py-2.5 rounded-full border border-[#bbcbb3]/60 font-sans-display text-sm font-semibold flex items-center gap-2 hover:bg-[#def4de] transition-all ${
              activeKey === 'M' ? 'bg-[#def4de] scale-95' : 'bg-white text-[#0e1f12]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#4e6351]" />
            <span>Maybe</span>
            <kbd className="ml-1 font-mono-code text-[10px] bg-[#e4f9e3] px-1.5 py-0.5 rounded border border-[#bbcbb3]/40 text-[#4e6351]">
              M
            </kbd>
          </button>

          <button
            type="button"
            id="triage-btn-shortlist"
            onClick={() => commitCard('right')}
            className={`px-6 py-2.5 rounded-full font-sans-display text-sm font-bold flex items-center gap-2 hover:brightness-105 transition-all shadow-sm ${
              activeKey === 'S'
                ? 'bg-[#2ed132] scale-95'
                : 'bg-[#35e639] text-[#0e1f12] border border-transparent'
            }`}
          >
            <Check className="w-4 h-4 text-[#002201]" />
            <span>Shortlist Role</span>
            <kbd className="ml-1 font-mono-code text-[10px] bg-[#0e1f12] text-[#35e639] px-1.5 py-0.5 rounded">
              S
            </kbd>
          </button>
        </div>
      )}

      {/* Shortlist summary drawer if items added */}
      {shortlisted.length > 0 && (
        <div className="mt-8 p-4 bg-[#def4de]/80 rounded-xl border border-[#bbcbb3]/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono-code text-xs text-[#0e1f12]">
            <CheckCircle className="w-4 h-4 text-[#006e0c]" />
            <span className="font-bold">{shortlisted.length} Shortlisted Role{shortlisted.length === 1 ? '' : 's'}:</span>
            <span className="text-[#4e6351]">
              {shortlisted.map((s) => s.company).join(', ')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenEvidence && onOpenEvidence(shortlisted[0])}
            className="px-4 py-1.5 rounded-full bg-[#0e1f12] text-[#e1f6e1] font-mono-code text-xs font-semibold hover:bg-[#233426] transition-colors"
          >
            Proceed to Grounding Draft →
          </button>
        </div>
      )}
    </section>
  );
}
