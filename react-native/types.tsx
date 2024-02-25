export type AppStackScreens = {
  Login: undefined;
  Home: undefined;
};

export type HomeStackScreens = {
  Overview: undefined;
  MoodTrack: undefined;
};

export type MoodData = {
  date: string;
  values: Map<string, number> | null;
};

export type SleepData = {
  date: string;
  value: number;
};

export type StepData = {
  date: string;
  value: number;
};

export type AppData = {
  steps?: StepData[];
  mood?: MoodData[];
};
