import { NextFunction, Request, Response } from "express";

import Collection from "@api/models/collection";
import assertRequestUser from "@api/utilities/assertRequestUser";
import { sendData } from "@api/utilities/sendResponse";

export default async function upsertExpansionCount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res);
    const collection = await Collection.findOneAndUpdate(
      {
        userId: req.user._id,
        expansionId: req.params.expansionId,
      },
      { countMap: req.body },
      { new: true, upsert: true },
    );
    const collectionResult = await collection.save();
    return sendData(res, 201, collectionResult.countMap);
  } catch (err) {
    next(err);
  }
}
