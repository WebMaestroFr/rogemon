import { NextFunction, Request, Response } from "express";
import { Collection } from "../../database";
import { sendData, sendError } from "../../response";
import { assertUser } from "../../middlewares/verifyUser";

export default async function getByExpansionId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req);
    const collection = await Collection.findOne({
      userId: req.user._id,
      expansionId: req.params.expansionId,
    });
    if (!collection) {
      return sendError(res, 404, "Collection not found");
    }
    return sendData(res, 200, collection.countMap);
  } catch (err) {
    next(err);
  }
}
