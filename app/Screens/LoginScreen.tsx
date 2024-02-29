import {
  Button,
  ButtonIcon,
  Center,
  ChevronsRightIcon,
  HStack,
  Heading,
  Input,
  InputField,
  VStack,
} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useState} from 'react';

import {useAuth} from '../Contexts/AuthContext';

import {AppStackScreens} from '../types';

const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<AppStackScreens, 'Login'>) => {
  const [username, setUsername] = useState<string>();

  const {login} = useAuth();

  return (
    <Center h="100%" w="100%">
      <VStack>
        <Center>
          <Heading marginBottom={50}>Login</Heading>
        </Center>
        <Center>
          <HStack space="lg">
            <Input w="70%">
              <InputField placeholder="username" onChangeText={setUsername} />
            </Input>
            <Button
              isDisabled={username ? false : true}
              onPress={() => {
                login(username!.trim().toLowerCase()).then(loggedIn => {
                  if (loggedIn)
                    navigation.reset({index: 0, routes: [{name: 'Home'}]});
                });
              }}>
              <ButtonIcon as={ChevronsRightIcon} />
            </Button>
          </HStack>
        </Center>
      </VStack>
    </Center>
  );
};

export default LoginScreen;
