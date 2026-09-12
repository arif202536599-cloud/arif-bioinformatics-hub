export type ToolCategory =
  | 'All'
  | 'Genomics & Sequence'
  | 'Transcriptomics & RNA-seq'
  | 'Structure & Docking'
  | 'Phylogenetics'
  | 'Databases'
  | 'Pathways & Networks'
  | 'Plant Bioinformatics'
  | 'Programming & CLI';

export type ToolLevel = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface BioSoftware {
  id: string;
  name: string;
  category: ToolCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  purpose: string;
  inputType: string;
  outputType: string;
  bestUseCase: string;
  websiteUrl: string;
  tags: string[];
  documentationUrl?: string;
  citation?: string;
  sampleCommand?: string;
}

export interface PathwayStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  rationale: string;
  recommendedTools: string[];
  inputFormat: string;
  outputFormat: string;
  codeSnippet?: string;
  codeLanguage?: string;
  keyTip: string;
}

export interface LearningPathway {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: PathwayStep[];
  outcome: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ProteinDomain {
  name: string;
  start: number;
  end: number;
  description: string;
  color: string;
}

export interface GOTerm {
  id: string;
  name: string;
  type: 'Biological Process' | 'Molecular Function' | 'Cellular Component';
}

export interface ProteinProfile {
  id: string;
  name: string;
  geneSymbol: string;
  organism: string;
  uniprotId: string;
  pdbId?: string;
  alphaFoldId?: string;
  sequence: string;
  length: number;
  molecularWeight: string;
  isoelectricPoint: number;
  predictedLocalization: string;
  functionSummary: string;
  domains: ProteinDomain[];
  pathways: string[];
  goTerms: GOTerm[];
  suggestedAnalyses: string[];
  externalLinks: {
    label: string;
    url: string;
    badge: string;
    type: string;
  }[];
}

export interface AIToolInfo {
  id: string;
  name: string;
  tagline: string;
  category: string;
  logo: string;
  officialUrl: string;
  keyFeatures: string[];
  recommendedUse: string;
  examplePrompt: string;
  limitations: string;
  cautionLevel: 'Low' | 'Medium' | 'High';
}

export interface ResearchPillar {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  keyGoals: string[];
  bestPractices: string[];
  commonMistakes: string[];
  sampleTemplate: string;
}

export interface CitationStyleExample {
  style: string;
  description: string;
  inTextExample: string;
  bibliographyExample: string;
  fieldsUsed: string[];
}

export interface ResearchNote {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ConnectedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  institution?: string;
  status: 'Active - Lifetime VIP' | 'Active - Subscriber' | 'Guest' | 'Pending';
  subscribedDate: string;
}

export interface UserProgressState {
  completedSteps: Record<string, boolean>; // stepId -> boolean
  quizHistory: {
    date: string;
    score: number;
    total: number;
  }[];
  bookmarkedToolIds: string[];
  savedNotes: ResearchNote[];
  guestMode: boolean;
  userEmail?: string;
}

