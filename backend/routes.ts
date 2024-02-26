import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  loadEvaluation,
  loadMoods,
  loadPredication,
  loadSleep,
  loadSteps,
  saveEvaluation,
  saveMood,
  saveSleep,
  saveSteps,
} from "./mongoService";
import { UserRequest } from "./types";

const createNewUser = (req: Request, res: Response) => {
  const username = req.body.username;

  const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  console.log(`Generated JWT for user: ${username}!`);

  res.status(201);
  res.json({ username, token });
};

const uploadSleep = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.body.date;
  const sleep = req.body.sleep;

  const response = { uploaded: false, date: undefined, sleep: undefined };

  const success = await saveSleep(username, date, sleep);
  if (success) {
    console.log(`Uploaded sleep (${username}, ${date}, ${sleep}).`);

    response.uploaded = true;
    response.date = date;
    response.sleep = sleep;
  }

  res.status(200);
  res.json(response);
};

const retrieveSleep = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.query.date;

  const response = { avail: false, date: undefined, sleep: undefined };

  const data = await loadSleep(username, date as string);
  if (data && data.sleep) {
    console.log(`Retrieved sleep (${username}, ${date}).`);

    response.avail = true;
    response.date = data.date;
    response.sleep = data.sleep;
  }

  res.status(200);
  res.json(response);
};

const uploadSteps = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.body.date;
  const steps = req.body.steps;

  const response = { uploaded: false, date: undefined, steps: undefined };

  const success = await saveSteps(username, date, steps);
  if (success) {
    console.log(`Uploaded steps (${username}, ${date}, ${steps}).`);

    response.uploaded = true;
    response.date = date;
    response.steps = steps;
  }

  res.status(200);
  res.json(response);
};

const retrieveSteps = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.query.date;

  const response = { avail: false, date: undefined, steps: undefined };

  const data = await loadSteps(username, date as string);
  if (data && data.steps) {
    console.log(`Retrieved steps (${username}, ${date}).`);

    response.avail = true;
    response.date = data.date;
    response.steps = data.steps;
  }

  res.status(200);
  res.json(response);
};

const uploadMood = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.body.date;
  const time = req.body.time;
  const mood = req.body.mood;

  const response = {
    uploaded: false,
    date: undefined,
    time: undefined,
    mood: undefined,
  };

  const success = await saveMood(username, date, time, mood);
  if (success) {
    console.log(`Uploaded mood (${username}, ${date}, ${time}, ${mood}).`);

    response.uploaded = true;
    response.date = date;
    response.time = time;
    response.mood = mood;
  }

  res.status(200);
  res.json(response);
};

const retrieveMoods = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.query.date;

  const response = { avail: false, date: undefined, moods: undefined };

  const data = await loadMoods(username, date as string);
  if (data && data.moods) {
    console.log(`Retrieved moods (${username}, ${date}).`);

    response.avail = true;
    response.date = data.date;
    response.moods = data.moods;
  }

  res.status(200);
  res.json(response);
};

const uploadEvaluation = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.body.date;
  const evaluation = req.body.evaluation;

  const response = { uploaded: false, date: undefined, evaluation: undefined };

  const success = await saveEvaluation(username, date, evaluation);
  if (success) {
    console.log(`Uploaded evaluation (${username}, ${date}, ${evaluation}).`);

    response.uploaded = true;
    response.date = date;
    response.evaluation = evaluation;
  }

  res.status(200);
  res.json(response);
};

const retrieveEvaluation = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.query.date;

  const response = { avail: false, date: undefined, evaluation: undefined };

  const data = await loadEvaluation(username, date as string);
  if (data && data.evaluation) {
    console.log(`Retrieved evaluation (${username}, ${date}).`);

    response.avail = true;
    response.date = data.date;
    response.evaluation = data.evaluation;
  }

  res.status(200);
  res.json(response);
};

const retrievePrediction = async (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.query.date;

  const response = { avail: false, date: undefined, prediction: undefined };

  const data = await loadPredication(username, date as string);
  if (data && data.prediction) {
    console.log(`Retrieved prediction (${username}, ${date}).`);

    response.avail = true;
    response.date = data.date;
    response.prediction = data.prediction;
  }

  res.status(200);
  res.json(response);
};

export {
  createNewUser,
  retrieveEvaluation,
  retrieveMoods,
  retrievePrediction,
  retrieveSleep,
  retrieveSteps,
  uploadEvaluation,
  uploadMood,
  uploadSleep,
  uploadSteps,
};
