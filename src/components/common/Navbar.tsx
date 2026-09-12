import React, { useState } from 'react';
import { 
  Dna, BookOpen, Database, Atom, FileText, Bot, User, 
  Search, CheckCircle2, Bookmark, Menu, X, Users,
  ShieldCheck, Sparkles, ChevronDown, BellRing
} from 'lucide-react';
import { YoutubeIcon } from './YoutubeIcon';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenAuth,
  onToggleSidebar 
}) => {
  const { user, isGuestDemo, signOut } = useAuth();
  const { totalCompletedStepsCount, bookmarkedTools, connectedUsersList } = useUserData();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Dna },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen, badge: '5 Paths' },
    { id: 'software', label: 'Tools & DBs', icon: Database, badge: '38+' },
    { id: 'protein', label: 'Protein 3D', icon: Atom, badge: 'Simulation' },
    { id: 'research', label: 'Research Hub', icon: FileText, badge: '2026' },
    { id: 'ai', label: 'AI Tools', icon: Bot },
    { id: 'subscribers', label: 'Users & Excel', icon: Users, badge: `${connectedUsersList.length}` },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-200/90 bg-[#fffaf5]/90 backdrop-blur-xl shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Group: 3-line Table of Contents Toggle + Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 3-Line Table of Contents Hamburger Trigger */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300/80 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
              title="Open Table of Contents (3-Line Menu)"
            >
              <Menu className="w-5 h-5 text-orange-700" />
              <span className="hidden sm:inline text-xs font-bold text-orange-950">Contents</span>
            </button>

            {/* Brand Logo */}
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2.5 cursor-pointer group select-none"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all">
                <Dna className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                    Arif Bio Hub
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-300 font-bold">
                    MPhil
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 -mt-0.5 tracking-wide hidden lg:block">
                  Bioinformatics Research & Learning Platform
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? 'text-orange-950 bg-orange-100 border border-orange-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-orange-200 text-orange-950' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Search, YouTube link, Subscribe, User Profile */}
          <div className="flex items-center space-x-2">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-orange-50 border border-orange-200 hover:border-orange-300 rounded-xl transition-all shadow-xs"
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden md:inline font-medium">Search</span>
              <kbd className="hidden md:inline-flex text-[9px] px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded font-mono border border-orange-200">
                ⌘K
              </kbd>
            </button>

            {/* YouTube Quick Channel Link */}
            <a
              href="https://www.youtube.com/@Bioinformatics_Mastery"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all shadow-xs"
              title="Visit YouTube Channel @Bioinformatics_Mastery"
            >
              <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden lg:inline">YouTube</span>
            </a>

            {/* Subscribe / Users Action Button */}
            <button
              onClick={() => setActiveTab('subscribers')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Subscribe</span>
            </button>

            {/* User Account / Guest Demo Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white border border-orange-200 hover:border-orange-300 shadow-xs transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name[0] : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <span className="block text-[11px] font-bold text-slate-800 line-clamp-1 max-w-[85px]">
                    {user?.name || 'Guest'}
                  </span>
                  <span className="block text-[9px] text-orange-700 font-mono -mt-0.5">
                    {isGuestDemo ? 'Demo Mode' : 'Connected'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-orange-200 shadow-xl p-3 z-50 animate-fadeIn"
                >
                  <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 mb-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900">{user?.name || 'Bioinformatics Student'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center space-x-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 font-mono font-bold">
                        {isGuestDemo ? 'Local Session Active' : 'Connected'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('subscribers');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-orange-950 hover:bg-orange-50 rounded-lg flex items-center justify-between transition-colors font-medium"
                    >
                      <span className="flex items-center space-x-2">
                        <Users className="w-3.5 h-3.5 text-orange-600" />
                        <span>Connected Users Directory</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{connectedUsersList.length}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('progress');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-orange-950 hover:bg-orange-50 rounded-lg flex items-center justify-between transition-colors font-medium"
                    >
                      <span className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>My Learning Progress</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{totalCompletedStepsCount}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('notes');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-orange-950 hover:bg-orange-50 rounded-lg flex items-center justify-between transition-colors font-medium"
                    >
                      <span className="flex items-center space-x-2">
                        <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                        <span>Saved Research Notes</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{bookmarkedTools.length}</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAuth();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-orange-950 hover:bg-orange-50 rounded-lg flex items-center space-x-2 transition-colors font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Switch Account / Sign In</span>
                    </button>

                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center space-x-2 transition-colors font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reset Guest Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
