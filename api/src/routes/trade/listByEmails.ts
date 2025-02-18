import { NextFunction, Request, Response } from "express";
import { Collection, User } from "../../database";
import { sendData } from "../../response";
import { assertUser } from "../../middlewares/verifyUser";

import { assertBody } from "../../middlewares/validateRequestBody";
import { getTrade } from ".";

export default async function listByEmails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req.user, res);
    assertBody<{ emails: string[] }>(req.body, res, {
      emails: { required: true, email: true, array: true },
    });

    const userId = req.user._id;
    const userEmail = req.user.email;
    const otherEmails = req.body.emails.filter((email) => email !== userEmail);

    const otherUsers = await User.find({ email: { $in: otherEmails } });
    const otherIds = otherUsers.map((user) => user._id);

    const collections = await Collection.find({
      userId: { $in: [userId, ...otherIds] },
    });
    const userCollections = collections.filter((collection) =>
      collection.userId.equals(userId)
    );
    const otherUserCollections = collections.filter(
      (collection) => !collection.userId.equals(userId)
    );

    const expansionIds = new Set<string>(
      collections.map((collection) => collection.expansionId)
    );

    const trades = [];
    for (const expansionId of expansionIds) {
      const userExpansionCollection = userCollections.find(
        (collection) => collection.expansionId === expansionId
      );
      if (!userExpansionCollection) {
        console.warn("No user collection for expansion", expansionId);
        continue;
      }
      const otherUserExpansionCollections = otherUserCollections.filter(
        (collection) => collection.expansionId === expansionId
      );
      if (otherUserExpansionCollections.length === 0) {
        console.warn("No other user collections for expansion", expansionId);
        continue;
      }

      const expansionCollectionsCardIds = collections
        .filter((collection) => collection.expansionId === expansionId)
        .map((collection) => collection.countMap.keys());
      const expansionCardIds = new Set<string>(
        expansionCollectionsCardIds.flatMap((collectionCardIds) =>
          Array.from(collectionCardIds)
        )
      );

      for (const otherUserExpansionCollection of otherUserExpansionCollections) {
        for (const cardId of expansionCardIds) {
          const trade = getTrade(
            cardId,
            userExpansionCollection,
            otherUserExpansionCollection
          );
          trades.push(trade);
        }
      }
    }

    const sortedTrades = trades.sort((a, b) => b.priority - a.priority);

    return sendData(res, 200, sortedTrades);
  } catch (err) {
    next(err);
  }
}
