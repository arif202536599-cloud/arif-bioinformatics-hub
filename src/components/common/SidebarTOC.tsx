import React from 'react';
import { 
  X, Dna, BookOpen, Database, Atom, FileText, Bot, User, 
  Users, CheckCircle2, Bookmark, Mail, Phone, 
  ChevronRight, Sparkles, Compass, ShieldCheck, Download
} from 'lucide-react';
import { YoutubeIcon } from './YoutubeIcon';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

interface SidebarTOCProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SidebarTOC: React.FC<SidebarTOCProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const { totalCompletedStepsCount, bookmarkedTools, connectedUsersList } = useUserData();

  if (!isOpen) return null;

  const mainSections = [
    { id: 'home', label: 'Home Dashboard', icon: Dna, badge: 'Overview' },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen, badge: '5 Pathways' },
    { id: 'software', label: 'Software & Databases', icon: Database, badge: '38+ Tools' },
    { id: 'protein', label: 'Protein 3D Explorer', icon: Atom, badge: '3D Simulation' },
    { id: 'research', label: 'Research Hub & 2026 Roadmap', icon: FileText, badge: '7 Pillars' },
    { id: 'ai', label: 'AI in Bioinformatics', icon: Bot, badge: 'Responsible AI' },
    { id: 'subscribers', label: 'Connected Users & Excel Portal', icon: Users, badge: `${connectedUsersList.length} Connected` },
    { id: 'progress', label: 'My Learning Progress', icon: CheckCircle2, badge: `${totalCompletedStepsCount} Done` },
    { id: 'notes', label: 'Saved Research Notes', icon: Bookmark, badge: `${bookmarkedTools.length} Tools` },
  ];

  const tocSubSections: Record<string, { title: string; items: string[] }> = {
    home: {
      title: 'Home Sections',
      items: [
        'Interactive Bio-Utility Sequence Suite',
        'Dynamic Platform Metrics',
        'Featured Learning Pathways',
        'Bioinformatics Research Helper & Advisor'
      ]
    },
    learning: {
      title: '5 Core Pathways',
      items: [
        '1. Bulk RNA-seq Transcriptomics Pipeline',
        '2. Genome-Wide Gene Family Analysis',
        '3. Comprehensive Protein 3D Docking',
        '4. Proteomics → Multi-Omics → Drug Design',
        '5. Drug Discovery Preclinical Development',
        'Daily Bioinformatics Quiz (5 Questions)'
      ]
    },
    software: {
      title: 'Catalog Highlights',
      items: [
        'Genomics & BLAST Sequence Tools',
        'Structural Docking (Vina, PyRx, PyMOL)',
        'Transcriptomics & RNA-seq Aligners',
        'Plant Genomics (Gramene, Ensembl Plants)',
        'R & Bioconductor Masterclass'
      ]
    },
    protein: {
      title: 'Structural Explorer',
      items: [
        'Target Search & Benchmark Presets',
        'Interactive 3D Molecular Canvas (Cartoon Mode)',
        'Pfam Conserved Domain Coordinates Bar',
        'Physicochemical Parameters (pI, MW, 384 aa)',
        'Downloadable Safe Analysis Checklist'
      ]
    },
    research: {
      title: 'Research Methodology',
      items: [
        '2026 Computational Biology Roadmap',
        'The 7 Core Pillars of Research Writing',
        'Citation Formatter (APA, Nature, IEEE)',
        'Bioinformatics Research Helper (BS/MPhil/PhD)',
        'Literature Review Matrix & Synopsis'
      ]
    },
    ai: {
      title: 'Responsible AI Suite',
      items: [
        'Mandatory Research Ethics Protocol',
        '8 Verified AI Systems for Biology',
        'Bioinformatics Prompt Engineering Sandbox',
        'Data Privacy & Hallucination Prevention'
      ]
    },
    subscribers: {
      title: 'User Analytics & Subscriptions',
      items: [
        'Private Admin Verification (PIN: 2026)',
        'Connected Users Directory & Excel Export',
        'Public Subscription Portal',
        'YouTube Channel Community'
      ]
    }
  };

  const currentTOC = tocSubSections[activeTab] || tocSubSections.home;

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Left Drawer */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-[#fffdfa] border-r border-orange-200 shadow-2xl flex flex-col justify-between z-10 animate-slideInLeft overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Dna className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight leading-none text-white">
                  Table of Contents
                </h3>
                <p className="text-[11px] text-orange-100 mt-1 font-medium">
                  Arif Bioinformatics Research Hub
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close Table of Contents"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
          {/* Main Navigation Modules */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 px-2 block mb-2">
              Primary Hub Sections:
            </span>
            {mainSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveTab(sec.id);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl font-semibold flex items-center justify-between transition-all duration-150 ${
                    isActive
                      ? 'bg-orange-100 text-orange-900 border border-orange-300 shadow-sm'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-orange-950'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                    <span>{sec.label}</span>
                  </div>
                  {sec.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-orange-200 text-orange-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Page Sub-Sections Table of Contents */}
          <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2.5">
            <div className="flex items-center space-x-2 text-orange-900 font-bold text-xs border-b border-orange-200 pb-1.5">
              <Compass className="w-3.5 h-3.5 text-orange-600" />
              <span>{currentTOC.title}</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700">
              {currentTOC.items.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* YouTube Channel Spotlight */}
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <div className="flex items-center space-x-2 text-red-900 font-bold text-xs">
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              <span>Bioinformatics Mastery</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Watch step-by-step video tutorials on RNA-seq, molecular docking, and plant bioinformatics.
            </p>
            <a
              href="https://www.youtube.com/@Bioinformatics_Mastery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-red-700 hover:text-red-900 hover:underline"
            >
              <span>Subscribe on YouTube</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Drawer Bottom Credit & Contact */}
        <div className="p-4 border-t border-orange-200 bg-orange-50/50 space-y-2 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
            <span>Author: Arif Uddin (MPhil)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Mail className="w-3 h-3 text-orange-600" />
            <span className="font-mono">fivupw005@gmail.com</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Phone className="w-3 h-3 text-emerald-600" />
            <span className="font-mono">+92 309 9062590</span>
          </div>
        </div>
      </div>
    </div>
  );
};
