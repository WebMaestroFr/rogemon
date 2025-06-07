import type { ExpansionId, ICard } from '../../env'
import { getUserCollection, setUserCollectionCount, setUserCollectionStatus } from './collection'

export function getUserCardCount(expansionId: ExpansionId, cardId: string) {
  return getUserCollection(expansionId).countMap[cardId] || 0
}

export function setUserCardCount(expansionId: ExpansionId, cardId: string, count: number) {
  const collection = getUserCollection(expansionId)
  if (count < 1) {
    delete collection.countMap[cardId]
  } else {
    collection.countMap[cardId] = count
  }
  setUserCollectionCount(expansionId, collection.countMap)
}

export function getUserCardStatus(expansionId: ExpansionId, cardId: string) {
  return getUserCollection(expansionId).statusMap[cardId] || null
}

export function setUserCardStatus(
  expansionId: ExpansionId,
  cardId: string,
  status: 'ask' | 'offer' | null,
) {
  const collection = getUserCollection(expansionId)
  collection.statusMap[cardId] = status
  setUserCollectionStatus(expansionId, collection.statusMap)
}

const cardsCacheMap = new Map<string, Promise<ICard[]>>()
export async function loadCards(expansionId: ExpansionId) {
  if (!cardsCacheMap.has(expansionId)) {
    const cards: Promise<ICard[]> = fetch(`cards/${expansionId}.json`, {
      cache: 'force-cache',
    }).then((response) => response.json())
    cardsCacheMap.set(expansionId, cards)
    return cards
  }
  return cardsCacheMap.get(expansionId) || []
}

export async function loadCard(expansionId: ExpansionId, cardId: string) {
  const cards = await loadCards(expansionId)
  return cards.find((card) => card.id === cardId)
}
