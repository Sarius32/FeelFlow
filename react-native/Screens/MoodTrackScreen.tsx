import {Text, View} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackScreens} from '../types';

import styles from '../assets/styles';

const MoodTrackScreen = ({}: NativeStackScreenProps<
  HomeStackScreens,
  'MoodTrack'
>) => {
  return (
    <View style={styles.container}>
      <Text>Your current Mood</Text>
    </View>
  );
};

export default MoodTrackScreen;
