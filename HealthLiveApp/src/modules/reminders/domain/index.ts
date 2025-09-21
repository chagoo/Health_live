export type ReminderType = 'movement' | 'hydration' | 'measurements' | 'exercise';

export const NOTIFICATION_TONES = [
  {id: 'default', label: 'Predeterminado'},
  {id: 'focus', label: 'Campana suave'},
  {id: 'energetic', label: 'Energía matutina'},
  {id: 'calm', label: 'Olas tranquilas'},
] as const;

export type NotificationTone = typeof NOTIFICATION_TONES[number]['id'];

export type ReminderPreference = {
  id: ReminderType;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  frequencyMinutes: number;
  sound: NotificationTone;
  enabled: boolean;
};

export type ReminderPreferenceUpdate = Partial<Omit<ReminderPreference, 'id'>>;

export const REMINDER_PREFERENCES_STORAGE_KEY = '@healthlive:reminder-preferences';
export const COMPLIANCE_STORAGE_KEY = '@healthlive:reminder-compliance';

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreference[] = [
  {
    id: 'movement',
    title: 'Moverse cada hora',
    description: 'Recibe avisos suaves para levantarte, estirarte y reactivar tu circulación.',
    startTime: '09:00',
    endTime: '21:00',
    frequencyMinutes: 60,
    sound: 'energetic',
    enabled: true,
  },
  {
    id: 'hydration',
    title: 'Beber agua',
    description: 'Hidratación regular a lo largo del día con recordatorios motivadores.',
    startTime: '08:00',
    endTime: '20:00',
    frequencyMinutes: 120,
    sound: 'calm',
    enabled: true,
  },
  {
    id: 'measurements',
    title: 'Tomar mediciones',
    description: 'Registra tus signos vitales clave y mantén tu historial al día.',
    startTime: '07:30',
    endTime: '21:00',
    frequencyMinutes: 720,
    sound: 'focus',
    enabled: true,
  },
  {
    id: 'exercise',
    title: 'Ejercicios planificados',
    description: 'Prepárate para las rutinas sugeridas y mantén tu plan en marcha.',
    startTime: '18:00',
    endTime: '19:00',
    frequencyMinutes: 1440,
    sound: 'default',
    enabled: true,
  },
];

export type ComplianceTask = {
  id: string;
  label: string;
  description: string;
  type: 'daily' | 'weekly';
  relatedReminder?: ReminderType;
};

export const DAILY_COMPLIANCE_TASKS: ComplianceTask[] = [
  {
    id: 'movement-check',
    type: 'daily',
    label: 'Movimiento activo',
    description: 'Marca cuando te hayas levantado y movido al menos una vez cada hora.',
    relatedReminder: 'movement',
  },
  {
    id: 'hydration-check',
    type: 'daily',
    label: 'Hidratación cumplida',
    description: 'Confirma que bebiste agua en todos los avisos programados.',
    relatedReminder: 'hydration',
  },
  {
    id: 'measurements-check',
    type: 'daily',
    label: 'Registro de mediciones',
    description: 'Indica si actualizaste tus signos vitales del día.',
    relatedReminder: 'measurements',
  },
  {
    id: 'exercise-check',
    type: 'daily',
    label: 'Rutina completada',
    description: 'Señala cuando terminaste los ejercicios planificados.',
    relatedReminder: 'exercise',
  },
];

export const WEEKLY_COMPLIANCE_TASKS: ComplianceTask[] = [
  {
    id: 'planning-review',
    type: 'weekly',
    label: 'Revisión de la semana',
    description: 'Evalúa tus progresos y ajusta el plan de ejercicios.',
  },
  {
    id: 'measurements-review',
    type: 'weekly',
    label: 'Comparar mediciones',
    description: 'Analiza tendencias de signos vitales y comenta con tu especialista.',
  },
  {
    id: 'selfcare-session',
    type: 'weekly',
    label: 'Sesión de autocuidado',
    description: 'Regálate una sesión de respiración, yoga o relajación guiada.',
  },
];

export const SOUND_LABELS: Record<NotificationTone, string> = NOTIFICATION_TONES.reduce(
  (labels, tone) => {
    return {...labels, [tone.id]: tone.label};
  },
  {} as Record<NotificationTone, string>,
);

export const MIN_FREQUENCY_MINUTES = 15;

export const MAX_REMINDERS_PER_DAY = 24;
