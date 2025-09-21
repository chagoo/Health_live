import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  DEFAULT_REMINDER_PREFERENCES,
  NOTIFICATION_TONES,
  ReminderPreference,
  ReminderPreferenceUpdate,
  ReminderType,
  SOUND_LABELS,
} from '../domain';
import {normalizeFrequencyMinutes, normalizeTimeString} from '../utils/time';

type ReminderSettingsPanelProps = {
  preferences: ReminderPreference[];
  onUpdate: (id: ReminderType, updates: ReminderPreferenceUpdate) => Promise<void>;
};

type FormState = Record<
  ReminderType,
  {
    startTime: string;
    endTime: string;
    frequencyMinutes: string;
  }
>;

const toneOrder = NOTIFICATION_TONES.map(tone => tone.id);

function createInitialState(preferences: ReminderPreference[]): FormState {
  return preferences.reduce<FormState>((state, preference) => {
    state[preference.id] = {
      startTime: preference.startTime,
      endTime: preference.endTime,
      frequencyMinutes: preference.frequencyMinutes.toString(),
    };
    return state;
  }, {} as FormState);
}

const ReminderSettingsPanel: React.FC<ReminderSettingsPanelProps> = ({
  preferences,
  onUpdate,
}) => {
  const [formState, setFormState] = useState<FormState>(() =>
    createInitialState(preferences),
  );

  useEffect(() => {
    setFormState(createInitialState(preferences));
  }, [preferences]);

  const handleTimeChange = (
    id: ReminderType,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setFormState(prev => ({
      ...prev,
      [id]: {...prev[id], [field]: value},
    }));
  };

  const commitTimeChange = async (
    id: ReminderType,
    field: 'startTime' | 'endTime',
  ) => {
    const defaults = DEFAULT_REMINDER_PREFERENCES.find(item => item.id === id);
    const fallback = defaults?.[field] ?? '08:00';
    const currentValue = formState[id]?.[field] ?? fallback;
    const normalized = normalizeTimeString(currentValue, fallback);
    setFormState(prev => ({
      ...prev,
      [id]: {...prev[id], [field]: normalized},
    }));
    try {
      await onUpdate(id, {[field]: normalized});
    } catch (error) {
      console.warn('No se pudo guardar el horario del recordatorio', error);
    }
  };

  const handleFrequencyChange = (id: ReminderType, value: string) => {
    setFormState(prev => ({
      ...prev,
      [id]: {...prev[id], frequencyMinutes: value.replace(/[^0-9]/g, '')},
    }));
  };

  const commitFrequencyChange = async (id: ReminderType) => {
    const defaults = DEFAULT_REMINDER_PREFERENCES.find(item => item.id === id);
    const fallback = defaults?.frequencyMinutes ?? 60;
    const rawValue = formState[id]?.frequencyMinutes ?? fallback.toString();
    const parsed = parseInt(rawValue, 10);
    const normalized = normalizeFrequencyMinutes(parsed, fallback);
    setFormState(prev => ({
      ...prev,
      [id]: {...prev[id], frequencyMinutes: normalized.toString()},
    }));
    try {
      await onUpdate(id, {frequencyMinutes: normalized});
    } catch (error) {
      console.warn('No se pudo guardar la frecuencia del recordatorio', error);
    }
  };

  const advanceTone = async (id: ReminderType, current: ReminderPreference['sound']) => {
    const index = toneOrder.indexOf(current);
    const next = toneOrder[(index + 1) % toneOrder.length];
    try {
      await onUpdate(id, {sound: next});
    } catch (error) {
      console.warn('No se pudo actualizar el tono del recordatorio', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes de recordatorios</Text>
      <Text style={styles.subtitle}>
        Personaliza el horario, la frecuencia y el tono de cada hábito para que
        se adapten a tu rutina diaria.
      </Text>
      {preferences.map(preference => (
        <View key={preference.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>{preference.title}</Text>
              <Text style={styles.cardDescription}>{preference.description}</Text>
            </View>
            <Switch
              value={preference.enabled}
              onValueChange={value => {
                onUpdate(preference.id, {enabled: value}).catch(error => {
                  console.warn('No se pudo actualizar el estado del recordatorio', error);
                });
              }}
            />
          </View>
          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Desde</Text>
              <TextInput
                value={formState[preference.id]?.startTime ?? ''}
                onChangeText={value => handleTimeChange(preference.id, 'startTime', value)}
                onBlur={() => commitTimeChange(preference.id, 'startTime')}
                placeholder="HH:MM"
                keyboardType="numeric"
                style={styles.input}
                maxLength={5}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Hasta</Text>
              <TextInput
                value={formState[preference.id]?.endTime ?? ''}
                onChangeText={value => handleTimeChange(preference.id, 'endTime', value)}
                onBlur={() => commitTimeChange(preference.id, 'endTime')}
                placeholder="HH:MM"
                keyboardType="numeric"
                style={styles.input}
                maxLength={5}
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={[styles.field, styles.frequencyField]}>
              <Text style={styles.fieldLabel}>Frecuencia (min)</Text>
              <TextInput
                value={formState[preference.id]?.frequencyMinutes ?? ''}
                onChangeText={value => handleFrequencyChange(preference.id, value)}
                onBlur={() => commitFrequencyChange(preference.id)}
                keyboardType="numeric"
                style={styles.input}
                maxLength={4}
              />
            </View>
            <Pressable
              onPress={() => {
                advanceTone(preference.id, preference.sound).catch(() => undefined);
              }}
              style={styles.toneSelector}
            >
              <Text style={styles.toneLabel}>Tono</Text>
              <Text style={styles.toneValue}>{SOUND_LABELS[preference.sound]}</Text>
              <Text style={styles.toneHint}>Tocar para cambiar</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 4,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#e0f2fe',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c4a6e',
  },
  cardDescription: {
    marginTop: 4,
    color: '#0c4a6e',
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 18,
  },
  fieldRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  field: {
    flex: 1,
  },
  frequencyField: {
    flex: 0.7,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  toneSelector: {
    flex: 1,
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
  },
  toneLabel: {
    color: '#e0f2fe',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  toneValue: {
    color: '#f8fafc',
    fontWeight: '700',
    marginTop: 4,
    fontSize: 15,
  },
  toneHint: {
    color: '#bae6fd',
    fontSize: 11,
    marginTop: 2,
  },
});

export default ReminderSettingsPanel;
