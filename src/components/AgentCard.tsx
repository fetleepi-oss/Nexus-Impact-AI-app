import React from 'react';
import {
  Search,
  FileText,
  ShieldAlert,
  Scale,
  Activity,
  HeartHandshake,
  Database,
  ChevronRight,
  Lock,
  Sparkles
} from 'lucide-react';
import { AgentConfig } from '../data/agents';

interface AgentCardProps {
  agent: AgentConfig;
  isLocked: boolean;
  onSelect: (agentId: string) => void;
  onLockedClick?: (agent: AgentConfig) => void;
  isFullWidth?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isLocked,
  onSelect,
  onLockedClick,
  isFullWidth = false
}) => {
  const getIcon = () => {
    const props = { className: `w-5 h-5 ${isLocked ? 'text-slate-400' : 'text-teal-400'}` };
    switch (agent.icon) {
      case 'Search':
        return <Search {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Scale':
        return <Scale {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Database':
        return <Database {...props} />;
      default:
        return <Search {...props} />;
    }
  };

  const handleClick = () => {
    if (isLocked) {
      if (onLockedClick) {
        onLockedClick(agent);
      }
    } else {
      onSelect(agent.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 active:scale-[0.98] cursor-pointer ${
        isLocked
          ? 'bg-[#0B1327]/90 border-[#1A2645] hover:border-teal-500/40 opacity-95'
          : 'bg-[#0F1A36] border-[#1E2F5B] hover:border-teal-500/50 hover:bg-[#142348]'
      } ${isFullWidth ? 'col-span-2 sm:col-span-1' : 'col-span-1'}`}
      style={{ minHeight: '148px' }}
      aria-label={`${agent.name} agent: ${agent.description}${isLocked ? ' (Pro Only - Tap to unlock)' : ''}`}
    >
      <div>
        {/* Top Header: Icon + Category or Lock */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
              isLocked
                ? 'bg-[#070D1E] border-slate-700/60 group-hover:border-teal-400/40'
                : 'bg-[#070D1E] border-[#1E2F5B] group-hover:border-teal-500/40 group-hover:bg-[#0A1633]'
            }`}
          >
            {getIcon()}
          </div>

          {/* Right badge: Lock icon or Category */}
          {isLocked ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-[10px] font-bold text-slate-300 group-hover:border-teal-400/50 group-hover:text-teal-300 transition-colors">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>PRO</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono tracking-wider text-slate-400 group-hover:text-teal-400/80 transition-colors uppercase">
              {agent.category.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="text-[15px] font-semibold text-slate-100 group-hover:text-teal-300 transition-colors leading-tight">
            {agent.name}
          </h3>
        </div>

        {/* One-Line Description (exact prompt requirement) */}
        <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* Bottom Affordance */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/60 text-[11px] font-medium">
        {isLocked ? (
          <>
            <span className="text-amber-400/90 group-hover:text-amber-300 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Unlock with Pro</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transform group-hover:translate-x-0.5 transition-transform" />
          </>
        ) : (
          <>
            <span className="text-teal-400/90">Launch Agent</span>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400/90 transform group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </div>
    </button>
  );
};
