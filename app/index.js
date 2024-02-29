/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { EventType } from '@notifee/react-native';

// handle notifications when app is not in foreground
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, action } = detail;

  // Check if the user pressed the notification for inputting the mood and then delete the notification
    if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
    // Remove the notification
        await notifee.cancelNotification(notification.id);
    }

});


AppRegistry.registerComponent(appName, () => App);
