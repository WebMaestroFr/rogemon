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
  cardId: string,
  userCollection: ICollection,
  otherCollection: ICollection
): ITrade {
  const userTradeCard = getTradeCard(cardId, userCollection);
  const otherTradeCard = getTradeCard(cardId, otherCollection);
  const priority = Math.min(otherTradeCard.count, 3) - userTradeCard.count; // + rarity ?
  // min priority: 2 - 1 = 1
  // max priority: 3 - (-1) = 4
  return {
    key: `${otherTradeCard.userId}/${otherTradeCard.expansionId}/${otherTradeCard.cardId}`,
    cards: [userTradeCard, otherTradeCard],
    priority,
  };
}

const tradeRouter = Router();

tradeRouter.post("/", listByEmails);

export default tradeRouter;
