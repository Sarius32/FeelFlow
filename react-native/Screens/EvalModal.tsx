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
  VStack,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AngryIcon,
  FrownIcon,
  LaughIcon,
  MehIcon,
  SaveIcon,
  SmileIcon,
} from 'lucide-react-native';
import {useState} from 'react';
import {useAppData} from '../Contexts/BackendContext';
import {AppStackScreens} from '../types';

type EvalModalProps = {
  shown: boolean;
  setShown: (value: boolean) => void;
};

const EvalModal = ({shown, setShown}: EvalModalProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreens>>();
  const {saveSleepHours} = useAppData();

  const [yesterday, setYesterday] = useState(2);

  const marginSty = {margin: 20};

  const yesterdayToIcon = (evaluation: number) => {
    const icons = [
      <AngryIcon />,
      <FrownIcon />,
      <MehIcon />,
      <SmileIcon />,
      <LaughIcon />,
    ];

    return icons[evaluation];
  };

  return (
    <Modal isOpen={shown}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader style={marginSty}>
          <Heading size="lg">How was yesterday?</Heading>
        </ModalHeader>
        <ModalBody style={marginSty} marginTop={10}>
          <Slider
            h={40}
            defaultValue={8}
            minValue={0}
            maxValue={4}
            step={1}
            value={yesterday}
            onChange={setYesterday}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Center>
            <VStack w={200}>
              <Center margin={5}>{yesterdayToIcon(yesterday)}</Center>
              <Center>
                <Button w={100} marginTop={30} onPress={() => {}}>
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
