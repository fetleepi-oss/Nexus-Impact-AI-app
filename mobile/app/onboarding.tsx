import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles, FileText, Globe, ArrowRight, Check } from 'lucide-react-native';
import { COLORS } from '../src/theme/colors';

const ONBOARDING_KEY = '@nexus_onboarding_completed';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    {
      badge: 'Welcome',
      title: 'Nexus Impact AI',
      subtitle: 'Specialized AI agents engineered for humanitarian missions, NGOs, and researchers.',
      icon: Sparkles,
      points: [
        'Evidence-backed social science synthesis and empirical analysis',
        'Built for low-resource environments and crisis triage',
        'Zero-telemetry architecture protecting sensitive beneficiary data',
      ],
    },
    {
      badge: '7 Specialized Agents',
      title: 'Domain-Native Intelligence',
      subtitle: 'Trained on multilateral frameworks, Sphere Standards, and WHO clinical guidelines.',
      icon: FileText,
      points: [
        'Research & Evidence Synthesis (academic meta-synthesis)',
        'Humanitarian & Crisis Response (Sphere WASH & logistics plans)',
        'Grant Proposal & M&E Structuring (USAID, Global Fund, Horizon)',
        'Human Rights, Public Health & Women\'s Health clinical bundles',
      ],
    },
    {
      badge: 'Pro Capabilities',
      title: 'Mission-Ready & Offline',
      subtitle: 'Equip your team with unlimited directives and audit-ready PDF export.',
      icon: Globe,
      points: [
        'Free Tier: 3 free generations daily across core agents',
        'Pro Tier: Unlimited generations and full Grant Proposal access',
        'Formatted PDF Dossier Export via expo-print and expo-sharing',
      ],
    },
  ];

  const current = steps[step];
  const IconComponent = current.icon;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Step Indicator */}
        <View style={styles.progressRow}>
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{current.badge}</Text>
          </View>
          <View style={styles.dotsRow}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>

        {/* Icon & Heading */}
        <View style={styles.iconWrap}>
          <IconComponent size={28} color={COLORS.teal} />
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>

        {/* Points */}
        <View style={styles.pointsList}>
          {current.points.map((pt, i) => (
            <View key={i} style={styles.pointRow}>
              <View style={styles.checkWrap}>
                <Check size={12} color={COLORS.tealLight} />
              </View>
              <Text style={styles.pointText}>{pt}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.continueBtn}
            onPress={handleNext}
          >
            <Text style={styles.continueText}>
              {step === steps.length - 1 ? 'Enter Nexus Impact AI' : 'Continue'}
            </Text>
            <ArrowRight size={16} color="#070D1E" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badgeWrap: { backgroundColor: 'rgba(20, 184, 166, 0.15)', borderWidth: 1, borderColor: COLORS.teal, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: COLORS.tealLight, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 24, backgroundColor: COLORS.teal },
  dotInactive: { width: 8, backgroundColor: COLORS.surfaceBorder },
  iconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.surfaceCard, borderWidth: 1, borderColor: COLORS.tealBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginTop: 8 },
  pointsList: { marginVertical: 24, gap: 14, borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder, paddingTop: 18 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkWrap: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(20, 184, 166, 0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  pointText: { flex: 1, fontSize: 13, color: COLORS.textPrimary, lineHeight: 18 },
  actionsRow: { marginTop: 'auto', paddingTop: 16 },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.teal, height: 50, borderRadius: 14 },
  continueText: { color: '#070D1E', fontSize: 14, fontWeight: '800' },
});
