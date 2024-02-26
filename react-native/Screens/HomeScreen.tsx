import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';

import {AppStackScreens, HomeStackScreens} from '../types';

import {Icon} from '@gluestack-ui/themed';
import {ActivitySquareIcon, ScanFaceIcon} from 'lucide-react-native';
import TodayScreen from './TodayScreen';
import YesterdayScreen from './YesterdayScreen';

const HomeTab = createMaterialBottomTabNavigator<HomeStackScreens>();

const HomeScreen = ({}: NativeStackScreenProps<AppStackScreens, 'Home'>) => {
  return (
    <HomeTab.Navigator
      id="HomeStack"
      initialRouteName="Today"
      barStyle={{height: 80}}>
      <HomeTab.Screen
        name="Yesterday"
        component={YesterdayScreen}
        options={{
          tabBarLabel: 'Yesterday',
          tabBarIcon: ({color}) => (
            <Icon as={ActivitySquareIcon} color={color} marginTop={2.5} />
          ),
        }}
      />
      <HomeTab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({color}) => (
            <Icon as={ScanFaceIcon} color={color} marginTop={2.5} />
          ),
        }}
      />
    </HomeTab.Navigator>
  );
};

export default HomeScreen;
