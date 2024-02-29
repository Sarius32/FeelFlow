import axios from 'axios';
import {PropsWithChildren, createContext, useContext, useState} from 'react';

type AuthProvider = {
  login: (name: string) => Promise<boolean>;
  getJWT: () => string;
};

const AuthContext = createContext<AuthProvider>({} as AuthProvider);

export const AuthProvider = ({children}: PropsWithChildren<{}>) => {
  const [username, setUsername] = useState<string>();
  const [jwtToken, setJwtToken] = useState<string>();

  const apiBaseUrl = 'http://10.181.65.210:3000/api/v1';

  const login = async (name: string) => {
    return await axios
      .post(apiBaseUrl + '/newUser', {username: name})
      .then(res => {
        setUsername(res.data.username);
        setJwtToken(res.data.token);
        console.log(`User ${name} logged in.`);
        return true;
      })
      .catch(err => {
        console.log('Error occured during login.', err);
        return false;
      });
  };

  const getJWT = () => {
    return jwtToken!;
  };

  return (
    <AuthContext.Provider value={{login, getJWT}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
