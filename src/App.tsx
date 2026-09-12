import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SidebarTOC } from './components/common/SidebarTOC';
import { WelcomeModal } from './components/common/WelcomeModal';
import { CommandPalette } from './components/common/CommandPalette';
import { AuthModal } from './components/auth/AuthModal';

// Home components
import { ProfileHero } from './components/home/ProfileHero';
import { QuickToolbox } from './components/home/QuickToolbox';
import { HubStats } from './components/home/HubStats';
import { FeaturedPaths } from './components/home/FeaturedPaths';

// Learning components
import { PathwayVisualizer } from './components/learning/PathwayVisualizer';
import { DailyQuiz } from './components/learning/DailyQuiz';

// Software components
import { ToolFilterBar } from './components/software/ToolFilterBar';
import { ToolCard } from './components/software/ToolCard';
import { RBioinformaticsGuide } from './components/software/RBioinformaticsGuide';
import { softwareDatabaseList } from './data/softwareData';
import { ToolCategory, ToolLevel } from './types';

// Protein components
import { ProteinSearch } from './components/protein/ProteinSearch';
import { ProteinAnalysisPanel } from './components/protein/ProteinAnalysisPanel';
import { demoProteins } from './data/proteinDemoData';

// Research components
import { ResearchRoadmap2026 } from './components/research/ResearchRoadmap2026';
import { ResearchPillars } from './components/research/ResearchPillars';
import { CitationFormatter } from './components/research/CitationFormatter';
import { ResearchHelper } from './components/research/ResearchHelper';
import { LitReviewMatrix } from './components/research/LitReviewMatrix';

// AI components
import { AIEthicsWarning } from './components/ai/AIEthicsWarning';
import { AICard } from './components/ai/AICard';
import { AIPromptSandbox } from './components/ai/AIPromptSandbox';
import { aiBioinformaticsTools } from './data/aiData';

// User & Subscribers Portal
import { UserSubscriberPortal } from './components/users/UserSubscriberPortal';

