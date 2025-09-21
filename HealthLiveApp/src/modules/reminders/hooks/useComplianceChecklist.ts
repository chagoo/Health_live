import {useCallback, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COMPLIANCE_STORAGE_KEY,
  DAILY_COMPLIANCE_TASKS,
  WEEKLY_COMPLIANCE_TASKS,
} from '../domain';

export type ChecklistStatus = {
  daily: Record<string, boolean>;
  weekly: Record<string, boolean>;
  dailyCompletion: number;
  weeklyCompletion: number;
  toggleDaily: (id: string) => void;
  toggleWeekly: (id: string) => void;
  loading: boolean;
};

type StoredCompliance = {
  daily: Record<string, Record<string, boolean>>;
  weekly: Record<string, Record<string, boolean>>;
};

function createEmptyStatus(ids: string[]): Record<string, boolean> {
  return ids.reduce<Record<string, boolean>>((acc, id) => {
    acc[id] = false;
    return acc;
  }, {});
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getISOWeekKey(date = new Date()): string {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

export default function useComplianceChecklist(): ChecklistStatus {
  const [loading, setLoading] = useState(true);
  const [dailyStatus, setDailyStatus] = useState<Record<string, boolean>>(() =>
    createEmptyStatus(DAILY_COMPLIANCE_TASKS.map(task => task.id)),
  );
  const [weeklyStatus, setWeeklyStatus] = useState<Record<string, boolean>>(() =>
    createEmptyStatus(WEEKLY_COMPLIANCE_TASKS.map(task => task.id)),
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const todayKey = getTodayKey();
      const weekKey = getISOWeekKey();
      try {
        const stored = await AsyncStorage.getItem(COMPLIANCE_STORAGE_KEY);
        if (!stored) {
          setDailyStatus(createEmptyStatus(DAILY_COMPLIANCE_TASKS.map(task => task.id)));
          setWeeklyStatus(createEmptyStatus(WEEKLY_COMPLIANCE_TASKS.map(task => task.id)));
          setLoading(false);
          return;
        }
        const parsed = JSON.parse(stored) as StoredCompliance;
        const dailyForToday =
          parsed.daily?.[todayKey] ??
          createEmptyStatus(DAILY_COMPLIANCE_TASKS.map(task => task.id));
        const weeklyForWeek =
          parsed.weekly?.[weekKey] ??
          createEmptyStatus(WEEKLY_COMPLIANCE_TASKS.map(task => task.id));
        setDailyStatus(dailyForToday);
        setWeeklyStatus(weeklyForWeek);
      } catch (error) {
        console.warn('Error al cargar el cumplimiento', error);
        setDailyStatus(createEmptyStatus(DAILY_COMPLIANCE_TASKS.map(task => task.id)));
        setWeeklyStatus(createEmptyStatus(WEEKLY_COMPLIANCE_TASKS.map(task => task.id)));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const persist = useCallback(
    async (nextDaily: Record<string, boolean>, nextWeekly: Record<string, boolean>) => {
      const payload: StoredCompliance = {
        daily: {[getTodayKey()]: nextDaily},
        weekly: {[getISOWeekKey()]: nextWeekly},
      };
      try {
        await AsyncStorage.setItem(COMPLIANCE_STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('Error guardando el cumplimiento', error);
      }
    },
    [],
  );

  const toggleDaily = useCallback(
    async (id: string) => {
      setDailyStatus(prev => {
        const next = {...prev, [id]: !prev[id]};
        persist(next, weeklyStatus).catch(() => undefined);
        return next;
      });
    },
    [persist, weeklyStatus],
  );

  const toggleWeekly = useCallback(
    async (id: string) => {
      setWeeklyStatus(prev => {
        const next = {...prev, [id]: !prev[id]};
        persist(dailyStatus, next).catch(() => undefined);
        return next;
      });
    },
    [dailyStatus, persist],
  );

  const dailyCompletion = useMemo(() => {
    const total = DAILY_COMPLIANCE_TASKS.length || 1;
    const achieved = Object.values(dailyStatus).filter(Boolean).length;
    return Math.round((achieved / total) * 100);
  }, [dailyStatus]);

  const weeklyCompletion = useMemo(() => {
    const total = WEEKLY_COMPLIANCE_TASKS.length || 1;
    const achieved = Object.values(weeklyStatus).filter(Boolean).length;
    return Math.round((achieved / total) * 100);
  }, [weeklyStatus]);

  return {
    daily: dailyStatus,
    weekly: weeklyStatus,
    dailyCompletion,
    weeklyCompletion,
    toggleDaily,
    toggleWeekly,
    loading,
  };
}
