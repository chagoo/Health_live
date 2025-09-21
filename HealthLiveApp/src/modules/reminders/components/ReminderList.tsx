import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Reminder = {
  id: string;
  title: string;
  schedule: string;
};

const reminders: Reminder[] = [
  {id: '1', title: 'Tomar medicación matutina', schedule: '07:30 - Todos los días'},
  {id: '2', title: 'Sesión de estiramientos', schedule: '12:00 - Lunes a Viernes'},
  {id: '3', title: 'Revisión de hidratación', schedule: 'Cada 2 horas'},
];

const ReminderList: React.FC = () => (
  <View>
    {reminders.map(reminder => (
      <View key={reminder.id} style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>{reminder.title}</Text>
        <Text style={styles.reminderSchedule}>{reminder.schedule}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  reminderCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
});

export default ReminderList;
