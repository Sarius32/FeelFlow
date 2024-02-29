import { Db, MongoClient, WithId } from "mongodb";

let db: Db;

const connectToDB = async () => {
  const client = new MongoClient(process.env.MONGO_CONN);

  await client.connect();

  db = client.db(process.env.MONGO_DB);
};

const getUserCollection = (name: string) => {
  return db.collection(name);
};

const triggerNetworks = async (name: string) => {
  const date = new Date().toISOString().split("T")[0];
  return await getUserCollection(name)
    .findOneAndUpdate(
      { date },
      { $set: { date } },
      { upsert: true, returnDocument: "after" }
    )
    .then(async (val) => {
      if (
        val?.sleep != undefined &&
        val?.steps != undefined &&
        val?.moods != undefined
      ) {
        await getUserCollection(name).findOneAndUpdate(
          { date },
          { $set: { runBrain: true, runTensor: true } },
          { upsert: true, returnDocument: "after" }
        );
      }
    })
    .catch(() => {});
};

const saveSleep = async (name: string, date: string, sleep: number) => {
  return await getUserCollection(name)
    .findOneAndUpdate(
      { date },
      { $set: { sleep } },
      { upsert: true, returnDocument: "after" }
    )
    .then(() => true)
    .catch(() => false);
};

const loadSleep = async (name: string, date: string) => {
  return await getUserCollection(name)
    .findOne({ date })
    .then((val) => val as WithId<{ date: string; sleep?: number }>)
    .catch(() => {});
};

const saveSteps = async (name: string, date: string, steps: number) => {
  return await getUserCollection(name)
    .findOneAndUpdate(
      { date },
      { $set: { steps } },
      { upsert: true, returnDocument: "after" }
    )
    .then(() => true)
    .catch(() => false);
};

const loadSteps = async (name: string, date: string) => {
  return await getUserCollection(name)
    .findOne({ date })
    .then((val) => val as WithId<{ date: string; steps?: number }>)
    .catch(() => {});
};

const saveMood = async (
  name: string,
  date: string,
  time: string,
  mood: number
) => {
  const moods = await getUserCollection(name)
    .findOne({ date })
    .then((val) => val.moods ?? [])
    .catch(() => []);

  moods.push({ time, value: mood });

  return await getUserCollection(name)
    .findOneAndUpdate(
      { date },
      { $set: { moods } },
      { upsert: true, returnDocument: "after" }
    )
    .then(() => true)
    .catch(() => false);
};

const loadMoods = async (name: string, date: string) => {
  return await getUserCollection(name)
    .findOne({ date })
    .then(
      (val) =>
        val as WithId<{
          date: string;
          moods?: { time: string; value: number }[];
        }>
    )
    .catch(() => {});
};

const saveEvaluation = async (
  name: string,
  date: string,
  evaluation: number
) => {
  return await getUserCollection(name)
    .findOneAndUpdate(
      { date },
      { $set: { evaluation } },
      { upsert: true, returnDocument: "after" }
    )
    .then(() => true)
    .catch(() => false);
};

const loadEvaluation = async (name: string, date: string) => {
  return await getUserCollection(name)
    .findOne({ date })
    .then(
      (val) =>
        val as WithId<{
          date: string;
          evaluation?: number;
        }>
    )
    .catch(() => {});
};

const loadPredication = async (name: string, date: string) => {
  return await getUserCollection(name)
    .findOne({ date })
    .then(
      (val) =>
        val as WithId<{
          date: string;
          brainPrediction?: number;
          tensorPrediction?: number;
        }>
    )
    .catch(() => {});
};

export {
  connectToDB,
  loadEvaluation,
  loadMoods,
  loadPredication,
  loadSleep,
  loadSteps,
  saveEvaluation,
  saveMood,
  saveSleep,
  saveSteps,
  triggerNetworks,
};