// Auth protected user pages
import { MyProgress } from './components/auth/MyProgress';
import { ResearchNotes } from './components/auth/ResearchNotes';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Software filtering state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');
  const [selectedLevel, setSelectedLevel] = useState<ToolLevel>('All');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);

  // Protein Explorer state
  const [selectedProtein, setSelectedProtein] = useState(demoProteins[0]); // Rice OsGA20ox2 (sd1)

  // Learning Hub pathway selector
  const [selectedPathId, setSelectedPathId] = useState<string>('rnaseq-workflow');

  // Navigate helper
  const handleNavigate = (tab: string, extraId?: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'learning' && extraId) {
      setSelectedPathId(extraId);
    } else if (tab === 'protein' && extraId) {
      const found = demoProteins.find(p => p.id === extraId);
      if (found) setSelectedProtein(found);
    } else if (tab === 'software' && extraId) {
      setSearchQuery(extraId);
    }
  };

  // Filter software database
  const filteredSoftware = softwareDatabaseList.filter((tool) => {
    if (selectedCategory !== 'All' && tool.category !== selectedCategory) return false;
    if (selectedLevel !== 'All' && tool.level !== selectedLevel) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = tool.name.toLowerCase().includes(q);
      const matchPurpose = tool.purpose.toLowerCase().includes(q);
      const matchTags = tool.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchPurpose && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5] text-slate-800 selection:bg-orange-500/20 selection:text-orange-950 font-sans">
      {/* 3-Line Hamburger Left Table of Contents Drawer */}
      <SidebarTOC
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Welcome Modal on First Visit */}
      <WelcomeModal onExplore={() => handleNavigate('home')} />

      {/* Global Command Palette Search (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Auth / Guest Demo Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Navigation Bar with 3-Line Menu Trigger */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* =========================================================================
            TAB 1: HOME
        ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Researcher Profile Banner */}
            <ProfileHero onNavigate={handleNavigate} />

            {/* Quick Sequence Utility Toolbox */}
            <QuickToolbox />

            {/* Hub Statistics Dashboard */}
            <HubStats />

            {/* Featured Pathways */}
            <FeaturedPaths
              onSelectPath={(pathId) => {
                setSelectedPathId(pathId);
                setActiveTab('learning');
              }}
              onNavigate={handleNavigate}
            />

            {/* Interactive Research Helper & Advisor */}
            <ResearchHelper />
          </div>
        )}

        {/* =========================================================================
            TAB 2: LEARNING HUB
        ========================================================================= */}
        {activeTab === 'learning' && (
          <div className="space-y-12 animate-fadeIn">
            {/* 5 Core Interactive Pipelines */}
            <PathwayVisualizer selectedPathId={selectedPathId} />

            {/* Daily Bioinformatics Quiz */}
            <DailyQuiz />
          </div>
        )}

        {/* =========================================================================
            TAB 3: BIOINFORMATICS SOFTWARE & DATABASES
        ========================================================================= */}
        {activeTab === 'software' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Bioinformatics Software & Databases
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                A verified directory of 38+ essential computational biology tools, reference databases, aligners, molecular docking suites, and phylogenetic packages with standard I/O specifications and official links.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <ToolFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              showOnlyBookmarked={showOnlyBookmarked}
              setShowOnlyBookmarked={setShowOnlyBookmarked}
              totalCount={softwareDatabaseList.length}
              filteredCount={filteredSoftware.length}
            />

            {/* Tool Cards Grid */}
            {filteredSoftware.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSoftware.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bio-glass rounded-3xl border-orange-200">
                <p className="text-sm font-semibold text-slate-700">No software or databases matched your search.</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting filters or searching with alternative keywords.</p>
              </div>
            )}

            {/* Specialized Guide: R in Bioinformatics & Bioconductor */}
            <RBioinformaticsGuide />
          </div>
        )}

        {/* =========================================================================
            TAB 4: PROTEIN 3D EXPLORER
        ========================================================================= */}
        {activeTab === 'protein' && (
          <div className="space-y-8 animate-fadeIn">
            <ProteinSearch
              currentProtein={selectedProtein}
              onSelectProtein={setSelectedProtein}
            />

            <ProteinAnalysisPanel protein={selectedProtein} />
          </div>
        )}

        {/* =========================================================================
            TAB 5: RESEARCH HUB
        ========================================================================= */}
        {activeTab === 'research' && (
          <div className="space-y-12 animate-fadeIn">
            {/* 2026 Research Pathway Roadmap */}
            <ResearchRoadmap2026 />

            {/* 7 Core Research Pillars */}
            <ResearchPillars />

            {/* Citation Formatter */}
            <CitationFormatter />

            {/* Research Helper & Advisor */}
            <ResearchHelper />

            {/* Literature Review Matrix & Synopsis Builder */}
            <LitReviewMatrix />
          </div>
        )}

        {/* =========================================================================
            TAB 6: AI IN BIOINFORMATICS
        ========================================================================= */}
        {activeTab === 'ai' && (
          <div className="space-y-10 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                AI for Bioinformatics & Computational Research
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Responsible, evidence-grounded application of Large Language Models and deep learning tools to accelerate bioinformatics analysis, literature synthesis, and pipeline debugging.
              </p>
            </div>

            {/* Responsible AI Warning */}
            <AIEthicsWarning />

            {/* 8 AI Tool Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiBioinformaticsTools.map((aiTool) => (
                <AICard key={aiTool.id} tool={aiTool} />
              ))}
            </div>

            {/* Bioinformatic Prompt Engineering Sandbox */}
            <AIPromptSandbox />
          </div>
        )}

        {/* =========================================================================
            TAB 7: USERS & EXCEL SPREADSHEET PORTAL
        ========================================================================= */}
        {activeTab === 'subscribers' && (
          <UserSubscriberPortal />
        )}

        {/* =========================================================================
            TAB 8: MY LEARNING PROGRESS (Protected / Guest Demo)
        ========================================================================= */}
        {activeTab === 'progress' && (
          <MyProgress onNavigate={handleNavigate} />
        )}

        {/* =========================================================================
            TAB 9: SAVED RESEARCH NOTES (Protected / Guest Demo)
        ========================================================================= */}
        {activeTab === 'notes' && (
          <ResearchNotes />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <AppContent />
      </UserDataProvider>
    </AuthProvider>
  );
}

