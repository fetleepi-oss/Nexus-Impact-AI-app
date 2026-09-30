import { Platform } from 'react-native';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export default function App() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    // Platform-specific API keys
    const iosApiKey = 'test_bxrpYHfEUPnjAzjXewMlpxhMkZv';
    const androidApiKey = 'test_bxrpYHfEUPnjAzjXewMlpxhMkZv';

    if (Platform.OS === 'ios') {
       Purchases.configure({apiKey: iosApiKey});
    } else if (Platform.OS === 'android') {
       Purchases.configure({apiKey: androidApiKey});
    }
  }, []);
}

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Clock,
  Sparkles,
  Settings as SettingsIcon,
  Code2,
  Smartphone,
  Monitor,
  Lock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AGENTS, getAgentById, AgentConfig } from './data/agents';
import { AgentCard } from './components/AgentCard';
import { AgentDetailView } from './components/AgentDetailView';
import { HistoryTab } from './components/HistoryTab';
import { ProTab } from './components/ProTab';
import { SettingsTab } from './components/SettingsTab';
import { ExpoProjectModal } from './components/ExpoProjectModal';
import { OnboardingModal } from './components/OnboardingModal';
import {
  StoredHistoryItem,
  getHistoryFromStorage,
  saveHistoryToStorage,
  AsyncStorage
} from './lib/storage';
import { PurchasesProvider, usePurchases } from './lib/purchases';
import { useDailyGenerations, isAgentProOnly } from './lib/limits';
import { triggerHaptic } from './lib/haptics';

type TabType = 'agents' | 'history' | 'pro' | 'settings';
const ONBOARDING_KEY = '@nexus_onboarding_completed';

