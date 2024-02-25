import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import RNFS from 'react-native-fs';
import googleFit, {BucketUnit, Scopes} from 'react-native-google-fit';

import axios, {isAxiosError} from 'axios';
import clone from 'just-clone';
import {useAuth} from './AuthContext';
import {MoodData, SleepData, StepData} from './types';

type DataProvider = {
  saveMood: (mood: number) => void;
  moodData: MoodData[];
  saveSleepHours: (
    hours: number,
  ) => Promise<{saved: boolean; loggedIn?: boolean}>;
  sleepHoursSavedForToday: () => Promise<boolean>;
  todaysSleepSaved: boolean;
};

const DataContext = createContext<DataProvider>({} as DataProvider);

export const DataProvider = ({children}: PropsWithChildren<{}>) => {
  const [sleepSaved, setSleepSaved] = useState<boolean>(false);

  const [todaysSleepSaved, setTodaysSleepSaved] = useState<boolean>(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [stepData, setStepData] = useState<StepData[]>([]);

  const moodPath = RNFS.DocumentDirectoryPath + '/moodData.json';
  const sleepPath = RNFS.DocumentDirectoryPath + '/sleepData.json';

  const {login, getJWT} = useAuth();

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

  const loadSleepData = async () => {
    try {
      const jsonData = await RNFS.readFile(sleepPath, 'utf8');
      const parsedData: SleepData[] = JSON.parse(jsonData);

      setSleepData(parsedData);
      console.log(`Successfully loaded sleep data from ${sleepPath}.`);

      for (let entry of parsedData) {
        if (entry.date == new Date().toISOString().split('T')[0]) {
          setTodaysSleepSaved(true);
        }
      }
    } catch (e) {
      console.log(`Couldn't load sleep data from ${sleepPath}.`, e);
    }
  };

  /*const saveSleepHours = async (hours: number) => {
    const date = new Date().toISOString().split('T')[0];
    sleepData.push({date, value: hours});

    try {
      await RNFS.writeFile(sleepPath, JSON.stringify(sleepData), 'utf8');
      setSleepData(sleepData);
      console.log(`Successfully saved sleep data to ${sleepPath}.`);
      setTodaysSleepSaved(true);
    } catch (e) {
      console.log(`Couldn't save sleep data to ${sleepPath}.`, e);
    }
  };*/

  const saveSleepHours = async (hours: number) => {
    return await axios
      .post(
        `${process.env.API_ENDPOINT}/saveSleep`,
        {hours, date: new Date().toISOString().split('T')[0]},
        {headers: {Authorization: 'Bearer ' + getJWT()}},
      )
      .then(res => {
        setSleepSaved(true);
        console.log(`Sleep saved.`);
        return {saved: true};
      })
      .catch(err => {
        console.log('Error occured during sleep saving.', err);
        if (isAxiosError(err)) {
          if (err.response?.status == 401 || err.response?.status == 403)
            return {saved: false, loggedIn: false};
        }
        return {saved: false, loggedIn: true};
      });
  };

  const sleepHoursSavedForToday = async () => {
    console.log(getJWT());
    return await axios
      .get(`${process.env.API_ENDPOINT}/sleepSaved`, {
        params: {date: new Date().toISOString().split('T')[0]},
        headers: {Authorization: 'Bearer ' + getJWT()},
      })
      .then(res => {
        setSleepSaved(res.data.saved);
        console.log(
          `Sleep was ${res.data.saved ? 'already' : 'not'} saved for today.`,
        );
        return res.data.saved as boolean;
      })
      .catch(err => {
        setSleepSaved(false);

        console.log('Error during retrival of saved sleep.', err);
        return false;
      });
  };

  useEffect(() => {
    loadMoodData();
    loadSleepData();
    loadGoogleFitData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        saveMood,
        moodData,
        saveSleepHours,
        todaysSleepSaved,
        sleepHoursSavedForToday,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useAppData = () => useContext(DataContext);
