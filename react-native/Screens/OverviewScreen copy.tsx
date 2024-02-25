import Slider from '@react-native-community/slider';
import React, {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Save} from 'lucide-react-native';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppData} from '../DataContext';
import styles from '../assets/styles';
import {HomeStackScreens} from '../types';

const convertMoodEmoticon = (mood: number) => {
  const moodEmoticon = ['sad', 'confused', 'neutral', 'happy', 'excited'];

  return 'emoticon-' + moodEmoticon[mood - 1];
};

const convertMoodColor = (mood: number) => {
  const moodColor = ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653'];

  return moodColor[mood - 1];
};

const OverviewScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackScreens, 'Overview'>) => {
  const {saveMood, moodData, saveSleepHours, todaysSleepSaved} = useAppData();
  const [sleepSlider, setSleepValue] = useState(8);
  const [moodSlider, setMoodValue] = useState(3);

  const [todaysMoodAvail, setTodaysMoodAvail] = useState(false);

  const dimensions = Dimensions.get('window');
  const date = new Date().toISOString().split('T')[0];

  let dispData: LineChartData = {
    labels: [],
    datasets: [
      {
        data: Array.from(
          moodData.find(i => i.date == date)?.values?.values() ?? [],
        ),
        strokeWidth: 1,
      },
    ],
  };

  useEffect(() => {
    setTodaysMoodAvail(moodData.some(i => i.date == date));

    if (!todaysMoodAvail) return;

    dispData = {
      labels: [],
      datasets: [
        {
          data: Array.from(
            moodData.find(i => i.date == date)?.values?.values() ?? [],
          ),
          strokeWidth: 1,
        },
      ],
    };
  }, [moodData]);

  return (
    <View style={{flex: 1}}>
      {todaysMoodAvail && (
        <LineChart
          data={dispData}
          width={dimensions.width}
          height={dimensions.height - 80}
          chartConfig={{
            backgroundGradientTo: '#698F3F',
            backgroundGradientFrom: '#B9314F',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#E6E6E6',
            },
          }}
          bezier
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          withVerticalLines={false}
          withHorizontalLines={false}
        />
      )}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!todaysSleepSaved && (
          <View style={{...styles.box, marginTop: 400}}>
            <Heading>Todays sleep</Heading>

            <Slider
              style={{...styles.slider, width: '100%'}}
              minimumValue={1}
              maximumValue={16}
              step={0.5}
              minimumTrackTintColor="gray"
              maximumTrackTintColor="gray"
              thumbTintColor="gray"
              value={sleepSlider}
              onValueChange={setSleepValue}
            />
            <HStack>
              <Center w={65}>
                <Text>{sleepSlider}h</Text>
              </Center>
              <Button
                borderRadius="$full"
                size="sm"
                paddingHorizontal={10}
                onPress={() => saveSleepHours(sleepSlider)}>
                <ButtonIcon as={Save} />
              </Button>
            </HStack>
          </View>
        )}

        <View style={{...styles.box, marginTop: todaysSleepSaved ? 400 : 20}}>
          <MaterialCommunityIcons
            name={convertMoodEmoticon(moodSlider)}
            color={convertMoodColor(moodSlider)}
            size={50}
          />

          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            minimumTrackTintColor={convertMoodColor(moodSlider)}
            maximumTrackTintColor={convertMoodColor(moodSlider)}
            thumbTintColor={convertMoodColor(moodSlider)}
            value={moodSlider}
            onValueChange={setMoodValue}
          />

          <Button
            size="lg"
            variant="outline"
            onPress={() => {
              saveMood(moodSlider);
            }}>
            <ButtonText>CONFIRM</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default OverviewScreen;
