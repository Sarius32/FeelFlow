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
import {convertHoursToString, getTodaysDateString} from '../utils';

type SleepModalProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
  setSleep: (value: string) => void;
  setSleepAvail: (value: boolean) => void;
};

const SleepModal = ({
  shown,
  setShown,
  setSleep,
  setSleepAvail,
}: SleepModalProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreens>>();
  const {uploadSleep} = useAppData();

  const [sleepHours, setSleepHours] = useState(8);

  const marginSty = {margin: 20};
  const today = getTodaysDateString();

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
                    uploadSleep(today, sleepHours).then(res => {
                      if (!res.loggedIn) return navigation.navigate('Login');

                      if (res.uploaded) {
                        setSleep(convertHoursToString(res.sleep!));
                        setShown(false);
                      }
                      setSleepAvail(res.uploaded!);
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
