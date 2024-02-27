// App.js
import {config} from '@gluestack-ui/config';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';

import {DataProvider} from './DataContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthProvider} from './AuthContext';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import notifee, { TimeStampTrigger, TriggerType } from '@notifee/react-native'

import {AppStackScreens} from './types';

const AppStack = createNativeStackNavigator<AppStackScreens>();
function App() {
  const noHeaderOptions = {headerShown: false};

  useEffect(() => {
      onCreateTriggerNotification();
  }, []);

    async function onCreateTriggerNotification() {
      // Request permissions (required for iOS)
      await notifee.requestPermission()

      const date = new Date(Date.now());
      date.setHours(date.getHours()+2);

      const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });

      // Create a time-based trigger
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
      };

      // Create a trigger notification
      try {
      await notifee.createTriggerNotification(
        {
          title: 'Mood Check',
          body: 'Please Share Your Current Mood',

          android: {
            channelId,
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
             id: 'default',
            },
            timestamp: Date.now(),
            showTimestamp: true,
          },
        },
        trigger,
      );
      } catch (e) {
      console.log(e)}
    }
    const onClearNotification = () => {};

  return (
    <AuthProvider>
      <DataProvider>
        <GluestackUIProvider config={config}>
          <NavigationContainer>
            <AppStack.Navigator id="AppStack" initialRouteName="Home">
              <AppStack.Screen
                name="Login"
                component={LoginScreen}
                options={noHeaderOptions}
              />
              <AppStack.Screen
                name="Home"
                component={HomeScreen}
                options={noHeaderOptions}
              />
            </AppStack.Navigator>
          </NavigationContainer>
        </GluestackUIProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
