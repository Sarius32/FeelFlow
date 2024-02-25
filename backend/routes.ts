import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import { createUser, saveSleep, sleepSaved, userAvailable } from "./storage";
import { UserRequest } from "./types";

const newUserRouter = (req: Request, res: Response) => {
  const username = req.body.username;

  if (!userAvailable(username)) createUser(username);

  const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  console.log(`Generated JWT for user: ${username}!`);

  res.status(201);
  res.json({ token });
};

const saveSleepRouter = (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const hours = req.body.hours;
  const date = req.body.date;

  if (!userAvailable(username)) return res.status(405);

  saveSleep(username, hours, date);

  res.status(200);
  res.send("Saved");
};

const sleepSavedRouter = (req: UserRequest, res: Response) => {
  const username = req.user.username;
  const date = req.param("date");
  console.log(date);

  if (!userAvailable(username)) return res.status(405);

  const saved = sleepSaved(username, date);

  res.status(200);
  res.json({ saved });
};

export { newUserRouter, saveSleepRouter, sleepSavedRouter };
