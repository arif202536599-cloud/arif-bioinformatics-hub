import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../context/UserDataContext';
import { learningPathways } from '../../data/learningPathsData';
import { softwareDatabaseList } from '../../data/softwareData';
import { CheckCircle2, Bookmark, Award, BookOpen, Clock, ArrowRight, Download, Sparkles, Trophy } from 'lucide-react';

export const MyProgress: React.FC<{ onNavigate: (tab: string, extraId?: string) => void }> = ({ onNavigate }) => {
  const { user, isGuestDemo } = useAuth();
  const { completedSteps, bookmarkedTools, quizHistory, totalCompletedStepsCount } = useUserData();

  const totalStepsInHub = learningPathways.reduce((acc, p) => acc + p.steps.length, 0);
  const overallCompletionRate = totalStepsInHub > 0 ? Math.round((totalCompletedStepsCount / totalStepsInHub) * 100) : 0;

  const bookmarkedItems = softwareDatabaseList.filter(t => bookmarkedTools.includes(t.id));

  const handleExportProgressReport = () => {
    let report = `# Bioinformatics Learning Progress Report\n`;
    report += `User: ${user?.name || 'Guest Researcher'} (${user?.email})\n`;
    report += `Date: ${new Date().toLocaleDateString()}\n`;
    report += `Overall Progress: ${overallCompletionRate}% (${totalCompletedStepsCount}/${totalStepsInHub} Steps Completed)\n\n`;

    report += `## Pathway Progress Summary:\n`;
    learningPathways.forEach(p => {
      const done = p.steps.filter(s => completedSteps[s.id]).length;
      report += `- **${p.title}:** ${done}/${p.steps.length} Steps Completed (${Math.round((done / p.steps.length) * 100)}%)\n`;
    });

    report += `\n## Bookmarked Bioinformatics Tools (${bookmarkedItems.length}):\n`;
    bookmarkedItems.forEach(t => {
      report += `- **${t.name}** [${t.category}]: ${t.websiteUrl}\n`;
    });

    report += `\n## Quiz Performance History:\n`;
    if (quizHistory.length === 0) {
      report += `No quiz attempts recorded yet.\n`;
    } else {
      quizHistory.forEach((q, idx) => {
        report += `${idx + 1}. ${q.date}: Score ${q.score}/${q.total} (${q.percentage}%)\n`;
      });
    }

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioHub_Learning_Progress_Report.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-orange-200/90 shadow-sm flex flex-col md:flex-row md:flex-wrap md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 font-bold">
              Personalized Dashboard
            </span>
            {isGuestDemo && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                Demo Mode (Saved Locally)
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            My Learning Progress & Achievements
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 font-medium">
            Welcome back, <strong className="text-orange-700 font-bold">{user?.name || 'Bioinformatics Student'}</strong>. Track your pipeline checklists and quiz scores.
          </p>
        </div>

        <button
          onClick={handleExportProgressReport}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-300 hover:border-orange-400 text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-orange-600" />
          <span>Export Progress Report (.MD)</span>
        </button>
      </div>

      {/* Progress Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-orange-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Total Steps Mastered</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-slate-950">
            {totalCompletedStepsCount} <span className="text-xs font-normal text-slate-600">/ {totalStepsInHub}</span>
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${overallCompletionRate}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-orange-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Bookmarked Tools</span>
            <Bookmark className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-orange-700">
            {bookmarkedTools.length}
          </p>
          <span className="text-[11px] text-slate-600 font-medium">Quick access to essential Bio-tools</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-orange-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Quizzes Completed</span>
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold font-mono text-amber-800">
            {quizHistory.length}
          </p>
          <span className="text-[11px] text-slate-600 font-medium">Average score: {quizHistory.length > 0 ? Math.round(quizHistory.reduce((a, c) => a + c.percentage, 0) / quizHistory.length) : 0}%</span>
        </div>
      </div>

      {/* Pathway Progress Breakdown */}
      <div className="rounded-3xl bg-white border border-orange-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-extrabold text-slate-950 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <span>Learning Pathway Checklist Breakdown</span>
        </h3>

        <div className="space-y-4">
          {learningPathways.map((path) => {
            const completedInPath = path.steps.filter(s => completedSteps[s.id]).length;
            const pct = Math.round((completedInPath / path.steps.length) * 100);

            return (
              <div
                key={path.id}
                onClick={() => onNavigate('learning', path.id)}
                className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200/80 hover:border-orange-400 hover:bg-orange-50/80 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                      {path.category}
                    </span>
                    <span className="text-sm font-extrabold text-slate-950 group-hover:text-orange-700 transition-colors">
                      {path.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-1">{path.subtitle}</p>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono font-extrabold text-orange-800">{pct}%</span>
                    <span className="text-[10px] text-slate-600 font-semibold block">{completedInPath}/{path.steps.length} Steps</span>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookmarked Tools Quick Grid */}
      {bookmarkedItems.length > 0 && (
        <div className="rounded-3xl bg-white border border-orange-200/90 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-950 flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-orange-600" />
              <span>Bookmarked Software & Databases</span>
            </h3>
            <button
              onClick={() => onNavigate('software')}
              className="text-xs text-orange-700 hover:text-orange-900 hover:underline font-bold cursor-pointer"
            >
              Browse All 38+ Tools →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookmarkedItems.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate('software', tool.id)}
                className="p-3.5 rounded-2xl bg-orange-50/40 border border-orange-200 hover:border-orange-400 cursor-pointer transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">{tool.category}</span>
                  <h4 className="text-xs font-extrabold text-slate-950 mt-1.5 line-clamp-1">{tool.name}</h4>
                  <p className="text-[11px] text-slate-700 font-medium line-clamp-2 mt-0.5">{tool.purpose}</p>
                </div>
                <div className="mt-3 text-[10px] text-teal-800 font-mono font-bold flex items-center justify-between pt-1 border-t border-orange-200">
                  <span>Level: {tool.level}</span>
                  <ArrowRight className="w-3 h-3 text-orange-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
