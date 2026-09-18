import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Loader2,
  Compass,
} from 'lucide-react';

/* ==========================================================================
   1. Sub-components: StepItem, SocialButton, InputGroup
   ========================================================================== */

export interface StepItemProps {
  stepNumber: number;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
}

export function StepItem({ stepNumber, title, description, status }: StepItemProps) {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: stepNumber * 0.12 }}
      className={`relative flex items-start gap-3.5 p-3.5 rounded-2xl backdrop-blur-md transition-all duration-300 ${
        isActive
          ? 'bg-emerald-950/40 border border-emerald-400/40 shadow-[0_0_24px_rgba(52,211,153,0.18)]'
          : isCompleted
          ? 'bg-white/[0.06] border border-white/10'
          : 'bg-black/30 border border-white/5 opacity-70'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
          isCompleted
            ? 'bg-emerald-400 text-black'
            : isActive
            ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/50'
            : 'bg-white/10 text-white/50 border border-white/10'
        }`}
      >
        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : `0${stepNumber}`}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/95 tracking-wide">
            {title}
          </span>
          {isActive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-semibold text-emerald-300 bg-emerald-400/15 px-2 py-0.5 rounded-full border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          )}
        </div>
        <p className="text-[11px] text-white/65 mt-0.5 leading-relaxed truncate">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export interface SocialButtonProps {
  provider: 'google' | 'github' | 'apple';
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SocialButton({ provider, label, onClick, disabled }: SocialButtonProps) {
  const getIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        );
      case 'github':
        return (
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.64 1.35-.56.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.64-1.24z" />
          </svg>
        );
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.015, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      disabled={disabled}
      className="flex-1 min-w-[90px] h-11 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-400/40 text-white/90 text-xs font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
    >
      {getIcon()}
      <span className="truncate">{label}</span>
    </motion.button>
  );
}

export interface InputGroupProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  helperText?: string;
  required?: boolean;
  isPassword?: boolean;
}

export function InputGroup({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  helperText,
  required,
  isPassword,
}: InputGroupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5 w-full text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-medium text-white/80 tracking-wide"
        >
          {label} {required && <span className="text-emerald-400">*</span>}
        </label>
        {helperText && (
          <span className="text-[11px] text-white/45">{helperText}</span>
        )}
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 group-focus-within:text-emerald-400 transition-colors">
          <Icon className="w-4 h-4" />
        </div>

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-11 pl-10 pr-10 rounded-xl bg-white/[0.04] text-white text-sm placeholder:text-white/30 border transition-all duration-200 outline-none ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-white/10 hover:border-white/20 focus:border-emerald-400 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20'
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-rose-400 flex items-center gap-1 mt-1"
        >
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
}

/* ==========================================================================
   2. Main Aurora Registration & Login Interface
   ========================================================================== */

interface AuroraAuthProps {
  onBackToSite: () => void;
  onSuccessNavigate?: () => void;
  initialMode?: 'signup' | 'login';
}

