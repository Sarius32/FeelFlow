import {
  Center,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LucideIcon} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

import {useAppData} from '../Contexts/BackendContext';

import {AppStackScreens, HomeStackScreens} from '../types';
import {
  convertEvaluation,
  convertHoursToString,
  convertMoodsToLineData,
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

  const [yEvaluation, setYEvaluation] = useState<{
    title: string;
    icon: LucideIcon;
    color: string;
  }>();
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
        if (res.avail) setYSleep(convertHoursToString(res.sleep!));
        setYSleepAvail(res.avail!);
      });

    if (ySteps == undefined)
      retrieveSteps(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // steps request went through
        if (res.avail) setYSteps(res.steps!);
        setYStepsAvail(res.avail!);
      });

    if (yMoods == undefined)
      retrieveMoods(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // moods request went through
        if (res.avail) setYMoods(convertMoodsToLineData(res.moods!));
        setYMoodsAvail(res.avail!);
      });

    if (yEvaluation == undefined)
      retrieveEvaluation(yesterday).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // evaluation request went through
        if (res.avail) setYEvaluation(convertEvaluation(res.evaluation!));
        setYEvalAvail(res.avail!);
      });
  }, []);

  return (
    <Center h="100%" w="100%">
      <VStack w="100%" h="100%" padding={50}>
        <Center margin={50}>
          <Heading marginBottom={20} size="2xl">
            Yesterdays was
          </Heading>

          {yEvalAvail == true && (
            <HStack>
              <Center>
                <Icon
                  as={yEvaluation!.icon}
                  color={yEvaluation!.color}
                  size="xl"
                  marginTop={5}
                  marginRight={6}
                />
              </Center>
              <Heading size="xl">{yEvaluation!.title}</Heading>
            </HStack>
          )}
        </Center>

        <Center>
          {ySleepAvail == true && (
            <HStack>
              <Text>Hours slept: {ySleep}</Text>
            </HStack>
          )}

          {yStepsAvail == true && (
            <HStack>
              <Text>Steps taken: {ySteps}</Text>
            </HStack>
          )}

          {yMoodsAvail == true && yMoods && yMoods!.length > 0 && (
            <VictoryChart>
              <VictoryScatter
                data={yMoods}
                scale={'time'}
                domain={getLineDomain()}
              />
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
