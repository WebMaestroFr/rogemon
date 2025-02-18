import { NextFunction, Request, Response } from "express";
import { assertUser } from "../../middlewares/verifyUser";
import { Collection } from "../../database";
import { sendData } from "../../response";

export default async function upsertExpansionCount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req.user, res);
    const collection = await Collection.findOneAndUpdate(
      {
        userId: req.user._id,
        expansionId: req.params.expansionId,
      },
      { countMap: req.body },
      { new: true, upsert: true }
    );
    const collectionResult = await collection.save();
    return sendData(res, 201, collectionResult.countMap);
  } catch (err) {
    next(err);
  }
}
