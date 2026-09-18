export interface TriageRole {
  id: string;
  role: string;
  company: string;
  location: string;
  season: string;
  fitPercentage: number;
  tags: {
    label: string;
    type: 'matched' | 'preferred_gap' | 'required_gap';
  }[];
  mentorshipDepth: 'Tier 1' | 'Tier 2' | 'Tier 3';
  conversionRate: number;
  coldReachROI: 'High Priority' | 'Moderate' | 'Low';
  overview: string;
  unlistedRequirements: string[];
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  evidence: string;
}

export interface RequirementNode {
  id: string;
  name: string;
  priority: 'required' | 'preferred';
  source: string;
}

export interface SkillConnection {
  studentSkillId: string;
  roleReqId: string;
  type: 'matched' | 'gap';
  confidence: number;
}

export interface GroundedSentence {
  id: string;
  text: string;
  evidenceId?: string;
  isWarning?: boolean;
  warningNote?: string;
}

export interface EvidenceCard {
  id: string;
  source: string;
  title: string;
  quote: string;
  repoOrCommit?: string;
  verificationBadge: string;
}
