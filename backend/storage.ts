type dataType = {
  username: string;
  info: {
    date: string;

    eval?: number;

    sleep?: number;
    steps?: number;
    moods?: {
      time: string;
      value: number;
    }[];
  }[];
};

const data: dataType[] = [];

const userAvailable = (name: string) => {
  return data.some((e) => e.username == name);
};

const createUser = (name: string) => {
  data.push({ username: name, info: [] });
  console.log("user added " + name);
};

const saveSleep = (name: string, hours: number, date: string) => {
  const userData = data.find((e) => e.username == name)!;

  if (!userData.info.some((e) => e.date == date)) {
    userData.info.push({ date, sleep: hours });
  } else {
    userData.info.find((e) => e.date == date).sleep = hours;
  }

  console.log(`Sleep (${hours}, ${date}) saved for user ${name}!`);
};

const sleepSaved = (name: string, date: string) => {
  const userData = data.find((e) => e.username == name);
  console.log(userData);

  console.log(
    userData.info.find((e) => e.date == date)?.sleep,
    userData.info.find((e) => e.date == date)?.sleep != undefined
  );

  return userData.info.find((e) => e.date == date)?.sleep != undefined;
};

export { createUser, saveSleep, sleepSaved, userAvailable };
