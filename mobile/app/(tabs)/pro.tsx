import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Sparkles, Check, CheckCircle2, AlertCircle, RefreshCw, Lock } from 'lucide-react-native';
import { usePurchases } from '../../src/lib/purchases';
import { COLORS } from '../../src/theme/colors';

export default function ProScreen() {
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const { isPro, offerings, purchasePackage, restorePurchases } = usePurchases();
  const [selectedPlan, setSelectedPlan] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // RevenueCat "default" offering (or fallback to current offering)
  const defaultOffering = offerings?.all?.['default'] || offerings?.current;
  const monthlyPkg = defaultOffering?.monthly;
  const annualPkg = defaultOffering?.annual;

  const activePackage = selectedPlan === 'ANNUAL' ? annualPkg : monthlyPkg;

  const benefits = [
    'Unlimited Agent Directives & Long-Form Synthesis',
    'Full access to Grant Proposal, Human Rights & Women\'s Health agents',
    'Audit-Ready PDF Dossier Export via expo-print & expo-sharing',
    'Offline Field Crisis Mode (local cached neural synthesis)',
    'Priority Low-Latency Humanitarian Server Cluster',
  ];

  const handleSubscribe = async () => {
    if (!activePackage || loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const info = await purchasePackage(activePackage);
      if (info?.entitlements?.active?.['pro']?.isActive) {
        setMessage({ type: 'success', text: 'Welcome to Nexus Pro! All premium capabilities unlocked.' });
      }
    } catch (e: any) {
      if (!e?.userCancelled) {
        setMessage({ type: 'error', text: e?.message || 'Purchase failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const info = await restorePurchases();
      if (info?.entitlements?.active?.['pro']?.isActive) {
        setMessage({ type: 'success', text: 'Purchases restored! Your "pro" entitlement is active.' });
      } else {
        setMessage({ type: 'error', text: 'No active "pro" subscriptions found to restore.' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Failed to restore purchases.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Contextual Reason Banner */}
        {reason && !isPro && (
          <View style={styles.reasonBanner}>
            <Lock size={16} color="#F59E0B" />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        )}

        {/* Title */}
        <View style={styles.header}>
          <View style={styles.proLabelRow}>
            <Sparkles size={16} color={COLORS.teal} />
            <Text style={styles.proLabel}>Nexus Pro</Text>
          </View>
          <Text style={styles.title}>Nexus Pro</Text>
          <Text style={styles.subtitle}>
            Advanced AI intelligence, offline crisis mode, and multi-author grant modeling for social impact organizations.
          </Text>
        </View>

        {/* Entitlement Banner */}
        {isPro && (
          <View style={styles.entitledBox}>
            <CheckCircle2 size={18} color={COLORS.teal} />
            <Text style={styles.entitledText}>Your "pro" entitlement is active.</Text>
          </View>
        )}

        {/* Message Feedback */}
        {message && (
          <View style={[styles.msgBox, message.type === 'success' ? styles.successBox : styles.errorBox]}>
            {message.type === 'success' ? (
              <CheckCircle2 size={16} color={COLORS.teal} />
            ) : (
              <AlertCircle size={16} color={COLORS.error} />
            )}
            <Text style={[styles.msgText, message.type === 'success' ? styles.successText : styles.errorText]}>
              {message.text}
            </Text>
          </View>
        )}

        {/* Packages Selector */}
        <Text style={styles.sectionTitle}>Select Subscription</Text>
        <View style={styles.plansRow}>
          {/* Annual */}
          <Pressable
            style={[styles.planCard, selectedPlan === 'ANNUAL' && styles.planCardActive]}
            onPress={() => setSelectedPlan('ANNUAL')}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 33%</Text>
            </View>
            <Text style={styles.planTitle}>Annual Plan</Text>
            <Text style={styles.planPrice}>
              {annualPkg?.product.priceString || '$79.99/yr'}
            </Text>
            <Text style={styles.planSub}>$6.67/mo (Billed annually)</Text>
          </Pressable>

          {/* Monthly */}
          <Pressable
            style={[styles.planCard, selectedPlan === 'MONTHLY' && styles.planCardActive]}
            onPress={() => setSelectedPlan('MONTHLY')}
          >
            <Text style={styles.planTitle}>Monthly Plan</Text>
            <Text style={styles.planPrice}>
              {monthlyPkg?.product.priceString || '$9.99/mo'}
            </Text>
            <Text style={styles.planSub}>Flexible monthly billing</Text>
          </Pressable>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsHeading}>Included with Nexus Pro</Text>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.checkIconWrap}>
                <Check size={14} color={COLORS.teal} />
              </View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Subscribe CTA */}
        <Pressable
          style={[styles.subscribeBtn, loading && styles.btnDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#070D1E" size="small" />
          ) : (
            <Text style={styles.subscribeBtnText}>
              {isPro
                ? `Switch to ${selectedPlan === 'ANNUAL' ? 'Annual' : 'Monthly'}`
                : `Subscribe (${activePackage?.product.priceString || (selectedPlan === 'ANNUAL' ? '$79.99/yr' : '$9.99/mo')})`}
            </Text>
          )}
        </Pressable>

        {/* Restore Purchases Button */}
        <Pressable
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={loading}
        >
          <RefreshCw size={14} color={COLORS.textSecondary} />
          <Text style={styles.restoreBtnText}>Restore Purchases</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  reasonBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1, borderColor: '#F59E0B', padding: 12, borderRadius: 12, marginBottom: 16 },
  reasonText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700', flex: 1 },
  header: { marginBottom: 20 },
  proLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  proLabel: { fontSize: 12, fontWeight: '700', color: COLORS.teal, textTransform: 'uppercase' },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6, lineHeight: 18 },
  entitledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderColor: COLORS.teal,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  entitledText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
  msgBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  successBox: { backgroundColor: 'rgba(20, 184, 166, 0.12)', borderColor: COLORS.teal },
  errorBox: { backgroundColor: 'rgba(244, 63, 94, 0.12)', borderColor: COLORS.error },
  msgText: { fontSize: 12, flex: 1 },
  successText: { color: COLORS.tealLight },
  errorText: { color: COLORS.error },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 10 },
  plansRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  planCardActive: { borderColor: COLORS.teal, backgroundColor: '#122245' },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: COLORS.teal,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: { color: '#070D1E', fontSize: 9, fontWeight: '900' },
  planTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  planPrice: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  planSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4 },
  benefitsCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 20,
    gap: 12,
  },
  benefitsHeading: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  benefitText: { fontSize: 12, color: COLORS.textPrimary, flex: 1, lineHeight: 18 },
  subscribeBtn: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.5 },
  subscribeBtnText: { color: '#070D1E', fontWeight: '800', fontSize: 14 },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  restoreBtnText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
});
