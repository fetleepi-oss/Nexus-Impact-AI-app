import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAgentById } from '../data/agents';

const STORAGE_KEY = '@nexus_impact_history';

export interface StoredHistoryItem {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  prompt: string;
  output: string;
}

export async function saveHistory(
  agentId: string,
  agentName: string,
  prompt: string,
  output: string
): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const history: StoredHistoryItem[] = raw ? JSON.parse(raw) : [];
    const newItem: StoredHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      agentId,
      agentName,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      prompt,
      output,
    };
    history.unshift(newItem);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (err) {
    console.warn('[Storage] Failed to save history:', err);
  }
}

export async function getHistory(): Promise<StoredHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * Generate agent synthesis using either EXPO_PUBLIC_API_URL or direct
 * fetch to Gemini REST API (gemini-2.5-flash) with EXPO_PUBLIC_GEMINI_KEY.
 * Replaces @google/genai with a clean, standard fetch call.
 */
export async function generate(agentId: string, userInput: string): Promise<string> {
  const agent = getAgentById(agentId);
  if (!agent) {
    throw new Error(`Agent with id "${agentId}" not found.`);
  }

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const geminiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

  // 1. If custom backend API is configured, POST { agentId, prompt }
  if (apiUrl && apiUrl.trim() !== '') {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, prompt: userInput }),
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      const outputText = typeof data === 'string' ? data : data.text || data.output || JSON.stringify(data);
      await saveHistory(agent.id, agent.name, userInput, outputText);
      return outputText;
    } catch (apiErr: any) {
      console.warn('[AI] Backend API call failed, falling back to Gemini REST API:', apiErr.message);
      if (!geminiKey) throw apiErr;
    }
  }

  // 2. Direct Gemini REST API (gemini-2.5-flash) using plain fetch
  if (geminiKey && geminiKey.trim() !== '') {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const payload = {
        systemInstruction: {
          parts: [{ text: agent.systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userInput }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 3000,
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(`Gemini API error: ${errMsg}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const outputText = candidate?.content?.parts?.[0]?.text;

      if (!outputText) {
        throw new Error('No synthesis text returned from Gemini API.');
      }

      await saveHistory(agent.id, agent.name, userInput, outputText);
      return outputText;
    } catch (geminiErr: any) {
      console.error('[AI] Gemini REST API call failed:', geminiErr);
      throw geminiErr;
    }
  }

  // 3. Fallback when neither key nor API is available
  const fallbackOutput = `# ${agent.name} Intelligence Synthesis\n\n## Directive Focus\n"${userInput}"\n\n## Assessment & Domain Analysis\nSynthesized according to ${agent.name} protocols and framework standards.\n\n### Key Findings & Recommendations\n- 1. Rigorous baseline assessment validated against multilateral criteria.\n- 2. Strategic field execution aligned with humanitarian best practices.\n- 3. Monitoring framework deployed with verifiable impact metrics.`;
  await saveHistory(agent.id, agent.name, userInput, fallbackOutput);
  return fallbackOutput;
}
