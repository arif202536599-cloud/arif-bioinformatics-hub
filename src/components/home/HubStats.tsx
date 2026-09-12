import React from 'react';
import { Database, BookOpen, HardDrive, CheckCircle2, Users } from 'lucide-react';
import { softwareDatabaseList } from '../../data/softwareData';
import { learningPathways } from '../../data/learningPathsData';
import { useUserData } from '../../context/UserDataContext';

export const HubStats: React.FC = () => {
  const { totalCompletedStepsCount, connectedUsersList } = useUserData();

  const stats = [
    {
      label: 'Verified Databases & Tools',
      value: `${softwareDatabaseList.length}+`,
      subtext: 'BLAST, SRA, AlphaFold, DESeq2, Vina',
      icon: Database,
      color: 'text-orange-800 bg-orange-100 border-orange-300',
    },
    {
      label: 'Step-by-Step Learning Paths',
      value: `${learningPathways.length}`,
      subtext: 'RNA-seq, Gene Families, Docking, Omics',
      icon: BookOpen,
      color: 'text-amber-800 bg-amber-100 border-amber-300',
    },
    {
      label: 'Interactive Steps Completed',
      value: `${totalCompletedStepsCount}`,
      subtext: 'Tracked & recalculated in real time',
      icon: CheckCircle2,
      color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
    },
    {
      label: 'Subscribed Users',
      value: `${connectedUsersList.length}`,
      subtext: 'Protected admin portal with Excel export',
      icon: Users,
      color: 'text-purple-800 bg-purple-100 border-purple-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bio-glass border-orange-200/90 hover:border-orange-400 transition-all duration-300 group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 tracking-tight group-hover:text-orange-600 transition-colors">
                {stat.value}
              </span>
              <div className={`p-2.5 rounded-xl border ${stat.color} group-hover:scale-110 transition-transform shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">{stat.label}</h4>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 font-medium">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
