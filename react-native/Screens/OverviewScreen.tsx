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
  const [sleepVisible, setSleepVisible] = useState(true);
  const [yesterdayVisible, setYesterdayVisible] = useState(true);

  const {sleepHoursSavedForToday} = useAppData();

  useEffect(() => {
    sleepHoursSavedForToday().then(saved => {
      setSleepVisible(!saved);
    });
  }, []);

  useEffect(() => {
    if (!sleepVisible) {
      // check if eval for yesterday is needed
    }
  }, [sleepVisible]);

  return (
    <Center h="100%" w="100%">
      <SleepModal shown={sleepVisible} setShown={setSleepVisible} />
      <EvalModal shown={yesterdayVisible} setShown={setYesterdayVisible} />
    </Center>
  );
};

export default OverviewScreen;
