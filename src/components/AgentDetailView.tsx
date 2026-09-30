import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Copy,
  Check,
  Bookmark,
  Share2,
  Download,
  AlertTriangle,
  RotateCcw,
  Search,
  FileText,
  ShieldAlert,
  Scale,
  Activity,
  HeartHandshake,
  Database,
  Lock,
  FileDown
} from 'lucide-react';
import { AgentConfig } from '../data/agents';
import { generate } from '../lib/ai';
import { StoredHistoryItem } from '../lib/storage';
import { isAgentProOnly } from '../lib/limits';
import { triggerHaptic } from '../lib/haptics';
import { exportAgentPdfWeb } from '../lib/pdfExport';

interface AgentDetailViewProps {
  agent: AgentConfig;
  isPro: boolean;
  remainingGenerations: number;
  onBack: () => void;
  onGatePaywall: (reason: string) => void;
  onRecordGeneration?: () => Promise<void>;
  onHistoryUpdated?: () => void;
  savedItems?: StoredHistoryItem[];
}

export const AgentDetailView: React.FC<AgentDetailViewProps> = ({
  agent,
  isPro,
  remainingGenerations,
  onBack,
  onGatePaywall,
  onRecordGeneration,
  onHistoryUpdated,
  savedItems = []
}) => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string>(agent.defaultOutputSnippet || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isProAgent = isAgentProOnly(agent.id);
  const isAgentLocked = isProAgent && !isPro;

  const getIcon = () => {
    const props = { className: 'w-6 h-6 text-teal-400' };
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

  const handleGenerate = async () => {
    triggerHaptic('medium');

    // 1. Check if agent is locked
    if (isAgentLocked) {
      triggerHaptic('warning');
      onGatePaywall(`Unlock ${agent.name} with Nexus Pro`);
      return;
    }

    // 2. Check if daily generation limit reached for free users
    if (!isPro && remainingGenerations <= 0) {
      triggerHaptic('warning');
      onGatePaywall(`Daily limit reached (3/3 used). Unlock unlimited generations with Nexus Pro`);
      return;
    }

    const textToRun = prompt.trim();
    if (!textToRun || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const result = await generate(agent.id, textToRun);
      setOutput(result);
      setSavedSuccess(true);
      triggerHaptic('success');

      // Record daily generation usage
      if (onRecordGeneration) {
        await onRecordGeneration();
      }

      if (onHistoryUpdated) {
        onHistoryUpdated();
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      triggerHaptic('error');
      setErrorMessage(
        err.message || 'An unexpected error occurred while executing the directive.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    triggerHaptic('light');
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = async () => {
    if (!output) return;
    triggerHaptic('medium');

    // Export is Pro only
    if (!isPro) {
      triggerHaptic('warning');
      onGatePaywall('Export formatted PDF is a Nexus Pro feature');
      return;
    }

    setIsExporting(true);
    try {
      const dateFormatted = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      await exportAgentPdfWeb(agent.name, dateFormatted, output);
      triggerHaptic('success');
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const relevantHistory = savedItems.filter((item) => item.agentId === agent.id);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2F5B]/80">
        <button
          onClick={() => {
            triggerHaptic('light');
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 py-1.5 px-2.5 rounded-lg hover:bg-[#0F1A36] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-400 cursor-pointer"
          aria-label="Back to all agents"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Agents</span>
        </button>

        <div className="flex items-center gap-2">
          {!isPro && (
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Free: <span className="text-teal-300 font-bold">{remainingGenerations}/3</span> left
            </span>
          )}
          <span className="text-xs font-mono text-teal-300 font-semibold bg-[#0F1A36] px-2 py-0.5 rounded border border-[#1E2F5B]">
            /agent/{agent.id}
          </span>
        </div>
      </div>

      {/* Locked Agent Banner if user tapped a locked agent */}
      {isAgentLocked && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                Nexus Pro Agent
              </h2>
              <p className="text-xs text-amber-100/90 mt-0.5 leading-relaxed">
                {agent.name} is a specialized Pro-tier agent for social impact organizations.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onGatePaywall(`Unlock ${agent.name} with Nexus Pro`);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold whitespace-nowrap cursor-pointer"
          >
            Unlock Now
          </button>
        </div>
      )}

      {/* Agent Identity Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1A36] border border-[#1E2F5B]">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#070D1E] border border-teal-500/30 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-teal-400 tracking-wider uppercase font-mono">
                {agent.category}
              </span>
              <span className="text-slate-600">·</span>
              {isProAgent ? (
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> Pro Tier
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Free Tier</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-100 leading-tight">
              {agent.name}
            </h1>
            <p className="text-xs text-teal-300 font-semibold mt-0.5">
              {agent.description}
            </p>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {agent.fullDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Directives / Prompts */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Suggested Directives</span>
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {agent.suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic('light');
                setPrompt(p);
                setErrorMessage(null);
              }}
              className="text-left p-2.5 rounded-xl bg-[#0C152B] hover:bg-[#132145] border border-[#1E2F5B] text-xs text-slate-300 hover:text-teal-200 transition-colors flex items-start gap-2 group cursor-pointer"
            >
              <span className="text-teal-400 mt-0.5 text-[10px] font-mono group-hover:translate-x-0.5 transition-transform">
                →
              </span>
              <span className="leading-snug flex-1">{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Directive Form */}
      <div className="p-4 rounded-2xl bg-[#0F1A36] border border-[#1E2F5B] space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="agent-user-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-200"
          >
            Directive Specification
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {prompt.length} chars
          </span>
        </div>

        <textarea
          id="agent-user-input"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder={agent.placeholderPrompt}
          rows={3}
          className="w-full bg-[#070D1E] border border-[#1E2F5B] focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 resize-none transition-colors outline-none font-sans"
        />

        <div className="flex items-center justify-between pt-1">
          {isPro ? (
            <span className="text-[11px] text-teal-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Unlimited Pro Generations
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono">
              Daily Free: <span className={remainingGenerations > 0 ? 'text-teal-400 font-bold' : 'text-rose-400 font-bold'}>{remainingGenerations}/3</span> left
            </span>
          )}

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-md cursor-pointer ${
              isAgentLocked
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-950/40'
                : 'bg-teal-500 hover:bg-teal-400 text-[#070D1E] shadow-teal-950/40'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#070D1E] border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : isAgentLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock with Pro</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Clean Error State with Retry Button */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/60 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                Execution Directive Failed
              </h3>
              <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Result Area with Loading State */}
      <div className="p-4 rounded-2xl bg-[#0F1A36] border border-teal-500/30 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2F5B]">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-teal-400'}`} />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              {isLoading ? 'Synthesizing Social Impact Intelligence...' : 'Agent Synthesis Result'}
            </h3>
          </div>

          {!isLoading && output && (
            <div className="flex items-center gap-2">
              {/* Copy button available for Free & Pro users */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0A1226] hover:bg-[#132145] text-slate-300 hover:text-teal-200 border border-[#1E2F5B] transition-colors cursor-pointer"
                title="Copy text to clipboard"
                aria-label="Copy output"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Export Formatted PDF button (Pro Only) */}
              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isPro
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}
                title={isPro ? 'Export formatted PDF with agent name, date and content' : 'Export PDF requires Nexus Pro'}
                aria-label="Export formatted PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
                {!isPro && <Lock className="w-2.5 h-2.5 ml-0.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Result Container / Loading State */}
        {isLoading ? (
          <div className="p-8 text-center bg-[#070D1E] rounded-xl border border-[#1E2F5B] space-y-3">
            <div className="w-7 h-7 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-teal-300">
              Generating domain synthesis for {agent.name}...
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              Applying domain system prompt, validating evidence matrices, and formatting structured outputs.
            </p>
          </div>
        ) : (
          <div
            className="text-xs leading-relaxed text-slate-200 font-mono space-y-2 whitespace-pre-wrap bg-[#070D1E] p-4 rounded-xl border border-[#1E2F5B] max-h-[460px] overflow-y-auto selection:bg-teal-500/30"
            tabIndex={0}
            role="region"
            aria-label="Scrollable agent result"
          >
            {output || 'No output yet. Enter a directive above and click "Generate".'}
          </div>
        )}
      </div>

      {/* Relevant Past Directives for this Agent */}
      {relevantHistory.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Recent {agent.name} Directives from History
          </h3>
          <div className="space-y-2">
            {relevantHistory.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  setPrompt(item.prompt);
                  setOutput(item.output);
                  setErrorMessage(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#0C152B] hover:bg-[#132145] border border-[#1E2F5B] text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-teal-300">{item.agentName}</span>
                  <span className="font-mono text-slate-500">{item.timestamp}</span>
                </div>
                <p className="text-slate-200 line-clamp-1">"{item.prompt}"</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
