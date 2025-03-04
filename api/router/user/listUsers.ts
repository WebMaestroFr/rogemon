import { type NextFunction, type Request, type Response } from "express";

import User from "@api/models/user";
import { sendData } from "@api/utilities/sendResponse";

export default async function (
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await User.find();
    return sendData(res, 200, users);
  } catch (err) {
    next(err);
  }
}
