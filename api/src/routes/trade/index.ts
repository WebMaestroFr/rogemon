import { Router } from "express";
import listByEmails from "./listByEmails";
import { ICollection } from "../../database";
import { ITrade, ITradeCard } from "../../../../client/src/types";

export function getTradeCard(
  cardId: string,
  collection: ICollection
): ITradeCard {
  return {
    userId: collection.userId.toString(),
    cardId,
    expansionId: collection.expansionId,
    count: collection.countMap.get(cardId) || 0,
  };
}

export function getTrade(
  userTradeCard: ITradeCard,
  otherTradeCard: ITradeCard
): ITrade {
  const priority = Math.min(otherTradeCard.count, 3) - userTradeCard.count;
  return {
    key: `${otherTradeCard.userId}/${otherTradeCard.expansionId}/${otherTradeCard.cardId}`,
    cards: [userTradeCard, otherTradeCard],
    priority,
  };
}

export function getTrades(
  userCollection: ICollection,
  otherCollection: ICollection
): ITrade[] {
  const cardIds = new Set([
    ...userCollection.countMap.keys(),
    ...otherCollection.countMap.keys(),
  ]);
  const userDuplicateOtherMissing: ITradeCard[] = [];
  const userMissingOtherDuplicate: ITradeCard[] = [];
  for (const cardId of cardIds) {
    const userCount = userCollection.countMap.get(cardId) || 0;
    const otherCount = otherCollection.countMap.get(cardId) || 0;
    if (userCount < 1 && otherCount > 2) {
      userMissingOtherDuplicate.push(getTradeCard(cardId, userCollection));
    } else if (userCount > 2 && otherCount < 1) {
      userDuplicateOtherMissing.push(getTradeCard(cardId, otherCollection));
    }
  }
  const trades: ITrade[] = [];
  for (const userTradeCard of userDuplicateOtherMissing) {
    for (const otherTradeCard of userMissingOtherDuplicate) {
      trades.push(getTrade(userTradeCard, otherTradeCard));
    }
  }
  return trades;
}

const tradeRouter = Router();

tradeRouter.post("/", listByEmails);

export default tradeRouter;
