import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  FileText,
  Activity,
  ChevronRight,
  Check,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Welcome',
      title: 'Nexus Impact AI',
      subtitle: 'Specialized AI agents for humanitarian missions, NGOs, and researchers.',
      icon: Sparkles,
      points: [
        'Evidence-backed social science synthesis and empirical analysis',
        'Built for low-resource environments and crisis triage',
        'Zero-telemetry architecture protecting sensitive beneficiary data'
      ]
    },
    {
      badge: '7 Specialized Agents',
      title: 'Domain-Native Intelligence',
      subtitle: 'Trained on multilateral frameworks, Sphere Standards, and WHO guidelines.',
      icon: FileText,
      points: [
        'Research & Evidence Synthesis (academic meta-synthesis)',
        'Humanitarian & Crisis Response (Sphere WASH & logistics plans)',
        'Grant Proposal & M&E Structuring (USAID, Global Fund, Horizon)',
        'Human Rights, Public Health & Women’s Health clinical bundles'
      ]
    },
    {
      badge: 'Pro Capabilities',
      title: 'Mission-Ready & Offline',
      subtitle: 'Equip your team with unlimited directives and audit-ready PDF export.',
      icon: Globe,
      points: [
        'Free Tier: 3 free generations daily across core agents',
        'Pro Tier: Unlimited generations and full Grant Proposal access',
        'Formatted PDF Dossier Export via expo-print and expo-sharing'
      ]
    }
  ];

  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    triggerHaptic('light');
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      triggerHaptic('success');
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A1226] border border-[#1E2F5B] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          {/* Step Badge */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
              {current.badge}
            </span>
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === step ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon Header */}
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-teal-400" />
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-xl font-bold text-slate-100 tracking-tight leading-snug">
            {current.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {current.subtitle}
          </p>

          {/* Bullet Points */}
          <div className="mt-5 space-y-2.5 pt-4 border-t border-[#1E2F5B]/80">
            {current.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-300 stroke-[3]" />
                </div>
                <span className="text-xs text-slate-200 leading-snug">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-between gap-3 pt-3">
          {step > 0 ? (
            <button
              onClick={() => {
                triggerHaptic('light');
                setStep(step - 1);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => {
                triggerHaptic('light');
                onComplete();
              }}
              className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#070D1E] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-950/50 cursor-pointer active:scale-[0.98]"
          >
            <span>{step === steps.length - 1 ? 'Enter Nexus Impact AI' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
