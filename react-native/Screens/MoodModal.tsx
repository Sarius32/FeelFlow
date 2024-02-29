import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SaveIcon} from 'lucide-react-native';
import {useState} from 'react';

import {useAppData} from '../Contexts/BackendContext';

import {AppStackScreens} from '../types';
import {
  convertMoodToIcon,
  convertMoodsToLineData,
  getCurrentTimeString,
  getTodaysDateString,
} from '../utils';

type MoodModalProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
  setMoods: (value: {x: Date; y: number}[]) => void;
  setMoodsAvail: (value: boolean) => void;
};

const MoodModal = ({
  shown,
  setShown,
  setMoods,
  setMoodsAvail,
}: MoodModalProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreens>>();
  const {uploadMood, retrieveMoods} = useAppData();

  const [mood, setMood] = useState(2);

  const marginSty = {margin: 20};

  const handleSendPress = async () => {
    const today = getTodaysDateString();
    const now = getCurrentTimeString();
    uploadMood(today, now, mood).then(async res => {
      if (!res.loggedIn) return navigation.navigate('Login');

      if (res.uploaded) {
        const moodsData = await retrieveMoods(today);

        if (!moodsData.loggedIn) return navigation.navigate('Login');
        setMoodsAvail(moodsData.avail!);

        if (moodsData.avail) {
          setMoods(convertMoodsToLineData(moodsData.moods!));
        }

        setShown(false);
      }
    });
  };

  return (
    <Modal isOpen={shown}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader style={marginSty}>
          <Heading size="lg">How are you feeling?</Heading>
        </ModalHeader>
        <ModalBody style={marginSty} marginTop={10}>
          <Slider
            h={40}
            minValue={0}
            maxValue={4}
            step={0.01}
            value={mood}
            onChange={setMood}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Center>
            <VStack w={200}>
              <Center margin={5}>
                <Icon as={convertMoodToIcon(mood)} size="xl" />
              </Center>
              <Center>
                <Button
                  w={100}
                  marginTop={30}
                  onPress={() => handleSendPress()}>
                  <ButtonText>Save </ButtonText>
                  <ButtonIcon as={SaveIcon} />
                </Button>
              </Center>
            </VStack>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MoodModal;
