import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResearchNote, ConnectedUser } from '../types';

interface QuizResult {
  date: string;
  score: number;
  total: number;
  percentage: number;
}

interface UserDataContextType {
  completedSteps: Record<string, boolean>;
  toggleStepCompletion: (stepId: string) => void;
  isStepCompleted: (stepId: string) => boolean;
  bookmarkedTools: string[];
  toggleBookmarkTool: (toolId: string) => void;
  isToolBookmarked: (toolId: string) => boolean;
  quizHistory: QuizResult[];
  recordQuizResult: (score: number, total: number) => void;
  savedNotes: ResearchNote[];
  addNote: (note: Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<ResearchNote>) => void;
  deleteNote: (id: string) => void;
  totalCompletedStepsCount: number;
  connectedUsersList: ConnectedUser[];
  addConnectedUser: (user: Omit<ConnectedUser, 'id' | 'subscribedDate'>) => void;
  deleteConnectedUser: (id: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const STEPS_KEY = 'arif_bio_completed_steps';
const BOOKMARKS_KEY = 'arif_bio_bookmarked_tools';
const QUIZ_KEY = 'arif_bio_quiz_history';
const NOTES_KEY = 'arif_bio_saved_notes';
const USERS_KEY = 'arif_bio_connected_users_list';

const defaultConnectedUsers: ConnectedUser[] = [
  {
    id: 'BIO-1001',
    name: 'Arif Uddin',
    email: 'fivupw005@gmail.com',
    phone: '+92 309 9062590',
    role: 'Bioinformatics Lead & Educator (Admin)',
    institution: 'Bioinformatics Research & Learning Hub',
    status: 'Active - Lifetime VIP',
    subscribedDate: '2026-01-15'
  },
  {
    id: 'BIO-1002',
    name: 'Dr. Farhan Tariq',
    email: 'farhan.tariq@biotech-research.edu',
    phone: '+92 301 4455667',
    role: 'Assistant Professor (Plant Genomics)',
    institution: 'Agricultural Genomics Centre',
    status: 'Active - Subscriber',
    subscribedDate: '2026-02-10'
  },
  {
    id: 'BIO-1003',
    name: 'Ayesha Noor',
    email: 'ayesha.noor@gcuf.edu.pk',
    phone: '+92 321 8899123',
    role: 'PhD Scholar (RNA-seq Transcriptomics)',
    institution: 'Bioinformatics Lab',
    status: 'Active - Subscriber',
    subscribedDate: '2026-02-22'
  },
  {
    id: 'BIO-1004',
    name: 'Muhammad Bilal',
    email: 'bilal.bioinfo@gmail.com',
    phone: '+92 333 7788990',
    role: 'MPhil Student (Molecular Docking)',
    institution: 'Structural Biology Group',
    status: 'Active - Subscriber',
    subscribedDate: '2026-03-01'
  },
  {
    id: 'BIO-1005',
    name: 'Zainab Fatima',
    email: 'zainab.fatima@molbio.org',
    phone: '+92 312 6655443',
    role: 'BS Researcher (Sequence Analysis)',
    institution: 'Computational Biology Department',
    status: 'Active - Subscriber',
    subscribedDate: '2026-03-05'
  }
];

const defaultNotes: ResearchNote[] = [
  {
    id: 'note-1',
    title: 'Bulk RNA-seq DESeq2 Pipeline Parameters Checklist',
    category: 'Transcriptomics',
    content: `# DESeq2 Protocol & Standard Parameters
1. FeatureCounts: Use \`-p --countReadPairs\` for paired-end Illumina datasets.
2. Pre-filtering: Keep genes with count >= 10 in at least 3 biological replicates.
3. Statistical Significance: Filter by \`padj < 0.05\` and \`|log2FC| >= 1.0\`.
4. Visualization: EnhancedVolcano for publication-quality volcano plots and ComplexHeatmap for hierarchical clustering.`,
    tags: ['RNA-seq', 'DESeq2', 'R Bioconductor', 'Transcriptomics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'Structure-Based Virtual Screening & AutoDock Vina Setup',
    category: 'Structural Biology',
    content: `# Virtual Screening & Molecular Docking Setup
1. Receptor Preparation: Add polar hydrogens, assign Kollman charges, delete crystallographic water molecules.
2. Grid Box Configuration: Center on known catalytic pocket; define exhaustiveness >= 16.
3. Benchmark Validation: Re-dock co-crystallized native ligand and confirm RMSD < 2.0 Å.
4. ADMET Profiling: Evaluate Lipinski Rule of 5 and synthetic accessibility on SwissADME.`,
    tags: ['Docking', 'AutoDock Vina', 'PyMOL', 'Drug Discovery'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start learning phase from 0 (empty object) as requested
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STEPS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [bookmarkedTools, setBookmarkedTools] = useState<string[]>(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    return saved ? JSON.parse(saved) : ['ncbi-blast', 'alphafold-db', 'deseq2', 'autodock-vina', 'r-bioinformatics'];
  });

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem(QUIZ_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [savedNotes, setSavedNotes] = useState<ResearchNote[]>(() => {
    const saved = localStorage.getItem(NOTES_KEY);
    return saved ? JSON.parse(saved) : defaultNotes;
  });

  const [connectedUsersList, setConnectedUsersList] = useState<ConnectedUser[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : defaultConnectedUsers;
  });

  useEffect(() => {
    localStorage.setItem(STEPS_KEY, JSON.stringify(completedSteps));
  }, [completedSteps]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedTools));
  }, [bookmarkedTools]);

  useEffect(() => {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(quizHistory));
  }, [quizHistory]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(connectedUsersList));
  }, [connectedUsersList]);

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const isStepCompleted = (stepId: string) => {
    return !!completedSteps[stepId];
  };

  const toggleBookmarkTool = (toolId: string) => {
    setBookmarkedTools(prev =>
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  const isToolBookmarked = (toolId: string) => {
    return bookmarkedTools.includes(toolId);
  };

  const recordQuizResult = (score: number, total: number) => {
    const newResult: QuizResult = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score,
      total,
      percentage: Math.round((score / total) * 100),
    };
    setQuizHistory(prev => [newResult, ...prev.slice(0, 19)]);
  };

  const addNote = (noteData: Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: ResearchNote = {
      ...noteData,
      id: 'note-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, noteData: Partial<ResearchNote>) => {
    setSavedNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...noteData, updatedAt: new Date().toISOString() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setSavedNotes(prev => prev.filter(note => note.id !== id));
  };

  const addConnectedUser = (userData: Omit<ConnectedUser, 'id' | 'subscribedDate'>) => {
    const newUser: ConnectedUser = {
      ...userData,
      id: `BIO-${1000 + connectedUsersList.length + 1}`,
      subscribedDate: new Date().toISOString().split('T')[0]
    };
    setConnectedUsersList(prev => [newUser, ...prev]);
  };

  const deleteConnectedUser = (id: string) => {
    setConnectedUsersList(prev => prev.filter(u => u.id !== id));
  };

  const totalCompletedStepsCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <UserDataContext.Provider
      value={{
        completedSteps,
        toggleStepCompletion,
        isStepCompleted,
        bookmarkedTools,
        toggleBookmarkTool,
        isToolBookmarked,
        quizHistory,
        recordQuizResult,
        savedNotes,
        addNote,
        updateNote,
        deleteNote,
        totalCompletedStepsCount,
        connectedUsersList,
        addConnectedUser,
        deleteConnectedUser,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
