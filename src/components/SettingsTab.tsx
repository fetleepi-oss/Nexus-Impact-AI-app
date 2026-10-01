import React, { useState } from 'react';
import { Shield, Smartphone, Key, HardDrive, Info, Check, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface SettingsTabProps {
  onExportData: () => void;
  onReplayOnboarding?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onExportData, onReplayOnboarding }) => {
  const [offlineCache, setOfflineCache] = useState(true);
  const [strictPrivacy, setStrictPrivacy] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const toggleHapticSetting = () => {
    triggerHaptic('medium');
    setHapticFeedback(!hapticFeedback);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Settings</h2>
        <p className="text-xs text-teal-400 font-medium mt-0.5">
          System preferences and field security
        </p>
      </div>

      {/* RevenueCat Shipaton 2026 Entry */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#0F1A36] to-[#132347] border border-amber-500/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-100">RevenueCat Shipaton 2026</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Next Gen Award
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Integrated with RevenueCat Test Store public SDK (<code className="text-teal-300 text-[10px]">test_bxrpYHfE...</code>), default offering (Monthly & Annual), and active <code className="text-teal-300 text-[10px]">pro</code> entitlement gating.
        </p>
        <div className="pt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-[#070D1E] text-slate-300 border border-[#1E2F5B]">Offering: default</span>
          <span className="px-2 py-0.5 rounded bg-[#070D1E] text-slate-300 border border-[#1E2F5B]">Entitlement: pro</span>
          <span className="px-2 py-0.5 rounded bg-[#070D1E] text-slate-300 border border-[#1E2F5B]">SDK: react-native-purchases 8.5.0</span>
        </div>
      </div>

      {/* Field Operations & Offline Mode */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Field Operations
        </h3>

        <div className="p-4 rounded-xl bg-[#0F1A36] border border-[#1E2F5B] space-y-4">
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <h4 className="text-xs font-semibold text-slate-200">
                Offline Field Cache
              </h4>
              <p className="text-[11px] text-slate-400">
                Pre-load Sphere guidelines and prompt frameworks for disconnected crisis zones
              </p>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                setOfflineCache(!offlineCache);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                offlineCache ? 'bg-teal-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle offline cache"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-900 transition-transform ${
                  offlineCache ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-[#1E2F5B]" />

          <div className="flex items-center justify-between">
            <div className="pr-4">
              <h4 className="text-xs font-semibold text-slate-200">
                Zero-Telemetry Beneficiary Privacy
              </h4>
              <p className="text-[11px] text-slate-400">
                Do not transmit identifiable personal data or GPS coordinates
              </p>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                setStrictPrivacy(!strictPrivacy);
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                strictPrivacy ? 'bg-teal-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle strict privacy"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-900 transition-transform ${
                  strictPrivacy ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-[#1E2F5B]" />

          <div className="flex items-center justify-between">
            <div className="pr-4">
              <h4 className="text-xs font-semibold text-slate-200">
                Haptic Feedback on Key Buttons
              </h4>
              <p className="text-[11px] text-slate-400">
                Vibration feedback on Generate, Copy, Export, and Navigation
              </p>
            </div>
            <button
              onClick={toggleHapticSetting}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                hapticFeedback ? 'bg-teal-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle haptic feedback"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-900 transition-transform ${
                  hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding Guide */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          User Guide
        </h3>
        <div className="p-4 rounded-xl bg-[#0F1A36] border border-[#1E2F5B] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Welcome Onboarding Tour</h4>
            <p className="text-[11px] text-slate-400">Revisit the intro guide to all 7 specialized agents</p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              if (onReplayOnboarding) onReplayOnboarding();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C152B] hover:bg-[#132145] text-teal-300 text-xs font-semibold border border-[#1E2F5B] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>View Tour</span>
          </button>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Data Management
        </h3>

        <div className="p-4 rounded-xl bg-[#0F1A36] border border-[#1E2F5B] space-y-3">
          <p className="text-xs text-slate-300">
            Export all synthesized reports, logframes, and saved outputs as a structured JSON archive.
          </p>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onExportData();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0C152B] hover:bg-[#132145] text-teal-300 text-xs font-semibold border border-[#1E2F5B] transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Archive JSON</span>
          </button>
        </div>
      </div>

      {/* App & Build Info */}
      <div className="p-4 rounded-xl bg-[#0C152B] border border-[#1E2F5B] space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Info className="w-4 h-4 text-teal-400" />
          <span>Nexus Impact AI · Build Info</span>
        </div>
        <div className="text-[11px] text-slate-400 space-y-1 font-mono">
          <div className="flex justify-between">
            <span>Framework:</span>
            <span className="text-slate-200">Expo SDK 52 (Expo Router v4)</span>
          </div>
          <div className="flex justify-between">
            <span>Export Engine:</span>
            <span className="text-slate-200">expo-print & expo-sharing (PDF)</span>
          </div>
          <div className="flex justify-between">
            <span>Tactile:</span>
            <span className="text-slate-200">expo-haptics</span>
          </div>
          <div className="flex justify-between">
            <span>Palette:</span>
            <span className="text-slate-200">Deep Navy (#070D1E) & Teal (#14B8A6)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
