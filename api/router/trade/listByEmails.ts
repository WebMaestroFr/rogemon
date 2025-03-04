import { NextFunction, Request, Response } from "express";

import Collection from "@api/models/collection";
import User from "@api/models/user";
import assertRequestBody from "@api/utilities/assertRequestBody";
import assertRequestUser from "@api/utilities/assertRequestUser";
import type { ITrade } from "../../../env";
import { getTrades } from ".";
import { sendData } from "@api/utilities/sendResponse";

export default async function listByEmails(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res);
    assertRequestBody<{ emails: string[] }>(req.body, res, {
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
      collection.userId.equals(userId),
    );
    const otherUserCollections = collections.filter(
      (collection) => !collection.userId.equals(userId),
    );

    const expansionIds = new Set<string>(
      collections.map((collection) => collection.expansionId),
    );

    const trades: { [email: string]: ITrade[] } = {};
    for (const expansionId of expansionIds) {
      const userExpansionCollection = userCollections.find(
        (collection) => collection.expansionId === expansionId,
      );
      if (!userExpansionCollection) {
        console.warn("No user collection for expansion", expansionId);
        continue;
      }
      const otherUserExpansionCollections = otherUserCollections.filter(
        (collection) => collection.expansionId === expansionId,
      );
      if (otherUserExpansionCollections.length === 0) {
        console.warn("No other user collections for expansion", expansionId);
        continue;
      }

      for (const otherUserExpansionCollection of otherUserExpansionCollections) {
        const collectionTrades = getTrades(
          userExpansionCollection,
          otherUserExpansionCollection,
        );
        const otherUser = otherUsers.find((user) =>
          otherUserExpansionCollection.userId.equals(user._id),
        );
        if (!otherUser) {
          throw `No user found for ID ${otherUserExpansionCollection.userId}`;
        }
        if (!trades[otherUser.email]) {
          trades[otherUser.email] = collectionTrades;
        } else {
          trades[otherUser.email].push(...collectionTrades);
        }
      }
    }

    for (const otherTrades of Object.values(trades)) {
      otherTrades.sort((a, b) => b.priority - a.priority);
    }

    return sendData(res, 200, trades);
  } catch (err) {
    next(err);
  }
}
