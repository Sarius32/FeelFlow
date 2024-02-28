import {PropsWithChildren, createContext, useContext} from 'react';
import googleFit, {Scopes} from 'react-native-google-fit';

import {dateToDateISOString} from '../utils';

type HealthProvider = {
  getGoogleFitSteps: (date: Date) => Promise<number | undefined>;
};

const HealthContext = createContext<HealthProvider>({} as HealthProvider);

export const HealthProvider = ({children}: PropsWithChildren<{}>) => {
  const getGoogleFitSteps = async (date: Date) => {
    const authOptions = {
      scopes: [Scopes.FITNESS_ACTIVITY_READ],
    };

    try {
      const authResult = await googleFit.authorize(authOptions);

      if (authResult.success) {
        const steps = await googleFit.getDailySteps(date);
        const result = steps
          .find(
            data => data.source == 'com.google.android.gms:merge_step_deltas',
          )!
          .steps.find(ds => ds.date == dateToDateISOString(date))!.value;

        console.log(
          `Retrieved steps form Google Fit for ${dateToDateISOString(
            date,
          )} (${result}).`,
        );
        return result;
      }

      return undefined;
    } catch (e) {
      return undefined;
    }
  };

  return (
    <HealthContext.Provider value={{getGoogleFitSteps}}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
