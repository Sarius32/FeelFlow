import {Icon} from '@gluestack-ui/themed';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivitySquareIcon, ScanFaceIcon} from 'lucide-react-native';
import React, {useEffect} from 'react';

import {useAppData} from '../Contexts/BackendContext';
import {useHealth} from '../Contexts/HealthContext';

import TodayScreen from './TodayScreen';
import YesterdayScreen from './YesterdayScreen';

import {AppStackScreens, HomeStackScreens} from '../types';
import {dateToDateISOString} from '../utils';

const HomeTab = createMaterialBottomTabNavigator<HomeStackScreens>();

const HomeScreen = ({}: NativeStackScreenProps<AppStackScreens, 'Home'>) => {
  const {getGoogleFitSteps} = useHealth();
  const {uploadSteps} = useAppData();

  useEffect(() => {
    // update the steps for yesterday to get the last value
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    getGoogleFitSteps(yesterday).then(async steps => {
      if (steps != undefined) {
        await uploadSteps(dateToDateISOString(yesterday), steps);
      }
    });
  }, []);

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
