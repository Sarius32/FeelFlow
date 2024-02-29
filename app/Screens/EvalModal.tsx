import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
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
import {LucideIcon, SaveIcon} from 'lucide-react-native';
import {useState} from 'react';

import {useAppData} from '../Contexts/BackendContext';

import {AppStackScreens} from '../types';
import {convertEvaluation, getTodaysDateString} from '../utils';

type EvalModalProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
};

const EvalModal = ({shown, setShown}: EvalModalProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreens>>();
  const {uploadEvaluation} = useAppData();

  const [evaluation, setEvaluation] = useState(1);
  const [evalDisp, setEvalDisp] = useState<{
    title: string;
    icon: LucideIcon;
    color: string;
  }>(convertEvaluation(1));

  const marginSty = {margin: 20};

  const handleSendPress = async () => {
    const today = getTodaysDateString();
    uploadEvaluation(today, evaluation).then(res => {
      if (!res.loggedIn) return navigation.navigate('Login');

      setShown(!res.uploaded);
    });
  };

  return (
    <Modal isOpen={shown}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader style={marginSty}>
          <Heading size="lg">How was today?</Heading>
        </ModalHeader>
        <ModalBody style={marginSty} marginTop={10}>
          <Slider
            h={40}
            minValue={0}
            maxValue={2}
            step={1}
            value={evaluation}
            onChange={val => {
              setEvaluation(val);
              setEvalDisp(convertEvaluation(val));
            }}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Center>
            <VStack w={200}>
              <Center>
                <HStack>
                  <Center>
                    <Icon
                      as={evalDisp!.icon}
                      color={evalDisp!.color}
                      size="xl"
                      marginTop={5}
                      marginRight={6}
                    />
                  </Center>
                  <Heading size="xl">{evalDisp!.title}</Heading>
                </HStack>
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

export default EvalModal;
