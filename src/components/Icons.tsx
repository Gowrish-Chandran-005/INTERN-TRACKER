import React from 'react';
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Info as LucideInfo,
  Link2,
  ShieldCheck as LucideShieldCheck,
  Check,
  Search,
  FileText,
  Activity,
  Layers,
  Sparkles,
  GitPullRequest,
  CheckCheck,
  X,
  Bookmark,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Sliders,
  Send,
  CornerDownRight,
  User,
} from 'lucide-react';

export const ArrowForward: React.FC<{ className?: string }> = ({ className }) => (
  <ArrowRight className={className} />
);

export const ArrowDownward: React.FC<{ className?: string }> = ({ className }) => (
  <ArrowDown className={className} />
);

export const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={className} />
);

export const Info: React.FC<{ className?: string }> = ({ className }) => (
  <AlertCircle className={className} />
);

export const Link: React.FC<{ className?: string }> = ({ className }) => (
  <Link2 className={className} />
);

export const ShieldCheck: React.FC<{ className?: string }> = ({ className }) => (
  <LucideShieldCheck className={className} />
);

export {
  Check,
  Search,
  FileText,
  Activity,
  Layers,
  Sparkles,
  GitPullRequest,
  CheckCheck,
  X,
  Bookmark,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Sliders,
  Send,
  CornerDownRight,
  User,
  LucideInfo,
};
