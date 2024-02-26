import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SaveIcon} from 'lucide-react-native';
import {useState} from 'react';
import {useAppData} from '../Contexts/BackendContext';
import {AppStackScreens} from '../types';

type SleepModalProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
};

const SleepModal = ({shown, setShown}: SleepModalProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreens>>();
  const {saveSleepHours} = useAppData();

  const [sleepHours, setSleepHours] = useState(8);

  const marginSty = {margin: 20};

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

  return (
    <Modal isOpen={shown}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader style={marginSty}>
          <Heading size="lg">
            Enter the sleep hours of this nights sleep!
          </Heading>
        </ModalHeader>
        <ModalBody style={marginSty} marginTop={10}>
          <Slider
            h={40}
            defaultValue={8}
            minValue={0}
            maxValue={20}
            step={0.25}
            value={sleepHours}
            onChange={setSleepHours}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Center>
            <VStack w={200}>
              <Center margin={5}>
                <Text color="gray">{convertHoursToString(sleepHours)}</Text>
              </Center>
              <Center>
                <Button
                  w={100}
                  marginTop={30}
                  onPress={() => {
                    saveSleepHours(sleepHours).then(e => {
                      setShown(false);
                      if (!e.saved) navigation.navigate('Login');
                    });
                  }}>
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

export default SleepModal;
