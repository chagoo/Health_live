import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {ReminderPreference, SOUND_LABELS} from '../domain';
import {describeSchedule} from '../utils/time';

type ReminderListProps = {
  preferences: ReminderPreference[];
  loading?: boolean;
};

const ReminderList: React.FC<ReminderListProps> = ({preferences, loading}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0284c7" />
        <Text style={styles.loadingText}>Cargando recordatorios personalizados…</Text>
      </View>
    );
  }

  return (
    <View>
      {preferences.map(preference => (
        <View
          key={preference.id}
          style={[styles.reminderCard, !preference.enabled && styles.reminderDisabled]}
        >
          <Text style={styles.reminderTitle}>{preference.title}</Text>
          <Text style={styles.reminderSchedule}>{describeSchedule(preference)}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>
              Sonido:
              <Text style={styles.metaValue}> {SOUND_LABELS[preference.sound]}</Text>
            </Text>
            <Text style={styles.metaStatus}>
              {preference.enabled ? 'Activo' : 'En pausa'}
            </Text>
          </View>
          <Text style={styles.reminderDescription}>{preference.description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    color: '#475569',
    fontSize: 14,
  },
  reminderCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  reminderDisabled: {
    opacity: 0.6,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
  },
  reminderSchedule: {
    fontSize: 12,
    color: '#b45309',
    marginTop: 4,
  },
  reminderDescription: {
    marginTop: 8,
    color: '#854d0e',
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: '#92400e',
    fontSize: 12,
  },
  metaValue: {
    fontWeight: '600',
  },
  metaStatus: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default ReminderList;
