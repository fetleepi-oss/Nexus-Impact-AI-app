import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, ChevronRight, Trash2 } from 'lucide-react-native';
import { getHistory, clearHistory, StoredHistoryItem } from '../../src/lib/ai';
import { COLORS } from '../../src/theme/colors';

export default function HistoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<StoredHistoryItem[]>([]);

  const loadHistory = async () => {
    const list = await getHistory();
    setItems(list);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSelectSession = (item: StoredHistoryItem) => {
    router.push({
      pathname: '/agent/[id]',
      params: { id: item.agentId },
    });
  };

  const handleClear = async () => {
    await clearHistory();
    setItems([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Past agent syntheses & audit notes</Text>
        </View>
        {items.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <Trash2 size={16} color={COLORS.error} />
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Clock size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No past syntheses yet</Text>
            <Text style={styles.emptySubtitle}>
              Run any agent from the home screen to log structured social impact dossiers here.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => handleSelectSession(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.agentTag}>{item.agentName}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <Text style={styles.promptText} numberOfLines={2}>
                "{item.prompt}"
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.viewText}>Reopen in Agent</Text>
                <ChevronRight size={14} color={COLORS.teal} />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  clearBtn: { padding: 8 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  card: { backgroundColor: COLORS.surfaceCard, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: 14, padding: 14, marginBottom: 12 },
  cardPressed: { backgroundColor: COLORS.surfaceHover, borderColor: COLORS.teal },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  agentTag: { color: COLORS.tealLight, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  timestamp: { color: COLORS.textMuted, fontSize: 11 },
  promptText: { color: COLORS.textPrimary, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  viewText: { color: COLORS.teal, fontSize: 11, fontWeight: '600' },
});
