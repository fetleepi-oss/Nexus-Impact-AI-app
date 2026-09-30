import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { Send, Sparkles, AlertCircle, RotateCcw, Lock, Copy, Check, FileDown } from 'lucide-react-native';
import { getAgentById } from '../../src/data/agents';
import { generate } from '../../src/lib/ai';
import { usePurchases } from '../../src/lib/purchases';
import { useDailyGenerations, isAgentProOnly } from '../../src/lib/limits';
import { COLORS } from '../../src/theme/colors';

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const agent = getAgentById(id || '');

  const { isPro } = usePurchases();
  const { remaining, record } = useDailyGenerations(isPro);

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!agent) {
    return (
      <View style={styles.notFoundContainer}>
        <AlertCircle size={40} color={COLORS.textMuted} />
        <Text style={styles.notFoundText}>Agent not found</Text>
      </View>
    );
  }

  const isProAgent = isAgentProOnly(agent.id);
  const isLocked = isProAgent && !isPro;

  const handleGenerate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (isLocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: `Unlock ${agent.name} with Nexus Pro` },
      });
      return;
    }

    if (!isPro && remaining <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: 'Daily limit reached (3/3 used). Unlock unlimited generations with Nexus Pro' },
      });
      return;
    }

    const input = prompt.trim();
    if (!input || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await generate(agent.id, input);
      setOutput(result);
      await record();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(err.message || 'Failed to generate output. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  // Copy button for free & pro users
  const handleCopy = async () => {
    if (!output) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export PDF (Pro only) using expo-print and expo-sharing
  const handleExportPdf = async () => {
    if (!output) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isPro) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({
        pathname: '/(tabs)/pro',
        params: { reason: 'Unlock PDF Export with Nexus Pro' },
      });
      return;
    }

    setExporting(true);
    try {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const formattedBody = output
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nexus Impact AI - ${agent.name} Output</title>
  <style>
    @page { margin: 20mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      line-height: 1.6;
      font-size: 11pt;
      padding: 24px;
    }
    .header {
      border-bottom: 2px solid #14B8A6;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand { font-size: 18pt; font-weight: 800; color: #070D1E; }
    .sub { font-size: 9pt; color: #14B8A6; font-weight: 600; text-transform: uppercase; }
    .meta { font-size: 9pt; color: #64748B; margin-top: 4px; }
    .content {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px;
      white-space: pre-wrap;
      font-family: "SF Mono", Menlo, monospace;
      font-size: 10pt;
    }
    .footer {
      margin-top: 32px;
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
      font-size: 8pt;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Nexus Impact AI</div>
    <div class="sub">Agent Dossier · ${agent.name}</div>
    <div class="meta">Export Date: ${currentDate}</div>
  </div>
  <div class="content">${formattedBody}</div>
  <div class="footer">Confidential · Social Impact Strategic Intelligence · Nexus Pro</div>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Share ${agent.name} PDF Dossier`,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: any) {
      Alert.alert('Export Failed', e.message || 'Could not generate PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: agent.name,
          headerStyle: { backgroundColor: COLORS.backgroundSecondary },
          headerTintColor: COLORS.textPrimary,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Pro Gated Notice */}
        {isLocked && (
          <View style={styles.lockedNotice}>
            <Lock size={16} color="#F59E0B" />
            <Text style={styles.lockedNoticeText}>
              This agent requires Nexus Pro. Tap generate to unlock.
            </Text>
          </View>
        )}

        {/* Agent Info Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.agentTag}>{agent.category}</Text>
          <Text style={styles.agentHeaderTitle}>{agent.name}</Text>
          <Text style={styles.agentOneLiner}>{agent.description}</Text>
          <Text style={styles.agentFullBio}>{agent.fullDescription}</Text>
        </View>

        {/* Suggested Directives */}
        <Text style={styles.sectionHeading}>Suggested Directives</Text>
        <View style={styles.promptsList}>
          {agent.suggestedPrompts.map((p, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [styles.promptChip, pressed && styles.promptChipPressed]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPrompt(p);
                setErrorMessage(null);
              }}
            >
              <Sparkles size={14} color={COLORS.teal} style={styles.chipIcon} />
              <Text style={styles.promptChipText}>{p}</Text>
            </Pressable>
          ))}
        </View>

        {/* Text Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={prompt}
            onChangeText={(t) => {
              setPrompt(t);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder={agent.placeholderPrompt}
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
          />
          <Pressable
            style={[styles.generateButton, (!prompt.trim() || loading) && styles.buttonDisabled]}
            onPress={handleGenerate}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#070D1E" size="small" />
            ) : isLocked ? (
              <>
                <Lock size={16} color="#070D1E" />
                <Text style={styles.generateButtonText}>Unlock with Pro</Text>
              </>
            ) : (
              <>
                <Send size={16} color="#070D1E" />
                <Text style={styles.generateButtonText}>Generate</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Error Box with Retry */}
        {errorMessage && (
          <View style={styles.errorBox}>
            <View style={styles.errorHeader}>
              <AlertCircle size={18} color={COLORS.error} />
              <Text style={styles.errorTitle}>Generation Failed</Text>
            </View>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable style={styles.retryButton} onPress={handleGenerate} disabled={loading}>
              <RotateCcw size={14} color="#070D1E" />
              <Text style={styles.retryButtonText}>Retry Directive</Text>
            </Pressable>
          </View>
        )}

        {/* Result Area */}
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultHeading}>
              {loading ? 'Synthesizing...' : 'Agent Result'}
            </Text>
            {output && !loading && (
              <View style={styles.actionButtonsRow}>
                {/* Copy Button (for Free & Pro users) */}
                <Pressable onPress={handleCopy} style={styles.actionBtn}>
                  {copied ? (
                    <>
                      <Check size={14} color={COLORS.teal} />
                      <Text style={[styles.actionBtnText, { color: COLORS.teal }]}>Copied</Text>
                    </>
                  ) : (
                    <>
                      <Copy size={14} color={COLORS.textSecondary} />
                      <Text style={styles.actionBtnText}>Copy</Text>
                    </>
                  )}
                </Pressable>

                {/* Export PDF Button (Pro Only) */}
                <Pressable
                  onPress={handleExportPdf}
                  style={[styles.actionBtn, styles.exportBtn]}
                  disabled={exporting}
                >
                  {exporting ? (
                    <ActivityIndicator size="small" color="#070D1E" />
                  ) : (
                    <>
                      <FileDown size={14} color={isPro ? '#070D1E' : '#F59E0B'} />
                      <Text style={[styles.actionBtnText, { color: isPro ? '#070D1E' : '#F59E0B' }]}>
                        {isPro ? 'Export PDF' : 'PDF (Pro)'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator color={COLORS.teal} size="large" />
              <Text style={styles.loadingText}>Synthesizing domain analysis for {agent.name}...</Text>
            </View>
          ) : (
            <ScrollView style={styles.resultScroll} nestedScrollEnabled>
              <Text style={styles.resultText}>
                {output || 'Enter a directive above and tap "Generate" to synthesize.'}
              </Text>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  notFoundContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  notFoundText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  lockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  lockedNoticeText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '600', flex: 1 },
  summaryCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 20,
  },
  agentTag: { fontSize: 11, fontWeight: '700', color: COLORS.tealLight, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  agentHeaderTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  agentOneLiner: { fontSize: 13, color: COLORS.teal, fontWeight: '500', marginTop: 2, textTransform: 'lowercase' },
  agentFullBio: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 10 },
  sectionHeading: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  promptsList: { gap: 8, marginBottom: 20 },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  promptChipPressed: { backgroundColor: COLORS.surfaceHover, borderColor: COLORS.teal },
  chipIcon: { marginRight: 8 },
  promptChipText: { fontSize: 12, color: COLORS.textPrimary, flex: 1, lineHeight: 16 },
  inputContainer: { backgroundColor: COLORS.surfaceCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.surfaceBorder, padding: 14, marginBottom: 16 },
  textInput: { color: COLORS.textPrimary, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  generateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.teal, borderRadius: 10, height: 44, marginTop: 10 },
  buttonDisabled: { opacity: 0.45 },
  generateButtonText: { color: '#070D1E', fontWeight: '700', fontSize: 14 },
  errorBox: { backgroundColor: COLORS.errorBg, borderColor: COLORS.errorBorder, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  errorHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  errorTitle: { color: COLORS.error, fontWeight: '700', fontSize: 13 },
  errorText: { color: COLORS.textPrimary, fontSize: 12, lineHeight: 17, marginBottom: 10 },
  retryButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', gap: 6, backgroundColor: COLORS.error, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  retryButtonText: { color: '#070D1E', fontSize: 12, fontWeight: '700' },
  resultContainer: { backgroundColor: COLORS.surfaceCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.tealBorder, padding: 16 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceBorder },
  resultHeading: { fontSize: 14, fontWeight: '600', color: COLORS.tealLight },
  actionButtonsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  exportBtn: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  actionBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  loadingArea: { paddingVertical: 32, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.tealLight, fontSize: 13, fontWeight: '500' },
  resultScroll: { maxHeight: 380 },
  resultText: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 20, fontFamily: 'monospace' },
});
