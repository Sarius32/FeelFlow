import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {AppStackScreens, HomeStackScreens} from '../types';

import MoodTrackScreen from './MoodTrackScreen';
import OverviewScreen from './OverviewScreen';

const HomeTab = createMaterialBottomTabNavigator<HomeStackScreens>();

const HomeScreen = ({}: NativeStackScreenProps<AppStackScreens, 'Home'>) => {
  return (
    <HomeTab.Navigator
      id="HomeStack"
      initialRouteName="Overview"
      barStyle={{height: 80}}>
      <HomeTab.Screen
        name="MoodTrack"
        component={MoodTrackScreen}
        options={{
          tabBarLabel: 'Your Mood',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="graphql" color={color} size={26} />
          ),
        }}
      />
      <HomeTab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="graphql" color={color} size={26} />
          ),
        }}
      />
    </HomeTab.Navigator>
  );
};

export default HomeScreen;
