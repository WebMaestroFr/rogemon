import { NextFunction, Request, Response } from "express";
import _ from "lodash";

import { sendData } from "../../response";
import { assertUser } from "../../middlewares/verifyUser";

export default async function handleProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req.user, res);
    return sendData(res, 200, _.pick(req.user, ["_id", "email"]));
  } catch (err) {
    next(err);
  }
}
