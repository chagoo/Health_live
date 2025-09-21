import {useEffect} from 'react';
import {ReminderPreference} from '../domain';
import NotificationService from '../services/NotificationService';

export default function useReminderNotifications(
  preferences: ReminderPreference[],
  ready: boolean,
) {
  useEffect(() => {
    NotificationService.configure();
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    NotificationService.syncReminderSchedules(preferences);
  }, [preferences, ready]);
}
