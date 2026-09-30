import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  FileText,
  ShieldAlert,
  Scale,
  Activity,
  HeartHandshake,
  Database,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react-native';
import { AGENTS, AgentConfig } from '../../src/data/agents';
import { usePurchases } from '../../src/lib/purchases';
import { useDailyGenerations, isAgentProOnly } from '../../src/lib/limits';
import { COLORS } from '../../src/theme/colors';

const { width } = Dimensions.get('window');
const cardGap = 12;
const cardWidth = (width - 32 - cardGap) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const { isPro } = usePurchases();
  const { remaining, limit } = useDailyGenerations(isPro);

  const renderIcon = (iconName: string, color: string) => {
    const size = 24;
    switch (iconName) {
      case 'Search':
        return <Search size={size} color={color} strokeWidth={2} />;
      case 'FileText':
        return <FileText size={size} color={color} strokeWidth={2} />;
      case 'ShieldAlert':
        return <ShieldAlert size={size} color={color} strokeWidth={2} />;
      case 'Scale':
        return <Scale size={size} color={color} strokeWidth={2} />;
      case 'Activity':
        return <Activity size={size} color={color} strokeWidth={2} />;
      case 'HeartHandshake':
        return <HeartHandshake size={size} color={color} strokeWidth={2} />;
      case 'Database':
        return <Database size={size} color={color} strokeWidth={2} />;
      default:
        return <Search size={size} color={color} strokeWidth={2} />;
    }
  };

  const handleCardPress = (agent: AgentConfig) => {
    const isLocked = isAgentProOnly(agent.id) && !isPro;
    if (isLocked) {
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: `Unlock ${agent.name} with Nexus Pro` },
      });
    } else {
      router.push({
        pathname: '/agent/[id]',
        params: { id: agent.id },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Title and PRO badge */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>Nexus Impact AI</Text>
            {isPro && (
              <View style={styles.proBadge}>
                <Sparkles size={10} color="#070D1E" />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.brandSubtitle}>Agents for social impact</Text>
        </View>

        {/* Free Generations Remaining Indicator */}
        {!isPro ? (
          <View style={styles.limitsBanner}>
            <Text style={styles.limitsText}>
              Free Tier: <Text style={styles.limitsHighlight}>{remaining} of {limit}</Text> generations remaining today
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/pro',
                  params: { reason: 'Upgrade for unlimited daily generations' },
                })
              }
            >
              <Text style={styles.upgradeLink}>Upgrade</Text>
            </Pressable>
          </View>
        ) : null}

        {/* 2-Column Grid */}
        <View style={styles.gridContainer}>
          {AGENTS.map((agent: AgentConfig, index: number) => {
            const isFullWidth = index === AGENTS.length - 1 && AGENTS.length % 2 !== 0;
            const isLocked = isAgentProOnly(agent.id) && !isPro;

            return (
              <Pressable
                key={agent.id}
                onPress={() => handleCardPress(agent)}
                style={({ pressed }) => [
                  styles.card,
                  isFullWidth ? styles.fullWidthCard : styles.halfWidthCard,
                  isLocked && styles.lockedCard,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.iconContainer}>
                    {renderIcon(agent.icon, isLocked ? COLORS.textMuted : agent.accentColor || COLORS.teal)}
                  </View>
                  {isLocked && (
                    <View style={styles.lockBadge}>
                      <Lock size={12} color="#F59E0B" />
                    </View>
                  )}
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.agentName} numberOfLines={1}>
                    {agent.name}
                  </Text>
                  <Text style={styles.agentDescription} numberOfLines={2}>
                    {agent.description}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  {isLocked ? (
                    <Text style={styles.unlockText}>Unlock with Pro</Text>
                  ) : (
                    <ChevronRight size={16} color={COLORS.teal} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  header: { marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },
  proBadge: {
    backgroundColor: COLORS.teal,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  proBadgeText: { color: '#070D1E', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  brandSubtitle: { fontSize: 14, color: COLORS.tealLight, marginTop: 2, fontWeight: '500' },
  limitsBanner: {
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitsText: { color: COLORS.textSecondary, fontSize: 12 },
  limitsHighlight: { color: COLORS.tealLight, fontWeight: '700' },
  upgradeLink: { color: COLORS.teal, fontSize: 12, fontWeight: '700' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: cardGap },
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  lockedCard: { backgroundColor: '#0B1327', borderColor: '#1A2645' },
  halfWidthCard: { width: cardWidth },
  fullWidthCard: { width: '100%' },
  cardPressed: {
    backgroundColor: COLORS.surfaceHover,
    borderColor: COLORS.teal,
    transform: [{ scale: 0.98 }],
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  lockBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 6,
    borderRadius: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  cardInfo: { flex: 1, justifyContent: 'center' },
  agentName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  agentDescription: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16, textTransform: 'lowercase' },
  cardFooter: { alignItems: 'flex-end', marginTop: 6 },
  unlockText: { color: '#F59E0B', fontSize: 11, fontWeight: '600' },
});