export function AuroraAuth({
  onBackToSite,
  onSuccessNavigate,
  initialMode = 'signup',
}: AuroraAuthProps) {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('Systems & Infrastructure');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password strength calculation
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };
  const passwordStrength = calculateStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid university or student email.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccessNavigate) {
          onSuccessNavigate();
        } else {
          onBackToSite();
        }
      }, 1500);
    }, 1200);
  };

  const disciplines = [
    'Systems & Infrastructure',
    'Fullstack & Distributed',
    'ML Engineering & AI',
    'Security & Cryptography',
  ];

  return (
    <main className="flex min-h-screen w-full bg-[#0b1310] selection:bg-emerald-400/30 p-2 sm:p-3 lg:h-screen lg:overflow-hidden transition-all duration-500 font-sans relative">
      {/* Subtle Aurora Ambient Radial Glows (Minimalist, zero black harshness) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[30%] w-[35vw] h-[35vw] rounded-full bg-emerald-400/5 blur-[140px] pointer-events-none" />

      {/* Outer Shell Wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0e1713]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        
        {/* ====================================================================
            LEFT COLUMN: Hero & Video (52% on desktop, pure video, no dark tint)
            ==================================================================== */}
        <div className="relative w-full lg:w-[52%] h-72 sm:h-96 lg:h-full shrink-0 overflow-hidden bg-black/40 flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
          {/* Pristine Video Canvas without heavy overlays */}
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          />

          {/* Minimalist Top Bar over video */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-xs font-semibold tracking-wider text-white">
                AURORA PROTOCOL
              </span>
            </div>

            <button
              type="button"
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>
          </div>

          {/* Center / Hero Card overlay on left column */}
          <div className="relative z-10 my-auto hidden lg:flex flex-col gap-3 max-w-md">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-300 font-semibold px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-400/30 inline-block">
                Triage Co-Pilot v2.4
              </span>
              <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
                High-Signal Internship Intelligence.
              </h1>
              <p className="text-sm text-white/80 leading-relaxed">
                Connect your engineering portfolio, verify job listings with deterministic bipartite matching, and generate hallucination-free outreach drafts.
              </p>
            </div>

            {/* Interactive <StepItem> components */}
            <div className="space-y-2.5 pt-2">
              <StepItem
                stepNumber={1}
                title="Account Setup & Identity"
                description="Secure student SSO and role preferences"
                status={authMode === 'signup' ? 'active' : 'completed'}
              />
              <StepItem
                stepNumber={2}
                title="Bipartite Evidence Graph"
                description="Deterministic matching against your real commits"
                status={authMode === 'signup' ? 'upcoming' : 'active'}
              />
              <StepItem
                stepNumber={3}
                title="Grounded Cold Outreach"
                description="Zero-hallucination recruiter outreach pipeline"
                status="upcoming"
              />
            </div>
          </div>

          {/* Bottom Live Metric Badge */}
          <div className="relative z-10 flex items-center justify-between pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>94.8% Verified Fit Precision</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-mono text-white/50">
              Zero Marketing Hallucinations
            </span>
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: Form & Auth (Minimal, soft gradients, clean ergonomics)
            ==================================================================== */}
        <div className="w-full lg:w-[48%] flex-1 flex flex-col justify-between overflow-y-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10 relative bg-gradient-to-b from-transparent via-[#0f1b16]/30 to-[#12221b]/40">
          {/* Top Auth Mode Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  authMode === 'signup'
                    ? 'text-black font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {authMode === 'signup' && (
                  <motion.div
                    layoutId="authTabIndicator"
                    className="absolute inset-0 bg-emerald-400 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  authMode === 'login'
                    ? 'text-black font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {authMode === 'login' && (
                  <motion.div
                    layoutId="authTabIndicator"
                    className="absolute inset-0 bg-emerald-400 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Log In</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Form Core Container */}
          <div className="my-auto py-6 max-w-md w-full mx-auto">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      {authMode === 'signup' ? 'Welcome to Aurora!' : 'Authentication Verified'}
                    </h3>
                    <p className="text-xs text-white/70 max-w-xs mx-auto">
                      Your high-signal internship copilot workspace is ready. Transitioning to active session...
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading Triage Stack...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Header Title */}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {authMode === 'signup' ? 'Aurora Sign Up' : 'Welcome Back'}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60">
                      {authMode === 'signup'
                        ? 'Join students finding internships with evidence-backed triage.'
                        : 'Access your saved internship triage cards and outreach drafts.'}
                    </p>
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/45">
                      Fast-Track with SSO
                    </span>
                    <div className="flex items-center gap-2.5">
                      <SocialButton
                        provider="google"
                        label="Google"
                        onClick={() => {
                          setEmail('student@berkeley.edu');
                          setFullName('Alex Chen');
                        }}
                      />
                      <SocialButton
                        provider="github"
                        label="GitHub"
                        onClick={() => {
                          setEmail('alexchen.dev@github.com');
                          setFullName('Alex Chen');
                        }}
                      />
                      <SocialButton
                        provider="apple"
                        label="Apple"
                        onClick={() => {
                          setEmail('alex@icloud.com');
                          setFullName('Alex Chen');
                        }}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative px-3 bg-[#0f1a16] font-mono text-[10px] text-white/40 uppercase tracking-widest rounded-full">
                      Or with email
                    </span>
                  </div>

                  {/* Form Inputs */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                      <InputGroup
                        id="fullName"
                        label="Full Name"
                        placeholder="Alex Chen"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        icon={User}
                        required
                      />
                    )}

                    <InputGroup
                      id="email"
                      label="University / Work Email"
                      type="email"
                      placeholder="alex.chen@stanford.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={Mail}
                      required
                    />

                    {authMode === 'signup' && (
                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-medium text-white/80">
                          Primary Engineering Focus
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {disciplines.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setSelectedDiscipline(item)}
                              className={`px-3 py-2 rounded-xl text-left text-xs font-medium transition-all truncate border ${
                                selectedDiscipline === item
                                  ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50 shadow-sm'
                                  : 'bg-white/[0.03] text-white/65 border-white/10 hover:border-white/20'
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <InputGroup
                        id="password"
                        label="Password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        isPassword
                        required
                        helperText={authMode === 'signup' ? 'Min 8 chars' : undefined}
                      />

                      {/* Password Strength Meter for Sign Up */}
                      {authMode === 'signup' && password.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden flex gap-1">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength <= 25
                                  ? 'bg-rose-400 w-1/4'
                                  : passwordStrength <= 50
                                  ? 'bg-amber-400 w-2/4'
                                  : passwordStrength <= 75
                                  ? 'bg-emerald-300 w-3/4'
                                  : 'bg-emerald-400 w-full'
                              }`}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-white/40">
                            <span>Entropy</span>
                            <span
                              className={
                                passwordStrength >= 75 ? 'text-emerald-400' : 'text-white/60'
                              }
                            >
                              {passwordStrength <= 25
                                ? 'Weak'
                                : passwordStrength <= 50
                                ? 'Fair'
                                : passwordStrength <= 75
                                ? 'Good'
                                : 'Optimal'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Extras row: Remember me & Forgot Password */}
                    {authMode === 'login' ? (
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400/40"
                          />
                          <span>Remember me</span>
                        </label>
                        <button
                          type="button"
                          className="font-medium text-emerald-400 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-start gap-2 cursor-pointer text-xs text-white/60 hover:text-white/80">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400/40"
                        />
                        <span className="text-[11px] leading-tight">
                          I agree to the Signal Protocol Terms of Service and verifiable evidence privacy policy.
                        </span>
                      </label>
                    )}

                    {errorMsg && (
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Main Submit Action Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(52,211,153,0.3)] disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {authMode === 'signup' ? 'Create Aurora Account' : 'Sign In to Workspace'}
                          </span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Mode Switcher Footer */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-white/60">
                      {authMode === 'signup' ? (
                        <>
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={() => setAuthMode('login')}
                            className="font-semibold text-emerald-400 hover:underline ml-1"
                          >
                            Sign In
                          </button>
                        </>
                      ) : (
                        <>
                          Don't have an account?{' '}
                          <button
                            type="button"
                            onClick={() => setAuthMode('signup')}
                            className="font-semibold text-emerald-400 hover:underline ml-1"
                          >
                            Create an account
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Security Assurance */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span>256-BIT CLIENT ENCRYPTION</span>
            <span>NO RESUME SCRAPING</span>
          </div>
        </div>

      </div>
    </main>
  );
}
