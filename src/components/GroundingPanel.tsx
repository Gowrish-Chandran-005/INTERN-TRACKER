import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../motion/useReducedMotion';
import { CheckCircle, Info, ExternalLink, ShieldCheck, Send, Bookmark, Check } from './Icons';
import type { GroundedSentence, EvidenceCard } from '../types';

export function GroundingPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sentenceRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lineRef = useRef<SVGPathElement | null>(null);

  const [activeSentenceId, setActiveSentenceId] = useState<string | null>('s2'); // pinned initially to show capability
  const [hoveredSentenceId, setHoveredSentenceId] = useState<string | null>(null);
  const [connectorPath, setConnectorPath] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  const sentences: GroundedSentence[] = [
    {
      id: 's1',
      text: 'Hi Alex, I saw your talk on Stripe Core Ledger’s migration toward multi-region Raft state replication.',
      evidenceId: 'e1',
    },
    {
      id: 's2',
      text: 'In my personal distributed-kv engine, I implemented asynchronous snapshot compaction that cut WAL replay latency by 41% across simulated network partitions.',
      evidenceId: 'e2',
    },
    {
      id: 's3',
      text: 'While your team lists Rust and Tokio for high-throughput concurrency, my socket benchmarks in C++ and Go demonstrate equivalent memory zero-copy patterns.',
      evidenceId: 'e3',
    },
    {
      id: 's4',
      text: 'I previously scaled production database clusters serving over 10 million daily active financial accounts.',
      evidenceId: 'e4',
      isWarning: true,
      warningNote: 'Unverified Claim: No public git repository or verifiable transcript artifact found for 10M active user load. Recommend replacing with measured local benchmark telemetry.',
    },
    {
      id: 's5',
      text: 'I would value 15 minutes to share the compaction benchmark telemetry and discuss how I could contribute to your ledger throughput goals this summer.',
      evidenceId: 'e5',
    },
  ];

  const evidenceCards: EvidenceCard[] = [
    {
      id: 'e1',
      source: 'Stripe Engineering Blog & Talk',
      title: 'Ledger Multi-Region Consensus Architecture',
      quote: '"Our 2025 roadmap centers on deterministic Raft state snapshotting across transatlantic data centers."',
      verificationBadge: 'Verified Job Context',
    },
    {
      id: 'e2',
      source: 'github.com/student/distributed-kv',
      title: 'Commit #a9f201 — Async Compactor Engine',
      quote: 'func (r *RaftEngine) CompactSnapshot(meta SnapshotMeta) error { ... cut 41% disk replay stall time }',
      repoOrCommit: 'main / src / engine / compaction.go',
      verificationBadge: 'Verified Codebase Artifact',
    },
    {
      id: 'e3',
      source: 'github.com/student/net-benchmark',
      title: 'Zero-Copy Socket Ring Buffer Benchmarks',
      quote: 'BenchmarkZeroCopyTCP-8: 48,290 req/sec at p99.9 latency 0.32ms with zero allocation runtime.',
      repoOrCommit: 'Release v1.2.0 / bench_test.go',
      verificationBadge: 'Verified Performance Benchmark',
    },
    {
      id: 'e4',
      source: 'Signal Integrity Verifier',
      title: 'Fact-Check: Disputed Quantitative Claim',
      quote: 'No verifiable telemetry or commit history supports 10M DAU claim. Flagged to protect applicant credibility.',
      verificationBadge: 'Static Warning Flag',
    },
    {
      id: 'e5',
      source: 'Candidate Portfolio',
      title: 'Technical Summary Deck & System Diagram',
      quote: 'Interactive performance profiling graphs and replication state machine architectural diagrams.',
      repoOrCommit: 'signal.fyi/student/evidence-deck',
      verificationBadge: 'Verified Portfolio Link',
    },
  ];

  const effectiveId = hoveredSentenceId || activeSentenceId;

  const updateConnectorLine = useCallback((sentenceId: string | null) => {
    if (!sentenceId || !containerRef.current || !svgRef.current) {
      setConnectorPath('');
      return;
    }

    const sentenceEl = sentenceRefs.current[sentenceId];
    const sentenceObj = sentences.find((s) => s.id === sentenceId);
    if (!sentenceEl || !sentenceObj?.evidenceId) {
      setConnectorPath('');
      return;
    }

    const cardEl = cardRefs.current[sentenceObj.evidenceId];
    if (!cardEl) {
      setConnectorPath('');
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const sentenceRect = sentenceEl.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();

    const startX = sentenceRect.right - containerRect.left;
    const startY = sentenceRect.top + sentenceRect.height / 2 - containerRect.top;
    const endX = cardRect.left - containerRect.left;
    const endY = cardRect.top + 28 - containerRect.top;

    const midX = startX + (endX - startX) * 0.5;
    const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
    setConnectorPath(d);

    // Animate connector line drawing over 250ms
    if (lineRef.current && !reducedMotion) {
      const length = Math.hypot(endX - startX, endY - startY) * 1.2;
      gsap.fromTo(
        lineRef.current,
        { strokeDasharray: length, strokeDashoffset: length, opacity: 1 },
        { strokeDashoffset: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [reducedMotion, sentences]);

  useEffect(() => {
    updateConnectorLine(effectiveId);
  }, [effectiveId, updateConnectorLine]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => updateConnectorLine(effectiveId);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [effectiveId, updateConnectorLine]);

  const handleSentenceClick = (sId: string) => {
    setActiveSentenceId(sId);
    const sentenceObj = sentences.find((s) => s.id === sId);
    if (sentenceObj?.evidenceId && rightPaneRef.current) {
      const cardEl = cardRefs.current[sentenceObj.evidenceId];
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleCopyDraft = () => {
    const fullText = sentences
      .filter((s) => !s.isWarning)
      .map((s) => s.text)
      .join(' ');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="grounding-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#def4de] text-[#0e1f12] text-xs font-mono-code font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#006e0c]"></span>
            <span>GROUNDED OUTREACH PROTOCOL</span>
          </div>
          <h2 className="font-sans-display text-2xl sm:text-3xl font-bold text-[#0e1f12]">
            Evidence-Linked Outreach Editor
          </h2>
          <p className="font-sans-display text-sm text-[#4e6351] mt-1">
            Hover or click any claim to inspect its corresponding technical backing in the evidence panel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyDraft}
          className="px-5 py-2.5 rounded-full bg-[#35e639] text-[#0e1f12] font-bold text-xs font-mono-code flex items-center gap-2 hover:brightness-105 transition-all shadow-sm shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          <span>{copied ? 'Grounded Draft Copied!' : 'Copy Grounded Draft'}</span>
        </button>
      </div>

      {/* Main Grounding Matrix Enclosure */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl border border-[#bbcbb3]/40 p-6 md:p-8 shadow-sm overflow-hidden"
      >
        {/* Dynamic SVG Connector Line */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block"
        >
          {connectorPath && (
            <path
              ref={lineRef}
              d={connectorPath}
              fill="none"
              stroke="#006e0c"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transform-gpu"
            />
          )}
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          {/* Left Pane: Interactive Draft Editor */}
          <div
            ref={leftPaneRef}
            className="md:col-span-6 bg-[#eaffe9]/30 rounded-xl p-6 border border-[#bbcbb3]/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#bbcbb3]/20 font-mono-code text-xs">
                <span className="font-bold text-[#0e1f12]">OUTREACH DRAFT // STRIPE LEDGER</span>
                <span className="text-[#006e0c] bg-[#e4f9e3] px-2 py-0.5 rounded-full border border-[#bbcbb3]/30">
                  Zero Hallucination
                </span>
              </div>

              {/* Running Prose with Grounded Interactive Sentences */}
              <div className="space-y-3 font-sans-display text-sm leading-relaxed text-[#0e1f12]">
                <p>
                  {sentences.map((sentence) => {
                    const isHovered = hoveredSentenceId === sentence.id;
                    const isPinned = activeSentenceId === sentence.id;
                    const isWarning = sentence.isWarning;

                    return (
                      <span
                        key={sentence.id}
                        ref={(el) => { sentenceRefs.current[sentence.id] = el; }}
                        onMouseEnter={() => setHoveredSentenceId(sentence.id)}
                        onMouseLeave={() => setHoveredSentenceId(null)}
                        onClick={() => handleSentenceClick(sentence.id)}
                        className={`inline cursor-pointer px-1 py-0.5 rounded transition-all duration-200 mr-1 ${
                          isWarning
                            ? 'bg-[#ffdad6]/40 border-b-2 border-[#ba1a1a] text-[#0e1f12]'
                            : isPinned
                            ? 'bg-[#35e639]/30 border-b-2 border-[#006e0c] font-medium'
                            : isHovered
                            ? 'bg-[#def4de] border-b border-[#006e0c]'
                            : 'hover:bg-[#def4de]/60'
                        }`}
                      >
                        {sentence.text}
                        {isWarning && (
                          /* Static Warning State: icon does NOT pulse or animate. Deliberate static fact. */
                          <span
                            title="Unverified Claim: Flagged by Signal Integrity Verifier"
                            className="inline-flex items-center ml-1 text-[#ba1a1a] font-bold align-middle select-none"
                          >
                            <Info className="w-3.5 h-3.5 inline-block text-[#ba1a1a]" />
                          </span>
                        )}
                      </span>
                    );
                  })}
                </p>

                {/* Persistent Warning Explanation Box if warning sentence active */}
                {sentences.find((s) => s.id === effectiveId)?.isWarning && (
                  <div className="p-3 bg-[#ffdad6]/30 rounded-lg border border-[#ba1a1a]/30 text-xs font-mono-code text-[#ba1a1a]">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <Info className="w-3.5 h-3.5 text-[#ba1a1a]" />
                      <span>FACT-CHECK INTEGRITY ALERT (STATIC)</span>
                    </div>
                    <span>
                      {sentences.find((s) => s.id === effectiveId)?.warningNote}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#bbcbb3]/20 flex items-center justify-between font-mono-code text-[11px] text-[#4e6351]">
              <span>Click sentence to pin connection</span>
              <span className="text-[#006e0c] font-bold">4 Verified Citations</span>
            </div>
          </div>

          {/* Right Pane: Evidence Cards List */}
          <div
            ref={rightPaneRef}
            className="md:col-span-6 space-y-4 max-h-[540px] overflow-y-auto pr-1"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#bbcbb3]/20 font-mono-code text-xs">
              <span className="font-bold text-[#0e1f12] uppercase tracking-wider">
                GROUNDING EVIDENCE SLATE
              </span>
              <span className="text-[#4e6351] text-[11px]">
                Active: {effectiveId || 'None'}
              </span>
            </div>

            {evidenceCards.map((card) => {
              const matchingSentence = sentences.find((s) => s.evidenceId === card.id);
              const isActive = matchingSentence?.id === effectiveId;
              const isWarningCard = card.id === 'e4';

              return (
                <div
                  key={card.id}
                  ref={(el) => { cardRefs.current[card.id] = el; }}
                  onClick={() => {
                    if (matchingSentence) {
                      setActiveSentenceId(matchingSentence.id);
                    }
                  }}
                  className={`p-4 rounded-xl border relative transition-all duration-200 cursor-pointer shadow-sm transform-gpu ${
                    isWarningCard
                      ? isActive
                        ? 'bg-[#ffdad6]/40 border-[#ba1a1a]'
                        : 'bg-white border-[#ba1a1a]/40'
                      : isActive
                      ? 'bg-[#eaffe9] border-[#006e0c] shadow'
                      : 'bg-white border-[#bbcbb3]/40 hover:border-[#6c7b66]'
                  }`}
                >
                  {/* Left Border ScaleY 0 to 1 over 200ms */}
                  <div
                    style={{
                      transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'top center',
                      transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-xl transform-gpu ${
                      isWarningCard ? 'bg-[#ba1a1a]' : 'bg-[#006e0c]'
                    }`}
                  />

                  <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                    <span className="text-[#4e6351] font-semibold">{card.source}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isWarningCard
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#def4de] text-[#006e0c]'
                      }`}
                    >
                      {card.verificationBadge}
                    </span>
                  </div>

                  <h4 className="font-sans-display text-sm font-bold text-[#0e1f12] mb-1.5">
                    {card.title}
                  </h4>

                  <p className="font-mono-code text-xs text-[#3c4b38] bg-[#f8faf8] p-2.5 rounded-lg border border-[#bbcbb3]/20 mb-2 leading-relaxed">
                    {card.quote}
                  </p>

                  {card.repoOrCommit && (
                    <div className="flex items-center gap-1 text-[11px] font-mono-code text-[#006e0c]">
                      <ExternalLink className="w-3 h-3" />
                      <span>{card.repoOrCommit}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
