import {
  Button,
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

import EvalModal from './EvalModal';
import SleepModal from './SleepModal';

import {AppStackScreens, HomeStackScreens} from '../types';

import {useAppData} from '../Contexts/BackendContext';

import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {PlusCircleIcon, PlusIcon, RotateCcwIcon} from 'lucide-react-native';
import {
  convertEvaluationToString,
  convertHoursToString,
  convertMoodToLineData,
  getTodaysDateString,
} from '../utils';

type TodayProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<HomeStackScreens, 'Today'>,
  NativeStackScreenProps<AppStackScreens>
>;

const TodayScreen = ({navigation}: TodayProps) => {
  const {retrieveSleep, retrieveSteps, retrieveMoods, retrievePrediction} =
    useAppData();

  const [sleepVisible, setSleepVisible] = useState(false);
  const [yesterdayVisible, setYesterdayVisible] = useState(false);

  const [steps, setSteps] = useState<number>();
  const [stepsAvail, setStepsAvail] = useState<boolean>();

  const [sleep, setSleep] = useState<string>();
  const [sleepAvail, setSleepAvail] = useState<boolean>();
  const [sleepModal, setSleepModal] = useState<boolean>(false);

  const [moods, setMoods] = useState<{x: Date; y: number}[]>();
  const [moodsAvail, setMoodsAvail] = useState<boolean>();

  const [prediction, setPrediction] = useState<string>();
  const [predAvail, setPredAvail] = useState<boolean>();

  const today = getTodaysDateString();

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

  const refreshPrediction = () => {
    if (prediction == undefined)
      retrievePrediction(today).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // prediciton request went through
        setPredAvail(res.avail!);
        if (res.avail)
          setPrediction(convertEvaluationToString(res.prediction!));
      });
  };

  useEffect(() => {
    if (sleep == undefined)
      retrieveSleep(today).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // sleep request went through
        setSleepAvail(res.avail!);
        if (res.avail) setSleep(convertHoursToString(res.sleep!));
      });

    if (steps == undefined)
      retrieveSteps(today).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // steps request went through
        setStepsAvail(res.avail!);
        if (res.avail) setSteps(res.steps!);
      });

    if (moods == undefined)
      retrieveMoods(today).then(res => {
        if (!res.loggedIn) navigation.navigate('Login');

        // moods request went through
        setMoodsAvail(res.avail!);
        if (res.avail) setMoods(convertMoodToLineData(res.moods!));
      });

    refreshPrediction();
  }, []);

  return (
    <Center h="100%" w="100%">
      <SleepModal shown={sleepVisible} setShown={setSleepVisible} />
      <EvalModal shown={yesterdayVisible} setShown={setYesterdayVisible} />

      <VStack w="100%" h="100%" padding={50}>
        <Center margin={50}>
          <Heading marginBottom={20} size="2xl">
            Today will be
          </Heading>

          {predAvail == undefined && (
            <HStack>
              <Spinner size="large" />
              <Center>
                <Text marginLeft={10}>Loading</Text>
              </Center>
            </HStack>
          )}
          {predAvail == false && (
            <Button
              bgColor="rgba(255, 255, 255, 0)"
              onPress={() => refreshPrediction()}>
              <HStack>
                <Text color="gray">Refresh </Text>
                <Center>
                  <Icon as={RotateCcwIcon} color="gray" />
                </Center>
              </HStack>
            </Button>
          )}
          {predAvail == true && <Heading size="xl">{prediction}</Heading>}
        </Center>

        <Center>
          {sleepAvail != undefined && (
            <HStack>
              <Text>Hours slept: </Text>
              {sleepAvail && <Text>{sleep}</Text>}
              {!sleepAvail && <Icon as={PlusIcon} />}
            </HStack>
          )}

          {stepsAvail != undefined && (
            <HStack>
              <Text>Steps taken: </Text>
              {stepsAvail && <Text>{steps}</Text>}
              {!stepsAvail && <Icon as={PlusIcon} />}
            </HStack>
          )}

          {moodsAvail != undefined && moods && moods!.length > 0 && (
            <VictoryChart>
              <VictoryLine
                data={moods}
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

        <Center marginTop={30}>
          {(sleepAvail == false || moodsAvail == false) && (
            <HStack space="lg" marginBottom={moodsAvail == false ? 16 : 0}>
              {sleepAvail == false && (
                <Button bgColor="gray">
                  <Text color="white">Sleep</Text>
                  <Center>
                    <Icon
                      as={PlusCircleIcon}
                      color="white"
                      marginLeft={10}
                      marginTop={3}
                    />
                  </Center>
                </Button>
              )}
              {moodsAvail == false && (
                <Button bgColor="gray">
                  <Text color="white">Mood</Text>
                  <Center>
                    <Icon
                      as={PlusCircleIcon}
                      color="white"
                      marginLeft={10}
                      marginTop={3}
                    />
                  </Center>
                </Button>
              )}
            </HStack>
          )}
          {new Date().getHours() > 16 && (
            <Button bgColor="gray" marginTop={16}>
              <Text color="white">How was today?</Text>
            </Button>
          )}
        </Center>
      </VStack>
    </Center>
  );
};

export default TodayScreen;
