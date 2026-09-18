import { useState, useCallback } from 'react';
import { SmoothScroll } from './motion/SmoothScroll';
import { IntroLoader } from './components/IntroLoader';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ScrollSections } from './components/ScrollSections';
import { TriageCardStack } from './components/TriageCardStack';
import { EvidenceDiagram } from './components/EvidenceDiagram';
import { GroundingPanel } from './components/GroundingPanel';
import { PageTransitionOverlay } from './components/PageTransitionOverlay';
import { AuroraAuth, StepItem, SocialButton, InputGroup } from './components/AuroraAuth';
import { Check, ArrowForward, Sparkles } from './components/Icons';

// Exported sub-components as requested
export { StepItem, SocialButton, InputGroup, AuroraAuth };

export type AppView = 'auth' | 'landing' | 'triage' | 'evidence' | 'grounding';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [forceShowIntro, setForceShowIntro] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [pendingView, setPendingView] = useState<AppView | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = useCallback(
    (targetView: AppView) => {
      if (targetView === currentView || isTransitioning) return;
      setPendingView(targetView);
      setIsTransitioning(true);
    },
    [currentView, isTransitioning]
  );

  const handleHoldSwap = useCallback(() => {
    if (pendingView) {
      setCurrentView(pendingView);
    }
  }, [pendingView]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setPendingView(null);
  }, []);

  const handleReplayIntro = () => {
    setIntroFinished(false);
    setForceShowIntro(true);
  };

  const handleIntroComplete = () => {
    setIntroFinished(true);
    setForceShowIntro(false);
  };

  // If in Aurora Auth mode, render the dedicated 2-column registration layout
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen w-full bg-[#0b1310] relative font-sans text-white selection:bg-emerald-400/30">
        <CustomCursor />
        <PageTransitionOverlay
          isTransitioning={isTransitioning}
          onHoldSwap={handleHoldSwap}
          onTransitionComplete={handleTransitionComplete}
        />
        <AuroraAuth
          onBackToSite={() => handleNavigate('landing')}
          onSuccessNavigate={() => handleNavigate('triage')}
          initialMode="signup"
        />

        {/* Floating Quick Navigation Pill */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            type="button"
            onClick={() => handleNavigate('landing')}
            className="px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-emerald-300 hover:text-emerald-200 flex items-center gap-2 shadow-lg transition-all"
          >
            <span>Explore Signal Protocol</span>
            <ArrowForward className="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-[#eaf9eb] to-[#f4fbf5] text-[#0e1f12] selection:bg-[#35e639] selection:text-[#0e1f12] relative overflow-x-hidden font-sans-display">
        {/* Ambient Minimalist Gradient Glow Orbs across website */}
        <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-emerald-200/25 to-teal-100/30 blur-[120px] pointer-events-none" />
        <div className="absolute top-[35%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-green-200/20 to-emerald-100/25 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-teal-200/20 to-emerald-200/20 blur-[140px] pointer-events-none" />

        {/* Section 8b: Custom Cursor */}
        <CustomCursor />

        {/* Section 8c: Scroll Progress Bar */}
        <ScrollProgress />

        {/* Section 2: Intro Loader Sequence */}
        <IntroLoader onComplete={handleIntroComplete} forceShow={forceShowIntro} />

        {/* Section 8a: Full-Bleed Page Transition Overlay */}
        <PageTransitionOverlay
          isTransitioning={isTransitioning}
          onHoldSwap={handleHoldSwap}
          onTransitionComplete={handleTransitionComplete}
        />

        {/* Persistent Fixed Header with Aurora Sign In */}
        <Header
          activeView={currentView}
          onNavigate={handleNavigate}
          onReplayIntro={handleReplayIntro}
        />

        {/* Floating Quick Navigation Pill to Aurora Sign Up */}
        <div className="fixed bottom-4 right-4 z-40">
          <button
            type="button"
            onClick={() => handleNavigate('auth')}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0e1f12] to-[#1a3822] hover:from-[#162d1c] hover:to-[#22442b] border border-emerald-500/30 text-xs font-mono font-medium text-emerald-300 flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Aurora Sign Up</span>
          </button>
        </div>

        {/* Main Content Areas */}
        <main className="pt-20 relative z-10">
          {currentView === 'landing' && (
            <div>
              {/* Section 3: Hero Section */}
              <HeroSection
                introFinished={introFinished}
                onTriageClick={() => handleNavigate('triage')}
                onExploreClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Section 4: Scroll Sections */}
              <ScrollSections
                onTriageClick={() => handleNavigate('triage')}
                onOpenGrounding={() => handleNavigate('grounding')}
              />

              {/* Integrated Interactive Teaser for Triage Stack */}
              <section className="w-full bg-gradient-to-b from-[#def4de]/60 to-[#d5edd5]/40 border-t border-[#bbcbb3]/40 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <span className="font-mono-code text-xs uppercase tracking-widest text-[#006e0c] font-semibold bg-white/90 px-3 py-1 rounded-full border border-[#bbcbb3]/40 shadow-xs">
                    LIVE RECRUITMENT BENCHMARK
                  </span>
                  <h2 className="font-sans-display text-3xl font-bold text-[#0e1f12] mt-3 mb-2">
                    Ready to triage your summer 2025 pipeline?
                  </h2>
                  <p className="text-[#4e6351] max-w-xl mx-auto text-sm sm:text-base mb-6">
                    Step into the physics-driven triage stack. Filter high-signal systems internships with keyboard ergonomics and evidence-backed fit calculations.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleNavigate('triage')}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0e1f12] to-[#1c3823] text-white font-bold text-sm inline-flex items-center gap-2 hover:bg-[#233426] transition-all shadow-sm"
                    >
                      <span>Launch Triage Card Stack</span>
                      <ArrowForward className="w-4 h-4 text-[#35e639]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate('auth')}
                      className="px-6 py-3 rounded-full bg-white border border-[#bbcbb3]/60 text-[#006e0c] font-semibold text-sm hover:bg-[#def4de] transition-colors shadow-xs"
                    >
                      Create Aurora Account
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentView === 'triage' && (
            <div className="py-8">
              {/* Section 5: Signature Triage Card Stack */}
              <TriageCardStack
                onRoleSelected={(_role) => handleNavigate('evidence')}
                onOpenEvidence={(_role) => handleNavigate('evidence')}
              />

              {/* Inline Navigation Prompt */}
              <div className="max-w-5xl mx-auto px-4 mt-8 flex items-center justify-between border-t border-[#bbcbb3]/30 pt-6">
                <button
                  type="button"
                  onClick={() => handleNavigate('landing')}
                  className="font-mono-code text-xs text-[#4e6351] hover:text-[#0e1f12]"
                >
                  ← Return to Overview
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('evidence')}
                  className="font-mono-code text-xs text-[#006e0c] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Go to Evidence Diagram</span>
                  <ArrowForward className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {currentView === 'evidence' && (
            <div className="py-8">
              {/* Section 6: Evidence Diagram */}
              <EvidenceDiagram onNextStep={() => handleNavigate('grounding')} />

              <div className="max-w-6xl mx-auto px-4 mt-8 flex items-center justify-between border-t border-[#bbcbb3]/30 pt-6">
                <button
                  type="button"
                  onClick={() => handleNavigate('triage')}
                  className="font-mono-code text-xs text-[#4e6351] hover:text-[#0e1f12]"
                >
                  ← Back to Triage Stack
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('grounding')}
                  className="font-mono-code text-xs text-[#006e0c] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Proceed to Grounded Outreach Editor</span>
                  <ArrowForward className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {currentView === 'grounding' && (
            <div className="py-8">
              {/* Section 7: Grounding Panel */}
              <GroundingPanel />

              <div className="max-w-6xl mx-auto px-4 mt-8 flex items-center justify-between border-t border-[#bbcbb3]/30 pt-6">
                <button
                  type="button"
                  onClick={() => handleNavigate('evidence')}
                  className="font-mono-code text-xs text-[#4e6351] hover:text-[#0e1f12]"
                >
                  ← Back to Evidence Graph
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('landing')}
                  className="font-mono-code text-xs text-[#006e0c] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Return to Product Landing</span>
                  <ArrowForward className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Global Footer with Refined Minimal Gradient (no harsh pitch black) */}
        <footer className="w-full bg-gradient-to-b from-[#112417] via-[#14291a] to-[#0c1a10] text-[#e1f6e1] border-t border-emerald-900/40 pt-16 pb-12 mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/40">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida/AEtjO1UvOHGNoFONiFh67GQs7fl6u0ENTEp48I4xxg-u0BnvyBEgpByo5S9bRYJ1xl3GxeYwHv8DEvTj4BIRaSdo0WqvKeMFEAkowKZEKPn9LjY7G1A7iWA-VaD9lDpgdpqkVT8c-6ZfZ7Sl-ptfibbGP4O6v7w-MZuqKInkEs5WOLousLrIrSydbzVBQVWHoF0E0ncpNr4L5prxjMre5Nb2kU1FJXPPB7_TeoAKetyIBnneUOs4SFoRPaBRzxY"
                    alt="Signal Mark"
                    className="h-7 w-auto invert"
                  />
                  <span className="font-sans-display text-xl font-bold tracking-tight text-white">
                    SIGNAL
                  </span>
                </div>
                <p className="font-sans-display text-sm text-[#a3b899] max-w-sm leading-relaxed">
                  The evidence-based internship triage copilot for engineering students. Deterministic fit-band verification and zero-hallucination cold outreach.
                </p>
                <div className="flex items-center gap-2 font-mono-code text-xs text-[#35e639]">
                  <span className="w-2 h-2 rounded-full bg-[#35e639] animate-pulse"></span>
                  <span>PROTOCOL STATUS: OPTIMAL (60 FPS VERIFIED)</span>
                </div>
              </div>

              <div>
                <h4 className="font-mono-code text-xs font-semibold text-white uppercase tracking-wider mb-4">
                  Navigation Layers
                </h4>
                <ul className="space-y-2.5 font-sans-display text-sm text-[#a3b899]">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('landing')}
                      className="hover:text-white transition-colors"
                    >
                      Product Landing
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('auth')}
                      className="hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Aurora Sign Up</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('triage')}
                      className="hover:text-white transition-colors"
                    >
                      Triage Card Stack (Section 5)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('evidence')}
                      className="hover:text-white transition-colors"
                    >
                      Evidence Diagram (Section 6)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('grounding')}
                      className="hover:text-white transition-colors"
                    >
                      Grounding Link Panel (Section 7)
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono-code text-xs font-semibold text-white uppercase tracking-wider mb-4">
                  Motion Engine Audit
                </h4>
                <div className="space-y-2 font-mono-code text-xs text-[#a3b899]">
                  <div>• GSAP 3.12 + ScrollTrigger Scrub</div>
                  <div>• Framer Motion (useTransform, Spring 260/26)</div>
                  <div>• Lenis 1.2 Smooth Scroll Synchronization</div>
                  <div>• Composite Only (Transform & Opacity)</div>
                  <div>• prefers-reduced-motion Fallbacks</div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs text-[#6c7b66]">
              <div>© 2025 SIGNAL PROTOCOL. ALL RIGHTS RESERVED.</div>
              <div className="flex items-center gap-4">
                <span>PRESS ESC TO SKIP INTRO</span>
                <span>•</span>
                <span>DESKTOP OPTIMIZED</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
