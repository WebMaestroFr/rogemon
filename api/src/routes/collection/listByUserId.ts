import { NextFunction, Request, Response } from "express";
import { Collection } from "../../database";
import { sendData } from "../../response";
import { assertUser } from "../../middlewares/verifyUser";

export default async function listByUserId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req, res);
    const collections = await Collection.find({ userId: req.user._id });
    return sendData(res, 200, collections);
  } catch (err) {
    next(err);
  }
}
