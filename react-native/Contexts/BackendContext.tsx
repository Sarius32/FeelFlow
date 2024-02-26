import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import RNFS from 'react-native-fs';
import googleFit, {BucketUnit, Scopes} from 'react-native-google-fit';

import axios from 'axios';
import clone from 'just-clone';
import {MoodData, SleepData, StepData} from '../types';
import {useAuth} from './AuthContext';

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
  const [sleepSaved, setSleepSaved] = useState<boolean>(false);

  const [todaysSleepSaved, setTodaysSleepSaved] = useState<boolean>(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [stepData, setStepData] = useState<StepData[]>([]);

  const moodPath = RNFS.DocumentDirectoryPath + '/moodData.json';
  const sleepPath = RNFS.DocumentDirectoryPath + '/sleepData.json';

  const {getJWT} = useAuth();

  const apiBaseUrl = 'http://89.247.229.118:1900/api/v1';

  const getJWTHeader = () => {
    return {headers: {Authorization: 'Bearer ' + getJWT()}};
  };

  const loadGoogleFitData = () => {
    const authOptions = {
      scopes: [Scopes.FITNESS_ACTIVITY_READ],
    };

    const stepOptions = {
      startDate: new Date(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      endDate: new Date().toISOString(),
      bucketUnit: BucketUnit.DAY,
    };

    googleFit
      .authorize(authOptions)
      .then(authResult => {
        if (authResult.success) {
          googleFit
            .getDailyStepCountSamples(stepOptions)
            .then(res => {
              for (let ds of res) {
                if (ds.source == 'com.google.android.gms:merge_step_deltas') {
                  setStepData(ds.steps);
                  console.log(
                    'Successfully retrieved step data from Google Fit.',
                  );
                }
              }
            })
            .catch(err =>
              console.log('Error during Activity Sync with Google Fit.', err),
            );
        } else {
          console.log("Couldn't authorize with Google Fit.");
        }
      })
      .catch(err => console.log('Error during Auth for Google Fit.', err));
  };

  const loadMoodData = async () => {
    try {
      const jsonData = await RNFS.readFile(moodPath, 'utf8');
      const savedData: {date: string; values: object}[] = JSON.parse(jsonData);

      /* need to create Map from saved object */
      const parsedData: MoodData[] = savedData.map(i => {
        return {date: i.date, values: new Map(Object.entries(i.values))};
      });

      setMoodData(parsedData);
      console.log(`Successfully loaded mood data from ${moodPath}.`);
    } catch (e) {
      console.log(`Couldn't load mood data from ${moodPath}.`, e);
    }
  };

  const saveMood = async (mood: number) => {
    const [date, time] = new Date()
      .toISOString()
      .replace('Z', '')
      .split('T')
      .map(str => str.split('.')[0]);

    let updatedMoodData = clone(moodData);
    let todaysMood = updatedMoodData.find(i => i.date == date);
    if (todaysMood) {
      if (!todaysMood.values) todaysMood.values = new Map();
      todaysMood.values.set(time, mood);
    } else {
      updatedMoodData.push({date, values: new Map([[time, mood]])});
    }

    try {
      /* need to convert Map into object */
      const saveableData = updatedMoodData.map(i => {
        return {
          date: i.date,
          values: Object.fromEntries(i.values ?? new Map()),
        };
      });

      await RNFS.writeFile(moodPath, JSON.stringify(saveableData), 'utf8');
      setMoodData(updatedMoodData);
      console.log(`Successfully saved mood data to ${moodPath}.`);
    } catch (e) {
      console.log(`Couldn't save mood data to ${moodPath}.`, e);
    }
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
