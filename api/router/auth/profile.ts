import { type NextFunction, type Request, type Response } from "express";

import { sendData } from "@api/utilities/sendResponse";
import assertRequestUser from "@api/utilities/assertRequestUser";

export default async function handleProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res);
    return sendData(res, 200, { _id: req.user._id, email: req.user.email });
  } catch (err) {
    next(err);
  }
}
