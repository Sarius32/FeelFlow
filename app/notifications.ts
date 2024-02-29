import notifee, {TriggerType} from '@notifee/react-native';
import {Platform} from 'react-native';

function calculateTriggerTimes() {
  let triggers = [];
  let now = new Date();

  now.setMinutes(now.getMinutes() + 1);
  triggers.push(now);

  return triggers;
}

export async function schedulePeriodicNotifications() {
  const triggers = calculateTriggerTimes();

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'feelflow_notifs',
      name: 'FeelFlow Notifications',
    });

    triggers.forEach(async (triggerTime, index) => {
      const dateTrigger = triggerTime.getTime();

      await notifee.createTriggerNotification(
        {
          title: 'Periodic Notification',
          body: 'This notification will 5 times.',
          android: {
            channelId: 'feelflow_notifs',
            smallIcon: 'ic_small_icon',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: dateTrigger,
        },
      );
    });
  } else {
    // iOS: Schedule individual notifications (example for demonstration)
    // Note: You'd need to manage scheduling multiple notifications as iOS does not support automatic repetition with custom intervals.
    console.log(
      'iOS does not support automatic periodic notifications through Notifee.',
    );
  }
}
