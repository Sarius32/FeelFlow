import { info } from "console";
import * as fs from 'fs';

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

const filePath = 'data.json';

const data: dataType[] = [];

const userAvailable = (name: string) => {
  return data.some((e) => e.username == name);
};

const createUser = (name: string) => {
  data.push({ username: name, info: [] });
  console.log("user added " + name);
};

const saveSleep = (name: string, hours: number, date: string) => {
  const loadedData = readDataFromJsonFile(filePath);

  if (loadedData) {
    const hasRecord = loadedData.some(entry => entry.username === name);
    
    if(hasRecord) {
      const userdata = loadedData.find((e) => e.username == name)
      if (!userdata.info.some((e) => e.date == date)) {
        userdata.info.push({ date, sleep: hours});
      } else {
        userdata.info.find((e) => e.date == date).eval = hours;
      }
      writeDataToJsonFile(loadedData, filePath);
    } else {
      const newData: dataType = {
        username: name,
        info: [
          {
            date: date,
            sleep: hours
          },
        ],
      };
      loadedData.push(newData);
      writeDataToJsonFile(loadedData, filePath);
    }
  } else {
    const newData: dataType = {
      username: name,
      info: [
        {
          date: date,
          sleep: hours
        },
      ],
    };
    loadedData.push(newData);
    writeDataToJsonFile(loadedData, filePath);
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

const saveSleepEvaluation4Yesterday = (name: string, score: number, date: string) => {
  const loadedData = readDataFromJsonFile(filePath);

if (loadedData) {
  const hasRecord = loadedData.some(entry => entry.username === name);
  
  if(hasRecord) {
    const userdata = loadedData.find((e) => e.username == name)
    if (!userdata.info.some((e) => e.date == date)) {
      userdata.info.push({ date, eval: score});
    } else {
      userdata.info.find((e) => e.date == date).eval = score;
    }
    writeDataToJsonFile(loadedData, filePath);
  } else {
    const newData: dataType = {
      username: name,
      info: [
        {
          date: date,
          eval: score
        },
      ],
    };
    loadedData.push(newData);
    writeDataToJsonFile(loadedData, filePath);
  }
} else {
  const newData: dataType = {
    username: name,
    info: [
      {
        date: date,
        eval: score
      },
    ],
  };
  loadedData.push(newData);
  writeDataToJsonFile(loadedData, filePath);
}

  console.log(`Sleep (${eval}, ${date}) saved for user ${name}!`);
};

const saveMood = (name: string, score: number, time: string, date: string) => {
  const mood = {
    time: time,
    value: score
  }

const loadedData = readDataFromJsonFile(filePath);

if (loadedData) {
  const hasRecord = loadedData.some(entry => entry.username === name);
  
  if(hasRecord) {
    const userData = loadedData.find((e) => e.username == name)

    console.log("111111111111111 ======== ", userData.info)
  
    if (!userData.info.some((e) => e.date == date)) {
      userData.info.push({date: date});
      console.log("看看存了没 ======== ", userData.info)
    
      const targetEntry = userData.info.find((entry) => entry.date === date);
  
      console.log("before update1 ======== ", userData.info)
      if (targetEntry) {
        targetEntry.moods = [...(targetEntry.moods || []), mood];
      } else {
        userData.info.push({
          date: date,
          moods: [mood],
        });
      }
      writeDataToJsonFile(loadedData, filePath);
    } else {
      if (!userData.info.some((e) => e.moods)) {
        const targetEntry = userData.info.find((entry) => entry.date === date);
        console.log("before update2 ======== ", userData.info[date].moods)
        if (targetEntry) {
          targetEntry.moods = [...(targetEntry.moods || []), mood];
        } else {
          userData.info.push({
            date: date,
            moods: [mood],
          });
        }
        console.log("after update2 ======== ", userData.info)
      } else {
        // userData.info.find((e) => e.date == date).moods.push(mood);
        // console.log("after update3 ======== ", userData.info)
        const targetEntry = userData.info.find((entry) => entry.date === date);

        if (targetEntry) {
          targetEntry.moods = [...(targetEntry.moods || []), mood];
        } else {
          userData.info.push({
            date: date,
            moods: [mood],
          });
        }
      }
      writeDataToJsonFile(loadedData, filePath);
    }
  } else {
    const newData: dataType = {
      username: name,
      info: [
        {
          date: date,
          moods: [mood]
        },
      ],
    };
  
    loadedData.push(newData);
    writeDataToJsonFile(loadedData, filePath);
  }
} else {
  const newData: dataType = {
    username: name,
    info: [
      {
        date: date,
        moods: [mood]
      },
    ],
  };

  loadedData.push(newData);
  writeDataToJsonFile(loadedData, filePath);
}
//TODO
  console.log(`Sleep (${eval}, ${date}) saved for user ${name}!`);
};

function writeDataToJsonFile(data: dataType[], filePath: string): void {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, jsonData, 'utf-8');

  console.log('Data written to file:', filePath);
}

function readDataFromJsonFile(filePath: string): dataType[] {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading data from file:', filePath);
    return [];
  }
}

export { createUser, saveSleep, sleepSaved, userAvailable, saveSleepEvaluation4Yesterday, saveMood };
