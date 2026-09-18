import React from 'react';
import { ArrowForward, User, Sparkles } from './Icons';

interface HeaderProps {
  activeView: 'landing' | 'triage' | 'evidence' | 'grounding' | 'auth';
  onNavigate: (view: 'landing' | 'triage' | 'evidence' | 'grounding' | 'auth') => void;
  onReplayIntro: () => void;
}

export function Header({ activeView, onNavigate, onReplayIntro }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#bbcbb3]/40 transition-colors shadow-[0_4px_24px_rgba(0,110,12,0.03)]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Mark */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1UvOHGNoFONiFh67GQs7fl6u0ENTEp48I4xxg-u0BnvyBEgpByo5S9bRYJ1xl3GxeYwHv8DEvTj4BIRaSdo0WqvKeMFEAkowKZEKPn9LjY7G1A7iWA-VaD9lDpgdpqkVT8c-6ZfZ7Sl-ptfibbGP4O6v7w-MZuqKInkEs5WOLousLrIrSydbzVBQVWHoF0E0ncpNr4L5prxjMre5Nb2kU1FJXPPB7_TeoAKetyIBnneUOs4SFoRPaBRzxY"
            alt="SIGNAL Brand Mark"
            className="h-8 w-auto object-contain"
          />
          <span className="font-sans-display text-xl font-bold tracking-tight text-[#0e1f12]">
            SIGNAL
          </span>
        </div>

        {/* Navigation Tabs with Active Indicator */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`font-sans-display text-sm transition-colors relative py-1 ${
              activeView === 'landing'
                ? 'text-[#0e1f12] font-semibold'
                : 'text-[#4e6351] hover:text-[#0e1f12]'
            }`}
          >
            Product
            {activeView === 'landing' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006e0c] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('triage')}
            className={`font-sans-display text-sm transition-colors relative py-1 flex items-center gap-1.5 ${
              activeView === 'triage'
                ? 'text-[#0e1f12] font-semibold'
                : 'text-[#4e6351] hover:text-[#0e1f12]'
            }`}
          >
            <span>Triage Stack</span>
            <span className="px-1.5 py-0.2 bg-[#def4de] text-[#006e0c] font-mono-code text-[10px] rounded-full font-bold">
              Core
            </span>
            {activeView === 'triage' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006e0c] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('evidence')}
            className={`font-sans-display text-sm transition-colors relative py-1 ${
              activeView === 'evidence'
                ? 'text-[#0e1f12] font-semibold'
                : 'text-[#4e6351] hover:text-[#0e1f12]'
            }`}
          >
            Evidence Graph
            {activeView === 'evidence' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006e0c] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('grounding')}
            className={`font-sans-display text-sm transition-colors relative py-1 ${
              activeView === 'grounding'
                ? 'text-[#0e1f12] font-semibold'
                : 'text-[#4e6351] hover:text-[#0e1f12]'
            }`}
          >
            Outreach Draft
            {activeView === 'grounding' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006e0c] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('auth')}
            className={`font-sans-display text-sm transition-colors relative py-1 flex items-center gap-1.5 ${
              activeView === 'auth'
                ? 'text-[#0e1f12] font-semibold'
                : 'text-[#4e6351] hover:text-[#0e1f12]'
            }`}
          >
            <span className="relative z-10">Aurora Sign In</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {activeView === 'auth' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006e0c] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReplayIntro}
            title="Replay 1.6s Motion Intro Loader"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#bbcbb3]/50 text-xs font-mono-code text-[#4e6351] hover:bg-[#def4de] transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#006e0c]" />
            <span>Replay Intro</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('auth')}
            className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-[#e8fae8] to-[#def4de] hover:from-[#def4de] hover:to-[#d2edd2] border border-[#bbcbb3]/60 text-[#006e0c] px-4 py-2 font-sans-display text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => onNavigate('auth')}
            className="rounded-full bg-gradient-to-r from-[#0e1f12] via-[#1a3320] to-[#0e1f12] text-[#ffffff] px-5 py-2 font-sans-display text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 hover:shadow-md transition-all shadow-sm border border-emerald-900/30"
          >
            <span>Get Started</span>
            <ArrowForward className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <div
            onClick={() => onNavigate('auth')}
            title="Open Aurora Sign Up & Login"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006e0c] to-[#35e639] flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
          >
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
