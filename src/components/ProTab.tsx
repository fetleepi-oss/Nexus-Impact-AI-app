import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Shield,
  Zap,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { usePurchases, PurchasesPackage } from '../lib/purchases';

interface ProTabProps {
  reason?: string | null;
  onClearReason?: () => void;
  onBackToAgents?: () => void;
}

export const ProTab: React.FC<ProTabProps> = ({
  reason,
  onClearReason,
  onBackToAgents
}) => {
  const {
    isPro,
    loading,
    offerings,
    purchasePackage,
    restorePurchases,
    resetProEntitlement
  } = usePurchases();

  const [selectedPlanType, setSelectedPlanType] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentOffering = offerings?.current;
  const monthlyPkg = currentOffering?.monthly;
  const annualPkg = currentOffering?.annual;

  const activeSelectedPackage: PurchasesPackage | null =
    selectedPlanType === 'ANNUAL' ? annualPkg || null : monthlyPkg || null;

  const benefits = [
    {
      title: 'Unlimited Daily Generations',
      desc: 'No 3-per-day restriction; run complex multi-step directives anytime'
    },
    {
      title: 'Unlock All Pro Agents',
      desc: 'Full access to Grant Proposal, Human Rights monitoring, and Women’s Health clinical protocols'
    },
    {
      title: 'Full Export & Reporting Tools',
      desc: 'Download audit-ready Markdown, JSON dossiers, and executive donor briefs'
    },
    {
      title: 'Offline Field Crisis Mode',
      desc: 'Local neural cache for rapid assessment in zero-connectivity zones'
    },
    {
      title: 'Priority Humanitarian Cluster SLA',
      desc: 'Dedicated low-latency server cluster during acute disaster response'
    }
  ];

  const handleSubscribe = async () => {
    if (!activeSelectedPackage || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await purchasePackage(activeSelectedPackage);
      setSuccessMessage(
        `Welcome to Nexus Pro! You are now subscribed to ${activeSelectedPackage.product.title}. All premium agent capabilities and unlimited generations are activated.`
      );
      if (onClearReason) onClearReason();
    } catch (err: any) {
      console.error('Purchase failed:', err);
      setErrorMessage(
        err.message || 'Payment processing was cancelled or encountered an error. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const info = await restorePurchases();
      const hasPro = Boolean(info?.entitlements?.active?.['pro']?.isActive);
      if (hasPro) {
        setSuccessMessage('Purchases restored successfully! Your "pro" entitlement is active.');
        if (onClearReason) onClearReason();
      } else {
        setErrorMessage('No active "pro" subscriptions were found for your account.');
      }
    } catch (err: any) {
      console.error('Restore failed:', err);
      setErrorMessage(err.message || 'Unable to restore purchases. Please check your network connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Back button if opened via gating modal/context */}
      {onBackToAgents && (
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2F5B]/60">
          <button
            onClick={onBackToAgents}
            className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 py-1 px-2 rounded-lg hover:bg-[#0F1A36] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Agents</span>
          </button>
        </div>
      )}

      {/* Paywall Context Reason Banner (e.g. "Unlock Grant Proposal with Nexus Pro") */}
      {reason && !isPro && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-200 uppercase tracking-wide">
              Feature Gated
            </span>
            <p className="text-amber-100/90 font-medium mt-0.5 leading-snug">
              {reason}
            </p>
          </div>
        </div>
      )}

      {/* Paywall Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Nexus Pro Membership</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Nexus Pro
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
          Unlock all 7 specialized impact agents, unlimited daily generations, and full dossier export capabilities.
        </p>
      </div>

      {/* Entitlement Status Banner (If already entitled) */}
      {isPro && (
        <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-slate-100">
                You are a Nexus Pro Member
              </h2>
            </div>
            <span className="text-[11px] font-mono font-bold bg-teal-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Active Entitlement
            </span>
          </div>
          <p className="text-xs text-teal-200/90 leading-relaxed">
            Your "pro" entitlement is active via RevenueCat. All 7 agents, unlimited daily directives, and export tools are unlocked.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              onClick={handleRestore}
              className="text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
            >
              Verify & Refresh Entitlement
            </button>
            <button
              onClick={resetProEntitlement}
              className="text-slate-400 hover:text-slate-200 text-[11px] font-mono cursor-pointer"
              title="Test store helper"
            >
              [Reset for Testing]
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/40 text-teal-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-slate-100">Success</p>
            <p className="mt-0.5 leading-snug">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Notice</p>
            <p className="mt-0.5 leading-snug">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Pricing Packages from Current Offering */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Select Subscription Plan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Annual Package (Best Value) */}
          <button
            onClick={() => setSelectedPlanType('ANNUAL')}
            className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative cursor-pointer ${
              selectedPlanType === 'ANNUAL'
                ? 'bg-[#122245] border-teal-400 ring-1 ring-teal-400/50 shadow-lg shadow-teal-950/30'
                : 'bg-[#0F1A36] border-[#1E2F5B] hover:border-slate-600'
            }`}
          >
            <div className="absolute top-3 right-3 bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save 33%
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-100">Annual Plan</span>
              </div>
              <p className="text-xs text-slate-400">
                {annualPkg?.product.description || 'Full access with offline crisis mode, billed annually.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E2F5B]/70 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-100">
                  {annualPkg?.product.priceString || '$79.99/yr'}
                </span>
                <span className="text-xs text-teal-400 font-medium ml-1.5">
                  ($6.67/mo)
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlanType === 'ANNUAL'
                    ? 'border-teal-400 bg-teal-400 text-slate-950'
                    : 'border-slate-500'
                }`}
              >
                {selectedPlanType === 'ANNUAL' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </button>

          {/* Monthly Package */}
          <button
            onClick={() => setSelectedPlanType('MONTHLY')}
            className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative cursor-pointer ${
              selectedPlanType === 'MONTHLY'
                ? 'bg-[#122245] border-teal-400 ring-1 ring-teal-400/50 shadow-lg shadow-teal-950/30'
                : 'bg-[#0F1A36] border-[#1E2F5B] hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-100">Monthly Plan</span>
              </div>
              <p className="text-xs text-slate-400">
                {monthlyPkg?.product.description || 'Full flexible monthly access to all specialized agents.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E2F5B]/70 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-100">
                  {monthlyPkg?.product.priceString || '$9.99/mo'}
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlanType === 'MONTHLY'
                    ? 'border-teal-400 bg-teal-400 text-slate-950'
                    : 'border-slate-500'
                }`}
              >
                {selectedPlanType === 'MONTHLY' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Benefits List */}
      <div className="p-5 rounded-2xl bg-[#0F1A36] border border-[#1E2F5B] space-y-3.5">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Included with Nexus Pro
        </h3>

        <div className="space-y-3">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">{b.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Subscribe & Restore */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#070D1E] font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal-950/50 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-[#070D1E] border-t-transparent rounded-full animate-spin" />
              <span>Contacting Store...</span>
            </>
          ) : (
            <>
              <span>
                {isPro
                  ? `Switch to ${selectedPlanType === 'ANNUAL' ? 'Annual' : 'Monthly'}`
                  : `Subscribe to Nexus Pro (${activeSelectedPackage?.product.priceString || '$79.99/yr'})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={handleRestore}
          disabled={isProcessing}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0F1A36] hover:bg-[#15244C] text-slate-300 hover:text-slate-100 border border-[#1E2F5B] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>Restore Purchases</span>
        </button>

        <p className="text-[10px] text-center text-slate-500 pt-1 leading-relaxed">
          Subscriptions auto-renew unless cancelled at least 24h before the end of the billing cycle. Secured via RevenueCat.
        </p>
      </div>
    </div>
  );
};
