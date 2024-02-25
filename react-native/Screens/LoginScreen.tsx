import {
  Button,
  ButtonIcon,
  Center,
  ChevronsRightIcon,
  HStack,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useState} from 'react';

import {useAuth} from '../AuthContext';
import {AppStackScreens} from '../types';

const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<AppStackScreens, 'Login'>) => {
  const [username, setUsername] = useState<string>();

  const {login} = useAuth();

  return (
    <Center h="100%" w="100%">
      <HStack space="lg">
        <Input w="70%">
          <InputField placeholder="username" onChangeText={setUsername} />
        </Input>
        <Button
          isDisabled={username ? false : true}
          onPress={() => {
            login(username!).then(loggedIn => {
              if (loggedIn)
                navigation.reset({index: 0, routes: [{name: 'Home'}]});
            });
          }}>
          <ButtonIcon as={ChevronsRightIcon} />
        </Button>
      </HStack>
    </Center>
  );
};

export default LoginScreen;
