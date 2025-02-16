import { NextFunction, Request, Response } from "express";
import _ from "lodash";

import { sendData, sendError } from "../../response";

export default async function handleProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.user) {
      return sendData(res, 200, _.pick(req.user, ["_id", "email"]));
    }
    return sendError(res, 401, "User is not authenticated");
  } catch (err) {
    next(err);
  }
}
