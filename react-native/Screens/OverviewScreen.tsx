import {Center} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';

import SleepModal from './SleepModal';

import {useAppData} from '../DataContext';

import {HomeStackScreens} from '../types';
import EvalModal from './EvalModal';

const OverviewScreen = ({}: NativeStackScreenProps<
  HomeStackScreens,
  'Overview'
>) => {
  const [sleepVisible, setSleepVisible] = useState(false);
  const [yesterdayVisible, setYesterdayVisible] = useState(false);

  const {sleepHoursSavedForToday} = useAppData();



  return (
    <Center h="100%" w="100%">
      <SleepModal shown={sleepVisible} setShown={setSleepVisible} />
      <EvalModal shown={yesterdayVisible} setShown={setYesterdayVisible} />
    </Center>
  );
};

export default OverviewScreen;
