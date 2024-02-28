// App.js
import {config} from '@gluestack-ui/config';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';

import {AuthProvider} from './Contexts/AuthContext';
import {BackendProvider} from './Contexts/BackendContext';
import {HealthProvider} from './Contexts/HealthContext';

import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';

import {AppStackScreens} from './types';

const AppStack = createNativeStackNavigator<AppStackScreens>();

function App() {
  const noHeaderOptions = {headerShown: false};

  useEffect(() => {}, []);

  return (
    <AuthProvider>
      <HealthProvider>
        <BackendProvider>
          <GluestackUIProvider config={config}>
            <NavigationContainer>
              <AppStack.Navigator id="AppStack" initialRouteName="Login">
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
        </BackendProvider>
      </HealthProvider>
    </AuthProvider>
  );
}

export default App;
