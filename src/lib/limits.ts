import { useState, useEffect, useCallback } from 'react';
import { AsyncStorage } from './storage';

const LIMITS_STORAGE_KEY = '@nexus_daily_generations';
export const DAILY_FREE_LIMIT = 3;

// Free agents vs Pro-only agents
export const PRO_ONLY_AGENTS = ['grant-proposal', 'human-rights', 'womens-health'];
export const FREE_AGENTS = ['research', 'humanitarian', 'public-health', 'knowledge-base'];

export function isAgentProOnly(agentId: string): boolean {
  return PRO_ONLY_AGENTS.includes(agentId);
}

interface StoredLimitData {
  date: string; // YYYY-MM-DD
  count: number;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export async function getDailyGenerationCount(): Promise<{ count: number; remaining: number }> {
  try {
    const today = getTodayString();
    const raw = await AsyncStorage.getItem(LIMITS_STORAGE_KEY);
    if (!raw) {
      return { count: 0, remaining: DAILY_FREE_LIMIT };
    }

    const data: StoredLimitData = JSON.parse(raw);
    if (data.date !== today) {
      // New calendar day, reset count
      await AsyncStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      return { count: 0, remaining: DAILY_FREE_LIMIT };
    }

    const remaining = Math.max(0, DAILY_FREE_LIMIT - data.count);
    return { count: data.count, remaining };
  } catch (err) {
    console.error('Failed to get daily generation count:', err);
    return { count: 0, remaining: DAILY_FREE_LIMIT };
  }
}

export async function incrementDailyGenerationCount(): Promise<{ count: number; remaining: number }> {
  try {
    const today = getTodayString();
    const current = await getDailyGenerationCount();
    const newCount = current.count + 1;

    await AsyncStorage.setItem(
      LIMITS_STORAGE_KEY,
      JSON.stringify({ date: today, count: newCount })
    );

    const remaining = Math.max(0, DAILY_FREE_LIMIT - newCount);
    return { count: newCount, remaining };
  } catch (err) {
    console.error('Failed to increment daily generation count:', err);
    return { count: 1, remaining: DAILY_FREE_LIMIT - 1 };
  }
}

/**
 * Hook to read and subscribe to daily free generation limits
 */
export function useDailyGenerations(isPro: boolean) {
  const [count, setCount] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(DAILY_FREE_LIMIT);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshLimits = useCallback(async () => {
    if (isPro) {
      setCount(0);
      setRemaining(Infinity);
      setLoading(false);
      return;
    }

    const data = await getDailyGenerationCount();
    setCount(data.count);
    setRemaining(data.remaining);
    setLoading(false);
  }, [isPro]);

  useEffect(() => {
    refreshLimits();
  }, [refreshLimits]);

  const recordGeneration = async () => {
    if (isPro) return;
    const data = await incrementDailyGenerationCount();
    setCount(data.count);
    setRemaining(data.remaining);
  };

  return {
    count,
    remaining: isPro ? Infinity : remaining,
    limit: DAILY_FREE_LIMIT,
    loading,
    refreshLimits,
    recordGeneration,
    hasReachedLimit: !isPro && remaining <= 0
  };
}
