import { Request } from "express";

export interface UserRequest extends Request {
  user: {
    username: string;
    iat: string;
    exp: string;
  };
}
