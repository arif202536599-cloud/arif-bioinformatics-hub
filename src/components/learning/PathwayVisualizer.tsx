import React, { useState } from 'react';
import { learningPathways } from '../../data/learningPathsData';
import { PathwayCard } from './PathwayCard';
import { BookOpen, Clock, Download, CheckCircle2, Award, Zap, Layers, Sparkles, FileText, Printer } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

interface PathwayVisualizerProps {
  selectedPathId?: string;
}

export const PathwayVisualizer: React.FC<PathwayVisualizerProps> = ({ selectedPathId }) => {
  const [activePathwayId, setActivePathwayId] = useState<string>(selectedPathId || learningPathways[0].id);
  const { completedSteps } = useUserData();

  const currentPathway = learningPathways.find(p => p.id === activePathwayId) || learningPathways[0];

  const pathwayCompletedCount = currentPathway.steps.filter(s => completedSteps[s.id]).length;
  const progressPercent = currentPathway.steps.length > 0 
    ? Math.round((pathwayCompletedCount / currentPathway.steps.length) * 100) 
    : 0;

  const downloadPathwayPDF = () => {
    // Generate a publication-quality styled printable document for PDF export
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate the printable PDF pathway report.');
      return;
    }

    const stepsHtml = currentPathway.steps.map(step => `
      <div style="margin-bottom: 24px; padding: 18px; border: 1px solid #fed7aa; border-radius: 12px; background-color: #fffdfa; page-break-inside: avoid;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h3 style="margin: 0; color: #9a3412; font-size: 16px;">Step ${step.stepNumber}: ${step.title}</h3>
          <span style="font-size: 11px; background: #ffedd5; color: #7c2d12; padding: 3px 8px; border-radius: 6px; font-weight: bold;">Tools: ${step.recommendedTools.join(', ')}</span>
        </div>
        <p style="font-size: 13px; color: #1e293b; line-height: 1.5; margin: 6px 0;"><strong>Summary:</strong> ${step.description}</p>
        <p style="font-size: 12px; color: #334155; line-height: 1.4; margin: 6px 0;"><strong>Scientific Rationale:</strong> ${step.rationale}</p>
        <div style="margin: 10px 0; font-size: 11px; color: #475569;">
          <strong>Input:</strong> <code>${step.inputFormat}</code> | <strong>Output:</strong> <code>${step.outputFormat}</code>
        </div>
        ${step.codeSnippet ? `
          <div style="background: #0f172a; color: #34d399; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; overflow-x: auto; margin: 8px 0;">
            <pre style="margin: 0;">${step.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </div>
        ` : ''}
        <div style="margin-top: 8px; font-size: 11px; color: #854d0e; background: #fefce8; padding: 8px; border-radius: 6px; border: 1px solid #fef08a;">
          <strong>Bioinformatics Pro Tip:</strong> ${step.keyTip}
        </div>
      </div>
    `).join('');

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${currentPathway.title} - Bioinformatics Study Report (PDF)</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; line-height: 1.5; margin: 0; padding: 20px; background: #ffffff; }
          .header { border-bottom: 3px solid #ea580c; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 5px 0; }
          .subtitle { font-size: 14px; color: #ea580c; font-weight: 600; margin: 0 0 10px 0; }
          .meta { font-size: 12px; color: #64748b; margin-top: 6px; }
          .badge { display: inline-block; padding: 2px 8px; background: #ffedd5; color: #9a3412; border-radius: 4px; font-weight: bold; font-size: 11px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🖨️ Save as PDF / Print Document
          </button>
        </div>
        <div class="header">
          <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #c2410c; margin-bottom: 4px;">
            Arif Bioinformatics Research Hub • Master Bioinformatics with Arif
          </div>
          <h1 class="title">${currentPathway.title}</h1>
          <div class="subtitle">${currentPathway.subtitle}</div>
          <div class="meta">
            <span class="badge">${currentPathway.category}</span> &nbsp;|&nbsp;
            <strong>Difficulty:</strong> ${currentPathway.difficulty} &nbsp;|&nbsp;
            <strong>Est. Time:</strong> ${currentPathway.estimatedTime} &nbsp;|&nbsp;
            <strong>Outcome:</strong> ${currentPathway.outcome}
          </div>
        </div>

        <div>
          ${stepsHtml}
        </div>

        <div class="footer">
          Generated from Arif Bioinformatics Research Hub • Official Website: http://arif_bioinformatics_mastery.com • YouTube: @Bioinformatics_Mastery
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(fullHtml);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Pathway Tab Selector */}
      <div className="p-6 sm:p-8 rounded-3xl bio-glass border-orange-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>Bioinformatics Training Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Interactive Learning Pathways
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-2xl leading-relaxed">
              Select a standardized computational biology pipeline below to follow step-by-step instructions, run real command-line snippets, take step notes, and export publication-quality PDF guides.
            </p>
          </div>

          <button
            onClick={downloadPathwayPDF}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download Pathway Guide (PDF Report)</span>
          </button>
        </div>

        {/* Pathway Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-orange-200">
          {learningPathways.map((path) => {
            const isActive = activePathwayId === path.id;
            const completedCount = path.steps.filter(s => completedSteps[s.id]).length;
            const isAllDone = completedCount === path.steps.length && path.steps.length > 0;

            return (
              <button
                key={path.id}
                onClick={() => setActivePathwayId(path.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                    : 'bg-white text-slate-800 border border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {isAllDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Layers className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                )}
                <span>{path.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pathway Overview Header & Live Progress */}
      <div className="p-6 sm:p-8 rounded-3xl bio-glass border-orange-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-orange-200">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
                {currentPathway.category}
              </span>
              <span className="text-xs text-slate-600 font-mono font-bold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>{currentPathway.estimatedTime}</span>
              </span>
              <span className="text-xs font-mono font-bold text-orange-800">
                • {currentPathway.difficulty} Level
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {currentPathway.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
              {currentPathway.subtitle}
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="p-4 rounded-2xl bg-white border border-orange-200 min-w-[240px] shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">Pathway Progress</span>
              <span className="font-mono text-orange-700 text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-orange-100 overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-600 font-medium block">
              {pathwayCompletedCount} of {currentPathway.steps.length} milestones checked
            </span>
          </div>
        </div>

        {/* Expected Learning Outcome */}
        <div className="mt-4 p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs text-slate-800 leading-relaxed font-medium">
          <strong className="text-slate-950 font-bold">Target Learning Outcome: </strong>
          {currentPathway.outcome}
        </div>
      </div>

      {/* Step Cards Flow */}
      <div className="space-y-2">
        {currentPathway.steps.map((step, idx) => (
          <PathwayCard
            key={step.id}
            step={step}
            pathwayTitle={currentPathway.title}
            isLast={idx === currentPathway.steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
