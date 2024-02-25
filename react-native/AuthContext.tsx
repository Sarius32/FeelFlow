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

  const login = async (name: string) => {
    return await axios
      .post(`${process.env.API_ENDPOINT}/createNewUser`, {username: name})
      .then(res => {
        setUsername(name);
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
