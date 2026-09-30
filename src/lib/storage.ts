// AsyncStorage compatible interface that works on both React Native and Web environments

export interface StoredHistoryItem {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  prompt: string;
  output: string;
}

const STORAGE_KEY = '@nexus_impact_history';

// Cross-platform AsyncStorage polyfill
class MemoryOrLocalStorage {
  private memStore = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // In private browsing or non-DOM
    }
    return this.memStore.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Fallback to memory
    }
    this.memStore.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // Fallback
    }
    this.memStore.delete(key);
  }
}

export const AsyncStorage = new MemoryOrLocalStorage();

// Helper functions for history items
export async function getHistoryFromStorage(): Promise<StoredHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read history from AsyncStorage', err);
    return [];
  }
}

export async function saveHistoryToStorage(
  agentId: string,
  agentName: string,
  prompt: string,
  output: string
): Promise<StoredHistoryItem> {
  const current = await getHistoryFromStorage();
  const newItem: StoredHistoryItem = {
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agentId,
    agentName,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    prompt,
    output
  };

  const updated = [newItem, ...current];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

export async function clearHistoryFromStorage(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
