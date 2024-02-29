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
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

import {useAppData} from '../Contexts/BackendContext';

import SleepModal from './SleepModal';

import {AppStackScreens, HomeStackScreens} from '../types';

import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {LucideIcon, PlusCircleIcon, RotateCcwIcon} from 'lucide-react-native';

import {useHealth} from '../Contexts/HealthContext';

import EvalModal from './EvalModal';
import MoodModal from './MoodModal';

import {
  convertEvaluation,
  convertHoursToString,
  convertMoodsToLineData,
  getTodaysDateString,
} from '../utils';

type TodayProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<HomeStackScreens, 'Today'>,
  NativeStackScreenProps<AppStackScreens>
>;

const TodayScreen = ({navigation}: TodayProps) => {
  const {retrieveSleep, retrieveMoods, retrievePrediction, uploadSteps} =
    useAppData();
  const {getGoogleFitSteps} = useHealth();

  const [steps, setSteps] = useState<number>();
  const [stepsAvail, setStepsAvail] = useState<boolean>();

  const [sleep, setSleep] = useState<string>();
  const [sleepAvail, setSleepAvail] = useState<boolean>();
  const [sleepModal, setSleepModal] = useState<boolean>(false);

  const [moods, setMoods] = useState<{x: Date; y: number}[]>();
  const [moodsAvail, setMoodsAvail] = useState<boolean>();
  const [moodModal, setMoodModal] = useState<boolean>(false);

  const [evalModal, setEvalModal] = useState<boolean>(false);

  const [prediction, setPrediction] = useState<{
    title: string;
    icon: LucideIcon;
    color: string;
  }>();
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
    setPredAvail(undefined);
    if (prediction == undefined)
      setTimeout(() => {
        retrievePrediction(today).then(res => {
          if (!res.loggedIn) return navigation.navigate('Login');

          // prediciton request went through
          if (res.avail) setPrediction(convertEvaluation(res.prediction!));
          setPredAvail(res.avail!);
        });
      }, Math.random() * 1500);
  };

  useEffect(() => {
    if (sleep == undefined)
      retrieveSleep(today).then(res => {
        if (!res.loggedIn) return navigation.navigate('Login');

        // sleep request went through
        if (res.avail) setSleep(convertHoursToString(res.sleep!));
        setSleepAvail(res.avail!);
      });

    getGoogleFitSteps(new Date()).then(steps => {
      if (steps != undefined) {
        uploadSteps(today, steps).then(upRes => {
          if (!upRes.loggedIn) return navigation.navigate('Login');

          if (upRes.uploaded) setSteps(upRes.steps!);
          setStepsAvail(upRes.uploaded!);
        });
      }
    });

    if (moods == undefined)
      retrieveMoods(today).then(res => {
        if (!res.loggedIn) return navigation.navigate('Login');

        // moods request went through
        if (res.avail) setMoods(convertMoodsToLineData(res.moods!));
        setMoodsAvail(res.avail!);
      });

    refreshPrediction();
  }, []);

  return (
    <Center h="100%" w="100%">
      <SleepModal
        shown={sleepModal}
        setShown={setSleepModal}
        setSleep={setSleep}
        setSleepAvail={setSleepAvail}
      />
      <MoodModal
        shown={moodModal}
        setShown={setMoodModal}
        setMoods={setMoods}
        setMoodsAvail={setMoodsAvail}
      />
      <EvalModal shown={evalModal} setShown={setEvalModal} />

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
                  <Icon as={RotateCcwIcon} color="gray" marginTop={3} />
                </Center>
              </HStack>
            </Button>
          )}
          {predAvail == true && (
            <HStack>
              <Center>
                <Icon
                  as={prediction!.icon}
                  color={prediction!.color}
                  size="xl"
                  marginTop={5}
                  marginRight={6}
                />
              </Center>
              <Heading size="xl">{prediction!.title}</Heading>
            </HStack>
          )}
        </Center>

        <Center>
          {sleepAvail == true && <Text>Hours slept: {sleep}</Text>}

          {stepsAvail == true && <Text>Steps taken: {steps}</Text>}

          {moodsAvail == true && moods && moods!.length > 0 && (
            <VictoryChart>
              <VictoryScatter
                data={moods}
                scale={'time'}
                domain={getLineDomain()}
              />
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
          <HStack space="lg">
            {sleepAvail == false && (
              <Button bgColor="gray" onPress={() => setSleepModal(true)}>
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
            <Button
              bgColor="gray"
              onPress={() => {
                setMoodModal(true);
              }}>
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
          </HStack>
          {new Date().getHours() > 12 && (
            <Button
              bgColor="gray"
              marginTop={16}
              onPress={() => {
                setEvalModal(true);
              }}>
              <Text color="white">How was today?</Text>
            </Button>
          )}
        </Center>
      </VStack>
    </Center>
  );
};

export default TodayScreen;
