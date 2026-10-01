import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Shield, Sparkles, Smartphone, RotateCcw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePurchases } from '../../src/lib/purchases';
import { COLORS } from '../../src/theme/colors';

const ONBOARDING_KEY = '@nexus_onboarding_completed';

export default function SettingsScreen() {
  const router = useRouter();
  const { isPro } = usePurchases();

  const handleReplayOnboarding = async () => {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>System configuration and environmental parameters</Text>
        </View>

        {/* Membership Status */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Sparkles size={20} color={COLORS.teal} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Membership Status</Text>
              <Text style={styles.cardSub}>
                {isPro ? 'Nexus Pro Entitlement Active' : 'Free Tier (3 daily generations)'}
              </Text>
            </View>
          </View>
        </View>

        {/* RevenueCat Shipaton 2026 Hackathon */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Sparkles size={20} color="#F59E0B" />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>RevenueCat Shipaton 2026</Text>
              <Text style={styles.cardSub}>
                Built for Shipaton 2026 (Next Gen Award). Integrated with RevenueCat Test Store SDK, "default" offering, and "pro" entitlement.
              </Text>
            </View>
          </View>
        </View>

        {/* Zero-Telemetry Notice */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Shield size={20} color={COLORS.teal} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Zero-Telemetry Architecture</Text>
              <Text style={styles.cardSub}>
                All directives are processed with direct zero-retention field endpoints protecting sensitive beneficiary information.
              </Text>
            </View>
          </View>
        </View>

        {/* Runtime info */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.iconWrap}>
              <Smartphone size={20} color={COLORS.teal} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Platform Target</Text>
              <Text style={styles.cardSub}>Expo SDK 52 · React Native 0.76 · Android & iOS Native</Text>
            </View>
          </View>
        </View>

        {/* Replay Onboarding */}
        <Pressable style={styles.replayBtn} onPress={handleReplayOnboarding}>
          <RotateCcw size={16} color={COLORS.teal} />
          <Text style={styles.replayText}>Replay Onboarding Tour</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  card: { backgroundColor: COLORS.surfaceCard, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.surfaceBorder },
  cardTextCol: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  cardSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },
  replayBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.surfaceBorder, backgroundColor: COLORS.surfaceCard, marginTop: 12 },
  replayText: { color: COLORS.teal, fontSize: 13, fontWeight: '700' },
});
