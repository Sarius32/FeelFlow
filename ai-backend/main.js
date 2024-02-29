let data = require("./sample.json");
const brain = require("brain.js");

const today = new Date();

data = data.map((e) => {
  return {
    ...e,
    moods: e.moods.map((m) => {
      const [hours, minutes, seconds] = m.time.split(":").map((t) => Number(t));
      today.setHours(hours);
      today.setMinutes(minutes);
      today.setSeconds(seconds);
      today.setMilliseconds(0);
      return { t: today.getTime(), value: m.value };
    }),
  };
});

/*data = data.map((e) => {
  const first = e.moods.reduce(
    (s, c) => Math.min(s, c.timestamp),
    e.moods[0].timestamp
  );
  return {
    ...e,
    moods: e.moods.map((m) => {
      return { t: m.timestamp - first, value: m.value };
    }),
  };
});*/

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

console.log(at12, at14, at16);
data = data.map((e) => {
  return {
    ...e,
    mood10: getAt(e.moods, at10),
    mood12: getAt(e.moods, at12),
    mood14: getAt(e.moods, at14),
    mood16: getAt(e.moods, at16),
  };
});

console.log(data[0]);

/*data = data.map((e) => {
  return {
    ...e,
    moods: e.moods.reduce((s, a) => s + a.value, 0) / e.moods.length,
  };
});*/

const net = new brain.NeuralNetwork();

const netInput = data.map((e, idx) => {
  let out = [0, 0, 0];
  out[data[idx]?.evaluation ?? 0] = 1;
  // out = [data[idx]?.evaluation];

  return {
    input: [e.sleep, e.steps, e.mood10, e.mood12, e.mood14, e.mood16], //, e.evaluation],
    output: out,
  };
});
const last = netInput.pop();
console.log(netInput);

console.log(
  net.train(netInput, { iterations: 1000, log: true, logPeriod: 50 })
);

const output = net.run(last.input);
console.log(last.output, output);

document.getElementById("result").innerHTML = brain.utilities.toSVG(net);
