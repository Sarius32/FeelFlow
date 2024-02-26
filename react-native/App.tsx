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

import {AppStackScreens} from './types';

const AppStack = createNativeStackNavigator<AppStackScreens>();

function App() {
  const noHeaderOptions = {headerShown: false};

  useEffect(() => {}, []);

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
