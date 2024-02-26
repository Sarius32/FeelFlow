import {
  Center,
  HStack,
  Heading,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {VictoryAxis, VictoryChart, VictoryLine} from 'victory-native';

import {AppStackScreens, HomeStackScreens} from '../types';

import {useAppData} from '../Contexts/BackendContext';

import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {PlusIcon} from 'lucide-react-native';
import {
  convertEvaluationToString,
  convertHoursToString,
  convertMoodToLineData,
  getYesterdaysDateString,
} from '../utils';

type YesterdayProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<HomeStackScreens, 'Yesterday'>,
  NativeStackScreenProps<AppStackScreens>
>;

const YesterdayScreen = ({navigation}: YesterdayProps) => {
  const {retrieveSleep, retrieveSteps, retrieveMoods, retrieveEvaluation} =
    useAppData();

  const [ySteps, setYSteps] = useState<number>();
  const [yStepsAvail, setYStepsAvail] = useState<boolean>();

  const [ySleep, setYSleep] = useState<string>();
  const [ySleepAvail, setYSleepAvail] = useState<boolean>();

  const [yMoods, setYMoods] = useState<{x: Date; y: number}[]>();
  const [yMoodsAvail, setYMoodsAvail] = useState<boolean>();

  const [yEvaluation, setYEvaluation] = useState<string>();
  const [yEvalAvail, setYEvalAvail] = useState<boolean>();

  const yesterday = getYesterdaysDateString();

  const getLineDomain = () => {
    const todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    todayDate.setMilliseconds(0);

    const yesterday = new Date(todayDate);
    yesterday.setDate(todayDate.getDate() - 1);

    return {x: [yesterday, todayDate], y: [-1, 6]};
  };

  useEffect(() => {
    if (ySleep == undefined)
      retrieveSleep(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // sleep request went through
        setYSleepAvail(res.avail!);
        if (res.avail) setYSleep(convertHoursToString(res.sleep!));
      });

    if (ySteps == undefined)
      retrieveSteps(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // steps request went through
        setYStepsAvail(res.avail!);
        if (res.avail) setYSteps(res.steps!);
      });

    if (yMoods == undefined)
      retrieveMoods(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // moods request went through
        setYMoodsAvail(res.avail!);
        if (res.avail) setYMoods(convertMoodToLineData(res.moods!));
      });

    if (yEvaluation == undefined)
      retrieveEvaluation(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // evaluation request went through
        setYEvalAvail(res.avail!);
        if (res.avail)
          setYEvaluation(convertEvaluationToString(res.evaluation!));
      });
  }, []);

  return (
    <Center h="100%" w="100%">
      <VStack w="100%" h="100%" padding={50}>
        <Center margin={50}>
          <Heading marginBottom={20} size="2xl">
            Yesterdays was
          </Heading>

          {yEvalAvail == undefined && (
            <HStack>
              <Spinner size="large" />
              <Center>
                <Text marginLeft={10}>Loading</Text>
              </Center>
            </HStack>
          )}
          {yEvalAvail == true && <Heading size="xl">{yEvaluation}</Heading>}
        </Center>

        <Center>
          {ySleepAvail != undefined && (
            <HStack>
              <Text>Hours slept: </Text>
              {ySleepAvail && <Text>{ySleep}</Text>}
              {!ySleepAvail && <Icon as={PlusIcon} />}
            </HStack>
          )}

          {yStepsAvail != undefined && (
            <HStack>
              <Text>Steps taken: </Text>
              {yStepsAvail && <Text>{ySteps}</Text>}
              {!yStepsAvail && <Icon as={PlusIcon} />}
            </HStack>
          )}

          {yMoodsAvail != undefined && yMoods && yMoods!.length > 0 && (
            <VictoryChart>
              <VictoryLine
                data={yMoods}
                interpolation="natural"
                scale={'time'}
                domain={getLineDomain()}
              />
              <VictoryAxis
                label={'\nMood'}
                tickFormat={t => new Date(t).toTimeString().split(' ')[0]}
              />
            </VictoryChart>
          )}
        </Center>
      </VStack>
    </Center>
  );
};

export default YesterdayScreen;
