import PushNotification, {Importance} from 'react-native-push-notification';
import {Platform} from 'react-native';
import {ReminderPreference} from '../domain';
import {calculateDailySlots, formatMinutesAsTime} from '../utils/time';

const CHANNEL_ID = 'healthlive-reminders';

class NotificationService {
  private configured = false;

  configure() {
    if (this.configured) {
      return;
    }

    PushNotification.configure({
      onNotification: notification => {
        if (notification?.userInfo) {
          // noop: placeholder for analytics or navigation hooks
        }
      },
      requestPermissions: Platform.OS === 'ios',
      popInitialNotification: true,
    });

    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: CHANNEL_ID,
          channelName: 'Recordatorios de hábitos saludables',
          channelDescription:
            'Notificaciones para hidratación, movimiento y rutinas planificadas.',
          importance: Importance.HIGH,
          playSound: true,
          soundName: 'default',
          vibrate: true,
        },
        created => {
          if (!created) {
            console.log('Canal de notificaciones existente reutilizado');
          }
        },
      );
    }

    this.configured = true;
  }

  async syncReminderSchedules(preferences: ReminderPreference[]) {
    this.configure();
    PushNotification.cancelAllLocalNotifications();

    preferences
      .filter(preference => preference.enabled)
      .forEach(preference => {
        const slots = calculateDailySlots(preference);

        slots.forEach((minutes, index) => {
          const scheduledDate = this.buildDate(minutes);
          PushNotification.localNotificationSchedule({
            id: `${preference.id}-${index}`,
            channelId: CHANNEL_ID,
            message: preference.title,
            date: scheduledDate,
            allowWhileIdle: true,
            repeatType: 'day',
            userInfo: {
              reminderId: preference.id,
              scheduledTime: formatMinutesAsTime(minutes),
            },
            playSound: true,
            soundName: this.resolveSoundName(preference.sound),
            importance: Importance.HIGH,
            title: 'Health Live',
            subtitle: preference.description,
          });
        });
      });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  private buildDate(minutes: number): Date {
    const now = new Date();
    const target = new Date(now);
    target.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    return target;
  }

  private resolveSoundName(sound: ReminderPreference['sound']): string | undefined {
    if (sound === 'default') {
      return 'default';
    }
    return `${sound}.mp3`;
  }
}

export default new NotificationService();