function MainApp() {
  const { isPro } = usePurchases();
  const {
    remaining: remainingGenerations,
    limit: dailyLimit,
    recordGeneration,
    refreshLimits
  } = useDailyGenerations(isPro);

  const [currentTab, setCurrentTab] = useState<TabType>('agents');
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);
  const [showExpoModal, setShowExpoModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [historyItems, setHistoryItems] = useState<StoredHistoryItem[]>([]);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
const [offerings, setOfferings] = useState<any>(null);
  // Check onboarding status and load AsyncStorage history
  useEffect(() => {
    async function initApp() {
      // Check onboarding
       try {
  const offerings = await Purchases.getOfferings();
  setOfferings(offerings);
} catch (e) {
  console.error("Error fetching offerings", e);
}
        const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
          setShowOnboarding(true);
        }
      } catch (e) {
        // Fallback
      }

      // Load history
      const stored = await getHistoryFromStorage();
      if (stored.length === 0) {
        await saveHistoryToStorage(
          'grant-proposal',
          'Grant Proposal',
          'Draft USAID structured grant for rural maternal healthcare network',
          `# Grant Proposal: Rural Maternal Healthcare Acceleration\n\n## 1. Problem Statement\nMaternal mortality rates in remote rural catchments remain 3.8x above national targets due to a lack of transport corridors and basic obstetric diagnostics.\n\n## 2. Project Objectives\n- Equip 24 primary clinics with calibrated obstetric drapes and WHO E-MOTIVE bundles within 12 months.\n- Establish subsidized motorcycle ambulance referral vouchers for 3,500 pregnant women.\n\n## 3. Implementation Activities\n- WP 1: Training 180 Community Midwives.\n- WP 2: Cold-chain and emergency medicine distribution.\n\n## 4. Budget Outline\n- Direct Programmatic Interventions: $540,000 (60%)\n- Personnel & Field Midwives: $225,000 (25%)\n- Indirect Administration: $135,000 (15%)\n- Total: $900,000\n\n## 5. Monitoring & Evaluation (M&E)\n- Indicator 1: % of obstetric hemorrhage cases treated within 60 minutes (Target: >= 92%).`
        );
        const refreshed = await getHistoryFromStorage();
        setHistoryItems(refreshed);
      } else {
        setHistoryItems(stored);
      }
    }
    initApp();
  }, [historyRefreshKey]);

  const handleCompleteOnboarding = async () => {
    setShowOnboarding(false);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      // ignore
    }
  };

  const handleOpenAgent = (id: string) => {
    triggerHaptic('light');
    if (isAgentProOnly(id) && !isPro) {
      const agent = getAgentById(id);
      handleOpenPaywall(`Unlock ${agent?.name || 'this agent'} with Nexus Pro`);
      return;
    }

    setActiveAgentId(id);
    setCurrentTab('agents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPaywall = (reason: string) => {
    triggerHaptic('medium');
    setPaywallReason(reason);
    setCurrentTab('pro');
    setActiveAgentId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAgents = () => {
    triggerHaptic('light');
    setActiveAgentId(null);
  };

  const handleTabChange = (tab: TabType) => {
    triggerHaptic('light');
    setCurrentTab(tab);
    if (tab !== 'agents') {
      setActiveAgentId(null);
    }
    if (tab !== 'pro') {
      setPaywallReason(null);
    }
  };

  const handleHistoryUpdated = async () => {
    setHistoryRefreshKey((prev) => prev + 1);
    refreshLimits();
  };

  const handleExportAllData = async () => {
    triggerHaptic('medium');
    if (!isPro) {
      handleOpenPaywall('Unlock full data archive export with Nexus Pro');
      return;
    }

    const currentHist = await getHistoryFromStorage();
    const data = {
      app: 'Nexus Impact AI',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      isPro,
      agents: AGENTS,
      history: currentHist
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-impact-ai-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentAgent = activeAgentId ? getAgentById(activeAgentId) : null;

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-[#070D1E]/90 backdrop-blur-md border-b border-[#1E2F5B]/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text element wordmark + PRO badge */}
          <div className="flex items-center gap-2.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
              Nexus Impact AI
            </span>
            {isPro ? (
              <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-teal-400 text-slate-950 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>PRO</span>
              </span>
            ) : (
              <button
                onClick={() => handleOpenPaywall('Upgrade to Nexus Pro for unlimited generations & PDF export')}
                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Free Plan</span>
              </button>
            )}
            <span className="hidden sm:inline-block text-xs font-medium text-teal-400 font-mono px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
              Expo Router Native App
            </span>
          </div>

          {/* Zone 2: Navigation / Canvas View switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                setIsDeviceFrame(!isDeviceFrame);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 bg-[#0F1A36] hover:bg-[#15244C] border border-[#1E2F5B] transition-colors cursor-pointer"
              title="Toggle mobile device frame"
            >
              {isDeviceFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Expanded Canvas</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Mobile Frame</span>
                </>
              )}
            </button>

            {/* Zone 3: Primary action */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                setShowExpoModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#070D1E] bg-teal-400 hover:bg-teal-300 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Code2 className="w-4 h-4" />
              <span>Expo Project Code</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center py-4 sm:py-8 px-2 sm:px-6">
        <div
          className={`w-full transition-all duration-300 ${
            isDeviceFrame
              ? 'max-w-[440px] bg-[#070D1E] sm:border sm:border-[#1E2F5B] sm:rounded-[42px] sm:shadow-2xl sm:shadow-black/70 overflow-hidden flex flex-col relative'
              : 'max-w-4xl bg-[#070D1E] border border-[#1E2F5B] rounded-2xl p-6 sm:p-8 flex flex-col'
          }`}
          style={{ minHeight: isDeviceFrame ? '840px' : 'auto' }}
        >
          {/* Mobile Status Bar Simulation */}
          {isDeviceFrame && (
            <div className="hidden sm:flex items-center justify-between px-7 pt-3.5 pb-2 text-[11px] font-mono text-slate-400 border-b border-[#1E2F5B]/30 select-none">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-950 rounded-full border border-slate-800/80 mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>5G</span>
              </div>
            </div>
          )}

          {/* Screen Content Viewport */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto pb-24">
            {currentTab === 'agents' ? (
              activeAgentId && currentAgent ? (
                /* Dynamic Agent Route: /agent/[id] */
                <AgentDetailView
                  agent={currentAgent}
                  isPro={isPro}
                  remainingGenerations={remainingGenerations}
                  onBack={handleBackToAgents}
                  onGatePaywall={handleOpenPaywall}
                  onRecordGeneration={recordGeneration}
                  onHistoryUpdated={handleHistoryUpdated}
                  savedItems={historyItems}
                />
              ) : (
                /* Home Screen: Header, Remaining Generations Banner, & 2-Column Grid of 7 Agent Cards */
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between pb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                          Nexus Impact AI
                        </h1>
                        {isPro && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-teal-400 text-slate-950 uppercase tracking-wider flex items-center gap-0.5">
                            <Sparkles className="w-2 h-2" />
                            <span>PRO</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-teal-400 mt-0.5">
                        Agents for social impact
                      </p>
                    </div>
                  </div>

                  {/* Free Generations Remaining Indicator / Pro Status Banner */}
                  {isPro ? (
                    <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-teal-300 font-medium">
                        <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Nexus Pro Active · Unlimited generations & PDF export</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#0F1A36] border border-[#1E2F5B] flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                          <span>Daily Free Generations</span>
                          <span className="text-slate-500">·</span>
                          <span className="font-mono text-teal-400">
                            {remainingGenerations} of {dailyLimit} remaining today
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {remainingGenerations > 0
                            ? 'Free access to Research, Humanitarian, Public Health & Knowledge Base'
                            : 'Daily free limit reached. Resets at midnight.'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          triggerHaptic('medium');
                          handleOpenPaywall(
                            remainingGenerations <= 0
                              ? 'Daily limit reached. Unlock unlimited generations with Nexus Pro'
                              : 'Upgrade to Nexus Pro for unlimited generations & PDF export'
                          );
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-[#070D1E] text-xs font-bold shrink-0 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Upgrade</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {AGENTS.map((agent: AgentConfig, index: number) => {
                      const isFullWidth =
                        index === AGENTS.length - 1 && AGENTS.length % 2 !== 0;
                      const isLocked = isAgentProOnly(agent.id) && !isPro;

                      return (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          isLocked={isLocked}
                          onSelect={handleOpenAgent}
                          onLockedClick={() =>
                            handleOpenPaywall(`Unlock ${agent.name} with Nexus Pro`)
                          }
                          isFullWidth={isFullWidth}
                        />
                      );
                    })}
                  </div>
                </div>
              )
            ) : currentTab === 'history' ? (
              <HistoryTab
                onSelectSession={(item) => {
                  triggerHaptic('light');
                  setActiveAgentId(item.agentId);
                  setCurrentTab('agents');
                }}
                onRefreshTrigger={historyRefreshKey}
              />
            ) : currentTab === 'pro' ? (
              <ProTab
                reason={paywallReason}
                onClearReason={() => setPaywallReason(null)}
                onBackToAgents={() => {
                  triggerHaptic('light');
                  setCurrentTab('agents');
                  setPaywallReason(null);
                }}
              />
            ) : (
              <SettingsTab
                onExportData={handleExportAllData}
                onReplayOnboarding={() => setShowOnboarding(true)}
              />
            )}
          </div>

          {/* Bottom Tab Bar (Agents, History, Pro, Settings) */}
          <nav
            className={`${
              isDeviceFrame ? 'absolute' : 'sticky'
            } bottom-0 left-0 right-0 h-16 bg-[#0A1226]/95 backdrop-blur-md border-t border-[#1E2F5B] z-30 px-3 flex items-center justify-around select-none`}
            aria-label="Bottom Navigation"
          >
            <button
              onClick={() => handleTabChange('agents')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                currentTab === 'agents'
                  ? 'text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">Agents</span>
            </button>

            <button
              onClick={() => handleTabChange('history')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                currentTab === 'history'
                  ? 'text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">History</span>
            </button>

            <button
              onClick={() => handleTabChange('pro')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer relative ${
                currentTab === 'pro'
                  ? 'text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight flex items-center gap-1">
                <span>Pro</span>
                {isPro && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('settings')}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
                currentTab === 'settings'
                  ? 'text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SettingsIcon className="w-5 h-5 mb-1" />
              <span className="text-[10px] tracking-tight">Settings</span>
            </button>
          </nav>
        </div>
      </main>

      {/* Expo Project Code & Run Modal */}
      <ExpoProjectModal
        isOpen={showExpoModal}
        onClose={() => setShowExpoModal(false)}
      />

      {/* Simple Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
}

export default function App() {
  return (
    <PurchasesProvider>
      <MainApp />
    </PurchasesProvider>
  );
}
