const { configDotenv } = require("dotenv");
configDotenv();

const brain = require("brain.js");
const { MongoClient } = require("mongodb");

const connectToDB = async () => {
  const client = new MongoClient(process.env.MONGO_CONN);

  await client.connect();

  return client.db(process.env.MONGO_DB);
};

const predict = (data) => {
  const today = new Date();

  data = data.map((e) => {
    return {
      ...e,
      moods: e.moods.map((m) => {
        const [hours, minutes, seconds] = m.time
          .split(":")
          .map((t) => Number(t));
        today.setHours(hours);
        today.setMinutes(minutes);
        today.setSeconds(seconds);
        today.setMilliseconds(0);
        return { t: today.getTime(), value: m.value };
      }),
    };
  });

  const getAt = (moods, time) => {
    let [left, right] = [Infinity, Infinity];
    let leftMood, rightMood;
    for (let mood of moods) {
      let space = time - mood.t;

      if (space == 0) return mood.value;

      if (space > 0) {
        if (space < left) {
          leftMood = mood;
          left = space;
        }
      }
      if (space < 0) {
        if (-space < right) {
          rightMood = mood;
          right = -space;
        }
      }
    }
    if (leftMood && !rightMood) {
      return leftMood.value;
    }
    if (rightMood && !leftMood) {
      return rightMood.value;
    }

    const n = leftMood.value;
    const m = (rightMood.value - n) / (rightMood.t - leftMood.t);

    return m * (time - leftMood.t) + n;
  };

  today.setHours(10);
  today.setMinutes(0);
  today.setMinutes(0);
  const at10 = today.getTime();

  today.setHours(12);
  const at12 = today.getTime();

  today.setHours(14);
  const at14 = today.getTime();

  today.setHours(16);
  const at16 = today.getTime();

  data = data.map((e) => {
    return {
      ...e,
      mood10: getAt(e.moods, at10),
      mood12: getAt(e.moods, at12),
      mood14: getAt(e.moods, at14),
      mood16: getAt(e.moods, at16),
    };
  });

  const net = new brain.NeuralNetwork();

  // convert to 3 classes (one hot)
  const netInput = data.map((e, idx) => {
    let out = [0, 0, 0];
    out[data[idx]?.evaluation ?? 0] = 1;

    return {
      input: [e.sleep, e.steps, e.mood10, e.mood12, e.mood14, e.mood16],
      output: out,
    };
  });

  // last input -> today
  const last = netInput.pop();

  net.train(netInput, { iterations: 1000 }).error;

  const output = net.run(last.input);

  let max = 0;
  let argmax;
  for (let i = 0; i < 3; i++) {
    if (output[i] > max) {
      max = output[i];
      argmax = i;
    }
  }
  return argmax;
};

connectToDB().then((db) => {
  setInterval(async () => {
    console.log("> ===== ===== <");
    try {
      const nowDate = new Date().toISOString().split("T")[0];

      const collections = await db.listCollections().toArray();
      collections.forEach(async ({ name }) => {
        const collection = db.collection(name);
        const todaysEntry = await collection.findOne({ date: nowDate });

        if (
          todaysEntry &&
          todaysEntry.sleep != undefined &&
          todaysEntry.steps != undefined &&
          todaysEntry.moods != undefined &&
          todaysEntry.runBrain
        ) {
          const docs = await collection.find().toArray();

          const prediction = predict(docs);

          await collection.findOneAndUpdate(
            { date: nowDate },
            { $set: { brainPrediction: prediction, runBrain: false } }
          );

          console.log(`Predicted ${prediction} for ${name}.`);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, 5 * /*60 **/ 1000);
});
