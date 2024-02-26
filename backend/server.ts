import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { newUserRouter, saveSleepRouter, sleepSavedRouter, saveSleepEvaluation4YesterdayRouter, saveMoodRouter} from "./routes";
import { UserRequest } from "./types";

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

const app = express();
app.use(cors());
app.use(express.json());

app.post(`/api/${process.env.API_VERSION}/createNewUser`, newUserRouter);
app.post(
  `/api/${process.env.API_VERSION}/saveSleep`,
  authenticateToken,
  saveSleepRouter
);
app.post(
  `/api/${process.env.API_VERSION}/saveSleepEvaluation4Yesterday`,
  authenticateToken,
  saveSleepEvaluation4YesterdayRouter
);
app.post(
  `/api/${process.env.API_VERSION}/saveMood`,
  authenticateToken,
  saveMoodRouter
);
app.get(
  `/api/${process.env.API_VERSION}/sleepSaved`,
  authenticateToken,
  sleepSavedRouter
);

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.get(
  `/api/${process.env.API_VERSION}/getStuff`,
  authenticateToken,
  saveSleepRouter
);

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
