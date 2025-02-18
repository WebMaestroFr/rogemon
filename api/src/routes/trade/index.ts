import { NextFunction, Request, Response } from "express";
import { Collection, ICollection, User } from "../../database";
import { sendData } from "../../response";
import { assertUser } from "../../middlewares/verifyUser";

import { ITrade, ITradeCard } from "../../../../client/src/types";

import { Router } from "express";
import { assertBody } from "../../middlewares/validateRequestBody";

const tradeRouter = Router();

function getTrade(
  cardId: string,
  userCollection: ICollection,
  otherCollection: ICollection
): ITrade {
  const userTradeCard: ITradeCard = {
    userId: userCollection.userId.toString(),
    cardId,
    expansionId: userCollection.expansionId,
    count: userCollection.countMap.get(cardId) || 0,
  };
  const otherTradeCard: ITradeCard = {
    userId: otherCollection.userId.toString(),
    cardId,
    expansionId: otherCollection.expansionId,
    count: otherCollection.countMap.get(cardId) || 0,
  };
  const priority = Math.min(otherTradeCard.count, 3) - userTradeCard.count; // + rarity ?
  // min priority: 2 - 1 = 1
  // max priority: 3 - (-1) = 4
  return {
    key: `${userTradeCard.userId}/${otherTradeCard.expansionId}/${otherTradeCard.cardId}`,
    cards: [userTradeCard, otherTradeCard],
    priority,
  };
}

export async function listByUserEmails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req.user, res);
    assertBody<{ userEmails: string[] }>(req.body, res, {
      userEmails: { required: true, email: true, array: true },
    });

    const userId = req.user._id;
    const userEmail = req.user.email;
    const otherUserEmails = req.body.userEmails.filter(
      (email) => email !== userEmail
    );

    const otherUsers = await User.find({ email: { $in: otherUserEmails } });
    const otherUserIds = otherUsers.map((user) => user._id);

    const collections = await Collection.find({
      userId: { $in: [req.user._id, ...otherUserIds] },
    });
    const userCollections = collections.filter((collection) =>
      collection.userId.equals(userId)
    );
    const otherUserCollections = collections.filter(
      (collection) => !collection.userId.equals(userId)
    );

    console.log("User Collections", userCollections.length);
    console.log("Other User Collections", otherUserCollections.length);

    const expansionIds = new Set<string>(
      collections.map((collection) => collection.expansionId)
    );

    console.log("Expansion IDs", expansionIds);

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

      console.log("Expansion Card IDs", expansionCardIds);

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

tradeRouter.post("/", listByUserEmails);

export default tradeRouter;
