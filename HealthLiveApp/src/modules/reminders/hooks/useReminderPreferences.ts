import {useCallback, useEffect, useState} from 'react';
import {
  DEFAULT_REMINDER_PREFERENCES,
  ReminderPreference,
  ReminderPreferenceUpdate,
  ReminderType,
} from '../domain';
import repository from '../storage/ReminderPreferencesRepository';

export type ReminderPreferencesState = {
  loading: boolean;
  preferences: ReminderPreference[];
  updatePreference: (
    id: ReminderType,
    updates: ReminderPreferenceUpdate,
  ) => Promise<void>;
  reload: () => Promise<void>;
};

function sortPreferences(preferences: ReminderPreference[]): ReminderPreference[] {
  const order: ReminderType[] = ['movement', 'hydration', 'measurements', 'exercise'];
  return [...preferences].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );
}

export default function useReminderPreferences(): ReminderPreferencesState {
  const [preferences, setPreferences] = useState<ReminderPreference[]>(
    DEFAULT_REMINDER_PREFERENCES,
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const loaded = await repository.load();
    setPreferences(sortPreferences(loaded));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updatePreference = useCallback(
    async (id: ReminderType, updates: ReminderPreferenceUpdate) => {
      let nextState: ReminderPreference[] = [];
      setPreferences(prev => {
        const next = prev.map(preference =>
          preference.id === id ? {...preference, ...updates} : preference,
        );
        nextState = sortPreferences(next);
        return nextState;
      });
      try {
        await repository.save(nextState);
      } catch (error) {
        console.warn('Error persisting reminder preference', error);
      }
    },
    [],
  );

  return {
    loading,
    preferences,
    updatePreference,
    reload: load,
  };
}
