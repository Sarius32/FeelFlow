import axios from 'axios';
import {PropsWithChildren, createContext, useContext, useEffect} from 'react';

import {useAuth} from './AuthContext';
import {useHealth} from './HealthContext';

type SleepUpload = {
  loggedIn: boolean;
  uploaded?: boolean;
  date?: string;
  sleep?: number;
};
type SleepRetrieval = {
  loggedIn: boolean;
  avail?: boolean;
  date?: string;
  sleep?: number;
};

type StepUpload = {
  loggedIn: boolean;
  uploaded?: boolean;
  date?: string;
  steps?: number;
};
type StepRetrieval = {
  loggedIn: boolean;
  avail?: boolean;
  date?: string;
  steps?: number;
};

type SingleMoodUpload = {
  loggedIn: boolean;
  uploaded?: boolean;
  date?: string;
  time?: string;
  mood?: number;
};
type MultiMoodRetrieval = {
  loggedIn: boolean;
  avail?: boolean;
  date?: string;
  moods?: {
    time: string;
    value: number;
  }[];
};

type EvaluationUpload = {
  loggedIn: boolean;
  uploaded?: boolean;
  date?: string;
  evaluation?: number;
};
type EvaluationRetrieval = {
  loggedIn: boolean;
  avail?: boolean;
  date?: string;
  evaluation?: number;
};

type PredictionRetrieval = {
  loggedIn: boolean;
  avail?: boolean;
  date?: string;
  prediction?: number;
};

type BackendProviderProps = {
  uploadSleep: (date: string, hours: number) => Promise<SleepUpload>;
  retrieveSleep: (date: string) => Promise<SleepRetrieval>;
  uploadSteps: (date: string, amount: number) => Promise<StepUpload>;
  retrieveSteps: (date: string) => Promise<StepRetrieval>;
  uploadMood: (
    date: string,
    time: string,
    value: number,
  ) => Promise<SingleMoodUpload>;
  retrieveMoods: (date: string) => Promise<MultiMoodRetrieval>;
  uploadEvaluation: (date: string, value: number) => Promise<EvaluationUpload>;
  retrieveEvaluation: (date: string) => Promise<EvaluationRetrieval>;
  retrievePrediction: (date: string) => Promise<PredictionRetrieval>;
};

const BackendContext = createContext<BackendProviderProps>(
  {} as BackendProviderProps,
);

export const BackendProvider = ({children}: PropsWithChildren<{}>) => {
  const {getJWT} = useAuth();
  const {getGoogleFitSteps} = useHealth();

  const apiBaseUrl = 'http://89.247.230.249:1900/api/v1';

  const getJWTHeader = () => {
    return {headers: {Authorization: 'Bearer ' + getJWT()}};
  };

  const uploadSleep = async (date: string, hours: number) => {
    return await axios
      .post(apiBaseUrl + '/sleep', {date, sleep: hours}, getJWTHeader())
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {uploaded: boolean; date?: string; sleep?: number}),
        };
      })
      .catch(err => {
        console.log(`Error during sleep upload (${date}, ${hours}).`, err);
        return {loggedIn: false};
      });
  };

  const retrieveSleep = async (date: string) => {
    return await axios
      .get(apiBaseUrl + '/sleep', {
        params: {date},
        ...getJWTHeader(),
      })
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            avail: boolean;
            date?: string;
            sleep?: number;
          }),
        };
      })
      .catch(err => {
        console.log(`Error during sleep retrieval (${date}).`, err);
        return {loggedIn: false};
      });
  };

  const uploadSteps = async (date: string, amount: number) => {
    return await axios
      .post(apiBaseUrl + '/steps', {date, steps: amount}, getJWTHeader())
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {uploaded: boolean; date?: string; steps?: number}),
        };
      })
      .catch(err => {
        console.log(`Error during steps upload (${date}, ${amount}).`, err);
        return {loggedIn: false};
      });
  };

  const retrieveSteps = async (date: string) => {
    return await axios
      .get(apiBaseUrl + '/steps', {
        params: {date},
        ...getJWTHeader(),
      })
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            avail: boolean;
            date?: string;
            steps?: number;
          }),
        };
      })
      .catch(err => {
        console.log(`Error during steps retrieval (${date}).`, err);
        return {loggedIn: false};
      });
  };

  const uploadMood = async (date: string, time: string, value: number) => {
    return await axios
      .post(apiBaseUrl + '/mood', {date, time, mood: value}, getJWTHeader())
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            uploaded: boolean;
            date?: string;
            time?: string;
            mood?: number;
          }),
        };
      })
      .catch(err => {
        console.log(
          `Error during mood upload (${date}, ${time}, ${value}).`,
          err,
        );
        return {loggedIn: false};
      });
  };

  const retrieveMoods = async (date: string) => {
    return await axios
      .get(apiBaseUrl + '/moods', {
        params: {date},
        ...getJWTHeader(),
      })
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            avail: boolean;
            date?: string;
            moods?: {time: string; value: number}[];
          }),
        };
      })
      .catch(err => {
        console.log(`Error during moods retrieval (${date}).`, err);
        return {loggedIn: false};
      });
  };

  const uploadEvaluation = async (date: string, value: number) => {
    return await axios
      .post(
        apiBaseUrl + '/evaluation',
        {date, evaluation: value},
        getJWTHeader(),
      )
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            uploaded: boolean;
            date?: string;
            evaluation?: number;
          }),
        };
      })
      .catch(err => {
        console.log(`Error during evaluation upload (${date}, ${value}).`, err);
        return {loggedIn: false};
      });
  };

  const retrieveEvaluation = async (date: string) => {
    return await axios
      .get(apiBaseUrl + '/evaluation', {
        params: {date},
        ...getJWTHeader(),
      })
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            avail: boolean;
            date?: string;
            evaluation?: number;
          }),
        };
      })
      .catch(err => {
        console.log(`Error during evaluation retrieval (${date}).`, err);
        return {loggedIn: false};
      });
  };

  const retrievePrediction = async (date: string) => {
    return await axios
      .get(apiBaseUrl + '/prediction', {
        params: {date},
        ...getJWTHeader(),
      })
      .then(res => {
        return {
          loggedIn: true,
          ...(res.data as {
            avail: boolean;
            date?: string;
            prediction?: number;
          }),
        };
      })
      .catch(err => {
        console.log(`Error during prediction retrieval (${date}).`, err);
        return {loggedIn: false};
      });
  };

  useEffect(() => {}, []);

  return (
    <BackendContext.Provider
      value={{
        uploadSleep,
        retrieveSleep,
        uploadSteps,
        retrieveSteps,
        uploadMood,
        retrieveMoods,
        uploadEvaluation,
        retrieveEvaluation,
        retrievePrediction,
      }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useAppData = () => useContext(BackendContext);
