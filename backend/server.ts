import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { UserRequest } from "./types";

import { connectToDB } from "./mongoService";
import {
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
} from "./routes";

function authenticateToken(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      console.log("Error during verification of JWT", err);
      return res.sendStatus(403);
    }

    req.user = user;

    next();
  });
}

connectToDB().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const apiBaseRoute = `/api/${process.env.API_VERSION}`;

  app.post(apiBaseRoute + "/newUser", createNewUser);

  app.post(apiBaseRoute + "/sleep", authenticateToken, uploadSleep);
  app.get(apiBaseRoute + "/sleep", authenticateToken, retrieveSleep);

  app.post(apiBaseRoute + "/steps", authenticateToken, uploadSteps);
  app.get(apiBaseRoute + "/steps", authenticateToken, retrieveSteps);

  app.post(apiBaseRoute + "/mood", authenticateToken, uploadMood);
  app.get(apiBaseRoute + "/moods", authenticateToken, retrieveMoods);

  app.post(apiBaseRoute + "/evaluation", authenticateToken, uploadEvaluation);
  app.get(apiBaseRoute + "/evaluation", authenticateToken, retrieveEvaluation);

  app.get(apiBaseRoute + "/prediction", authenticateToken, retrievePrediction);

  app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}`);
  });
});
