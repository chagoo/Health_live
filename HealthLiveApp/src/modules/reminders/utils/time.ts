import {
  DEFAULT_REMINDER_PREFERENCES,
  MAX_REMINDERS_PER_DAY,
  MIN_FREQUENCY_MINUTES,
  ReminderPreference,
} from '../domain';

const MINUTES_IN_DAY = 24 * 60;

export const TIME_FORMAT_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export function parseTimeString(value: string): number | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  const match = TIME_FORMAT_REGEX.exec(trimmed);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

export function formatMinutesAsTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function normalizeTimeString(
  rawValue: string,
  fallback: string,
): string {
  const parsed = parseTimeString(rawValue);
  if (parsed === null) {
    return fallback;
  }
  return formatMinutesAsTime(parsed);
}

export function normalizeFrequencyMinutes(
  value: number,
  fallback: number,
): number {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  if (value < MIN_FREQUENCY_MINUTES) {
    return MIN_FREQUENCY_MINUTES;
  }
  if (value > MINUTES_IN_DAY) {
    return MINUTES_IN_DAY;
  }
  return Math.round(value);
}

export function getDefaultPreferenceById(id: ReminderPreference['id']): ReminderPreference {
  return DEFAULT_REMINDER_PREFERENCES.find(item => item.id === id) ?? DEFAULT_REMINDER_PREFERENCES[0];
}

export function calculateDailySlots(preference: ReminderPreference): number[] {
  const start = parseTimeString(preference.startTime);
  const end = parseTimeString(preference.endTime);
  const defaults = getDefaultPreferenceById(preference.id);
  const normalizedStart = start ?? parseTimeString(defaults.startTime) ?? 8 * 60;
  const normalizedEnd = end ?? parseTimeString(defaults.endTime) ?? normalizedStart;
  const normalizedFrequency = normalizeFrequencyMinutes(
    preference.frequencyMinutes,
    defaults.frequencyMinutes,
  );

  const slots: number[] = [normalizedStart % MINUTES_IN_DAY];
  const windowRange =
    normalizedStart <= normalizedEnd
      ? normalizedEnd - normalizedStart
      : MINUTES_IN_DAY - (normalizedStart - normalizedEnd);

  if (normalizedFrequency >= MINUTES_IN_DAY || windowRange === 0) {
    return slots;
  }

  let elapsed = normalizedFrequency;
  let iterations = 0;
  const maxIterations = Math.ceil(MINUTES_IN_DAY / normalizedFrequency);
  while (elapsed <= windowRange && iterations < maxIterations) {
    const next = (normalizedStart + elapsed) % MINUTES_IN_DAY;
    slots.push(next);
    elapsed += normalizedFrequency;
    iterations += 1;
  }

  return slots.slice(0, Math.max(1, Math.min(slots.length, MAX_REMINDERS_PER_DAY)));
}

export function describeSchedule(preference: ReminderPreference): string {
  if (!preference.enabled) {
    return 'Recordatorio desactivado temporalmente';
  }
  const slots = calculateDailySlots(preference);
  const first = formatMinutesAsTime(slots[0]);
  if (slots.length === 1) {
    const repeatEvery = normalizeFrequencyMinutes(
      preference.frequencyMinutes,
      getDefaultPreferenceById(preference.id).frequencyMinutes,
    );
    if (repeatEvery >= MINUTES_IN_DAY) {
      return `Todos los días a las ${first}`;
    }
    return `Desde las ${first} cada ${repeatEvery} minutos`;
  }
  const last = formatMinutesAsTime(slots[slots.length - 1]);
  return `De ${first} a ${last} cada ${normalizeFrequencyMinutes(
    preference.frequencyMinutes,
    getDefaultPreferenceById(preference.id).frequencyMinutes,
  )} minutos`;
}
