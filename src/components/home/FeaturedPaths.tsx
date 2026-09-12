import React from 'react';
import { BookOpen, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { learningPathways } from '../../data/learningPathsData';
import { useUserData } from '../../context/UserDataContext';

interface FeaturedPathsProps {
  onSelectPath: (pathId: string) => void;
  onNavigate: (tab: string, extraId?: string) => void;
}

export const FeaturedPaths: React.FC<FeaturedPathsProps> = ({ onSelectPath, onNavigate }) => {
  const { completedSteps } = useUserData();

  const getPathwayProgress = (steps: { id: string }[]) => {
    const completed = steps.filter(s => completedSteps[s.id]).length;
    const percentage = steps.length > 0 ? Math.round((completed / steps.length) * 100) : 0;
    return { completed, total: steps.length, percentage };
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span>Interactive Learning Curriculum</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Core Bioinformatics Workflows & Pipelines
          </h2>
        </div>
        <button
          onClick={() => onNavigate('learning')}
          className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <span>View All 5 Learning Paths</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {learningPathways.slice(0, 3).map((path) => {
          const progress = getPathwayProgress(path.steps);
          return (
            <div
              key={path.id}
              onClick={() => {
                onSelectPath(path.id);
                onNavigate('learning');
              }}
              className="rounded-3xl bio-glass border-orange-200/90 hover:border-orange-400 p-6 flex flex-col justify-between cursor-pointer group shadow-xs transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
                    {path.category}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-600 text-xs font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>{path.estimatedTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-orange-700 transition-colors line-clamp-1">
                  {path.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2">
                  {path.subtitle}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-mono text-orange-700 font-bold">{progress.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-orange-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-600 font-medium">
                  {progress.completed} of {progress.total} steps done
                </span>
                <span className="text-xs font-bold text-orange-700 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Explore Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
