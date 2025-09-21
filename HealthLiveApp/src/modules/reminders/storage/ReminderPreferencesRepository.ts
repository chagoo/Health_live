import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_REMINDER_PREFERENCES,
  REMINDER_PREFERENCES_STORAGE_KEY,
  ReminderPreference,
  ReminderPreferenceUpdate,
  ReminderType,
  SOUND_LABELS,
} from '../domain';
import {normalizeFrequencyMinutes, normalizeTimeString} from '../utils/time';

const repositoryInstance = new (class ReminderPreferencesRepository {
  async load(): Promise<ReminderPreference[]> {
    try {
      const stored = await AsyncStorage.getItem(REMINDER_PREFERENCES_STORAGE_KEY);
      if (!stored) {
        return DEFAULT_REMINDER_PREFERENCES;
      }
      const parsed = JSON.parse(stored) as ReminderPreference[];
      if (!Array.isArray(parsed)) {
        return DEFAULT_REMINDER_PREFERENCES;
      }
      return DEFAULT_REMINDER_PREFERENCES.map(defaultPreference => {
        const saved = parsed.find(item => item.id === defaultPreference.id);
        if (!saved) {
          return defaultPreference;
        }
        return sanitizePreference(defaultPreference.id, {...defaultPreference, ...saved});
      });
    } catch (error) {
      console.warn('Error loading reminder preferences', error);
      return DEFAULT_REMINDER_PREFERENCES;
    }
  }

  async save(preferences: ReminderPreference[]): Promise<void> {
    try {
      const sanitized = preferences.map(preference =>
        sanitizePreference(preference.id, preference),
      );
      await AsyncStorage.setItem(
        REMINDER_PREFERENCES_STORAGE_KEY,
        JSON.stringify(sanitized),
      );
    } catch (error) {
      console.warn('Error saving reminder preferences', error);
    }
  }
})();

function sanitizePreference(
  id: ReminderType,
  preference: ReminderPreference,
): ReminderPreference {
  const fallback = DEFAULT_REMINDER_PREFERENCES.find(item => item.id === id);
  if (!fallback) {
    return preference;
  }
  const startTime = normalizeTimeString(preference.startTime, fallback.startTime);
  const endTime = normalizeTimeString(preference.endTime, fallback.endTime);
  const frequencyMinutes = normalizeFrequencyMinutes(
    preference.frequencyMinutes,
    fallback.frequencyMinutes,
  );

  const sound = Object.prototype.hasOwnProperty.call(SOUND_LABELS, preference.sound)
    ? preference.sound
    : fallback.sound;

  return {
    ...fallback,
    ...preference,
    id,
    startTime,
    endTime,
    frequencyMinutes,
    sound,
  };
}

export type {ReminderPreference, ReminderPreferenceUpdate, ReminderType};
export default repositoryInstance;
