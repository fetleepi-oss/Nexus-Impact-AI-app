import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const LIMITS_STORAGE_KEY = '@nexus_daily_generations';
export const DAILY_FREE_LIMIT = 3;

export const PRO_ONLY_AGENTS = ['grant-proposal', 'human-rights', 'womens-health'];
export const FREE_AGENTS = ['research', 'humanitarian', 'public-health', 'knowledge-base'];

export function isAgentProOnly(agentId: string): boolean {
  return PRO_ONLY_AGENTS.includes(agentId);
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export async function getDailyGenerationCount(): Promise<{ count: number; remaining: number }> {
  try {
    const today = getTodayString();
    const raw = await AsyncStorage.getItem(LIMITS_STORAGE_KEY);
    if (!raw) return { count: 0, remaining: DAILY_FREE_LIMIT };

    const data = JSON.parse(raw);
    if (data.date !== today) {
      await AsyncStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
      return { count: 0, remaining: DAILY_FREE_LIMIT };
    }

    const remaining = Math.max(0, DAILY_FREE_LIMIT - data.count);
    return { count: data.count, remaining };
  } catch (err) {
    return { count: 0, remaining: DAILY_FREE_LIMIT };
  }
}

export async function incrementDailyGenerationCount(): Promise<{ count: number; remaining: number }> {
  try {
    const today = getTodayString();
    const current = await getDailyGenerationCount();
    const newCount = current.count + 1;
    await AsyncStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify({ date: today, count: newCount }));
    return { count: newCount, remaining: Math.max(0, DAILY_FREE_LIMIT - newCount) };
  } catch (err) {
    return { count: 1, remaining: DAILY_FREE_LIMIT - 1 };
  }
}

export function useDailyGenerations(isPro: boolean) {
  const [remaining, setRemaining] = useState<number>(DAILY_FREE_LIMIT);

  const refresh = useCallback(async () => {
    if (isPro) {
      setRemaining(Infinity);
      return;
    }
    const data = await getDailyGenerationCount();
    setRemaining(data.remaining);
  }, [isPro]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const record = async () => {
    if (isPro) return;
    const data = await incrementDailyGenerationCount();
    setRemaining(data.remaining);
  };

  return { remaining: isPro ? Infinity : remaining, limit: DAILY_FREE_LIMIT, record, refresh };
}
