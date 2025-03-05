import { Router } from "express";

import A1 from "../../assets/cards/A1.json";
import A1a from "../../assets/cards/A1a.json";
import A2 from "../../assets/cards/A2.json";
import A2a from "../../assets/cards/A2a.json";

import listByEmails from "./listByEmails";
import type { ExpansionId, ITrade, ITradeCard } from "../../../env";
import type { ICollection } from "@api/models/collection";

const expansionsJson = {
  A1,
  A1a,
  A2,
  A2a,
};

export function getCardRarity(
  expansionId: ExpansionId,
  cardId: string
): string {
  const expansionJson = expansionsJson[expansionId];
  if (!expansionJson) {
    throw new Error(`Unknown expansion ${expansionId}`);
  }
  const card = expansionJson.find((card) => card.id === cardId);
  if (!card) {
    throw new Error(`Unknown card ${cardId} for expansion ${expansionId}`);
  }
  return card.rarity;
}

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
    if (userCount < 1 && otherCount > 1) {
      userMissingOtherDuplicate.push(getTradeCard(cardId, userCollection));
    } else if (userCount > 1 && otherCount < 1) {
      userDuplicateOtherMissing.push(getTradeCard(cardId, otherCollection));
    }
  }
  const trades: ITrade[] = [];
  for (const userTradeCard of userDuplicateOtherMissing) {
    const userCardRarity = getCardRarity(
      userTradeCard.expansionId,
      userTradeCard.cardId
    );
    for (const otherTradeCard of userMissingOtherDuplicate) {
      const otherCardRarity = getCardRarity(
        otherTradeCard.expansionId,
        otherTradeCard.cardId
      );
      if (userCardRarity !== otherCardRarity) {
        continue;
      }
      trades.push(getTrade(userTradeCard, otherTradeCard));
    }
  }
  return trades;
}

const tradeRouter = Router();

tradeRouter.post("/", listByEmails);

export default tradeRouter;
