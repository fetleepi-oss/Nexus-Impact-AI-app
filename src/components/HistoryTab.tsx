import React, { useState, useEffect } from 'react';
import { Clock, Search, Trash2, ArrowUpRight, Check, HardDrive } from 'lucide-react';
import { StoredHistoryItem, getHistoryFromStorage, clearHistoryFromStorage } from '../lib/storage';

interface HistoryTabProps {
  onSelectSession: (item: StoredHistoryItem) => void;
  onRefreshTrigger?: number;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  onSelectSession,
  onRefreshTrigger = 0
}) => {
  const [items, setItems] = useState<StoredHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [clearedNotice, setClearedNotice] = useState(false);

  const loadHistory = async () => {
    const stored = await getHistoryFromStorage();
    setItems(stored);
  };

  useEffect(() => {
    loadHistory();
  }, [onRefreshTrigger]);

  const handleClearHistory = async () => {
    await clearHistoryFromStorage();
    setItems([]);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.output.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAgent =
      selectedAgentFilter === 'all' || item.agentId === selectedAgentFilter;

    return matchesSearch && matchesAgent;
  });

  const uniqueAgents = Array.from(
    new Set(items.map((i) => JSON.stringify({ id: i.agentId, name: i.agentName })))
  ).map((s) => JSON.parse(s));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Session History</h2>
          <p className="text-xs text-teal-400 font-medium mt-0.5">
            Persisted via AsyncStorage ({items.length} records)
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/20 border border-rose-900/30 transition-colors cursor-pointer"
            aria-label="Clear session history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Storage</span>
          </button>
        )}
      </div>

      {clearedNotice && (
        <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-teal-400" />
          <span>AsyncStorage history successfully cleared.</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search past directives, keywords, or topics..."
          className="w-full bg-[#0F1A36] border border-[#1E2F5B] rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
        />
      </div>

      {/* Agent Filter Chips */}
      {uniqueAgents.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedAgentFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
              selectedAgentFilter === 'all'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'bg-[#0F1A36] text-slate-400 hover:text-slate-200 border border-[#1E2F5B]'
            }`}
          >
            All Agents
          </button>
          {uniqueAgents.map((ag: any) => (
            <button
              key={ag.id}
              onClick={() => setSelectedAgentFilter(ag.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                selectedAgentFilter === ag.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-[#0F1A36] text-slate-400 hover:text-slate-200 border border-[#1E2F5B]'
              }`}
            >
              {ag.name}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#0F1A36] border border-[#1E2F5B] space-y-2">
          <Clock className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">
            {searchQuery ? 'No matching history records' : 'No saved outputs in AsyncStorage yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {searchQuery
              ? 'Try modifying your search query or switching filters.'
              : 'Select any agent card, click "Generate", and your output will be automatically saved here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSession(item)}
              className="w-full text-left p-4 rounded-xl bg-[#0F1A36] hover:bg-[#132145] border border-[#1E2F5B] hover:border-teal-500/40 transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-teal-300">
                      {item.agentName}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h4 className="text-xs font-medium text-slate-100 mb-1.5 line-clamp-1">
                  "{item.prompt}"
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-mono">
                  {item.output.replace(/#|\*|`/g, '').slice(0, 160)}...
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
