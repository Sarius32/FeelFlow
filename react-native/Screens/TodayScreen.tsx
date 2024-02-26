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
import {InfoIcon, PlusIcon} from 'lucide-react-native';
import {useEffect, useState} from 'react';
import {VictoryAxis, VictoryChart, VictoryLine} from 'victory-native';
import {useAppData} from '../DataContext';
import {HomeStackScreens} from '../types';

const TodayScreen = ({}: NativeStackScreenProps<HomeStackScreens, 'Today'>) => {
  const {
    sleepHoursSavedForToday,
    getTodaysPrediction,
    getYesterdaysSteps,
    getYesterdaysSleep,
    getYesterdaysMood,
  } = useAppData();

  const [sleepVisible, setSleepVisible] = useState(false);
  const [yesterdayVisible, setYesterdayVisible] = useState(false);

  const [ySteps, setYSteps] = useState<number>();
  const [ySleep, setYSleep] = useState<string>();
  const [yMood, setYMood] = useState<{x: Date; y: number}[]>();
  const [prediction, setPrediction] = useState<string>();

  const convertPredictionToString = (pred: number) => {
    return ['Bad', 'OK', 'Good'][pred];
  };

  const convertHoursToString = (hours: number) => {
    if (hours == 0) return 'none';

    let timeStr = '';
    if (hours >= 1) {
      timeStr = timeStr + Math.floor(hours) + ' hour' + (hours >= 2 ? 's' : '');
    }

    let minutes = hours - Math.floor(hours);
    if (minutes > 0) {
      if (timeStr.length) timeStr = timeStr + ' ';
      timeStr = timeStr + minutes * 60 + ' mins';
    }

    return timeStr;
  };

  const convertMoodToLineData = (mood: {time: string; value: number}[]) => {
    const data = mood.map(e => {
      const dateTime = new Date();
      dateTime.setDate(dateTime.getDate() - 1);
      const [hours, minutes, seconds] = e.time.split(':').map(t => Number(t));
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);
      dateTime.setSeconds(seconds);
      return {
        timestamp: dateTime,
        value: e.value,
      };
    });

    return data.map(e => {
      return {x: e.timestamp, y: e.value};
    });
  };

  const getLineDomain = () => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return {x: [yesterday, today], y: [-1, 6]};
  };

  useEffect(() => {
    // load all data
    if (prediction == undefined)
      getTodaysPrediction().then(val => {
        setPrediction(convertPredictionToString(val));
      });
    if (ySteps == undefined)
      getYesterdaysSteps().then(val => {
        setYSteps(val);
      });

    if (ySleep == undefined)
      getYesterdaysSleep().then(val => {
        setYSleep(convertHoursToString(val));
      });

    if (yMood == undefined)
      getYesterdaysMood().then(val => {
        setYMood(convertMoodToLineData(val));
      });
  }, []);

  return (
    <Center h="100%" w="100%">
      <VStack w="100%" h="100%" padding={50}>
        <Center margin={50}>
          <Heading marginBottom={20} size="2xl">
            Your day will be
          </Heading>

          {prediction != undefined && (
            <HStack>
              <Heading size="xl">{prediction}</Heading>
              <Center>
                <Icon
                  as={InfoIcon}
                  marginLeft={5}
                  marginTop={2}
                  color="gray"></Icon>
              </Center>
            </HStack>
          )}
          {prediction == undefined && (
            <HStack>
              <Spinner size="large" />
              <Center>
                <Text marginLeft={10}>Loading</Text>
              </Center>
            </HStack>
          )}
        </Center>

        <Center>
          <Heading>Todays stats:</Heading>

          <HStack>
            <Text>Steps taken: </Text>
            {ySteps == undefined && <Icon as={PlusIcon}></Icon>}
            {ySteps != undefined && <Text>{ySteps}</Text>}
          </HStack>

          <HStack>
            <Text>Hours slept: </Text>
            {ySleep == undefined && <Icon as={PlusIcon}></Icon>}
            {ySleep != undefined && <Text>{ySleep}</Text>}
          </HStack>

          <VStack>
            <Center>
              <HStack>
                <Heading>Mood</Heading>
                <Icon as={PlusIcon}></Icon>
              </HStack>
            </Center>
            {yMood != undefined && (
              <VictoryChart>
                <VictoryLine
                  data={yMood}
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
          </VStack>
        </Center>
      </VStack>
    </Center>
  );
};

export default TodayScreen;
