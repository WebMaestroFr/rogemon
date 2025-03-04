import type { ExpansionId, ICard } from "@/types";
import { getCollectionCount, setCollectionCount } from "./collection";

export function getCardCount(expansionId: ExpansionId, cardId: string): number {
  return getCollectionCount(expansionId)[cardId] || 0;
}

export function setCardCount(
  expansionId: ExpansionId,
  cardId: string,
  count: number,
) {
  const collection = getCollectionCount(expansionId);
  if (count === 0) {
    delete collection[cardId];
  } else {
    collection[cardId] = count;
  }
  setCollectionCount(expansionId, collection);
}

const cardsCacheMap = new Map<string, ICard[]>();
export async function loadCards(expansionId: ExpansionId): Promise<ICard[]> {
  if (!cardsCacheMap.has(expansionId)) {
    const cards = await fetch(`cards/${expansionId}.json`, {
      cache: "force-cache",
    }).then((response) => response.json());
    cardsCacheMap.set(expansionId, cards);
    return cards;
  }
  return cardsCacheMap.get(expansionId) as ICard[];
}

export async function loadCard(expansionId: ExpansionId, cardId: string) {
  const cards = await loadCards(expansionId);
  return cards.find((card) => card.id === cardId);
}
