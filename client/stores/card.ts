import type { ExpansionId, ICard } from '../../env'
import { getUserCollection, setUserCollection } from './collection'

export function getCardCount(expansionId: ExpansionId, cardId: string) {
  return getUserCollection(expansionId).countMap[cardId] || 0
}

export function setCardCount(expansionId: ExpansionId, cardId: string, count: number) {
  const collection = getUserCollection(expansionId)
  if (count < 1) {
    delete collection.countMap[cardId]
  } else {
    collection.countMap[cardId] = count
  }
  setUserCollection(expansionId, collection)
}

export function getCardStatus(expansionId: ExpansionId, cardId: string) {
  return getUserCollection(expansionId).statusMap[cardId] || null
}

export function setCardStatus(
  expansionId: ExpansionId,
  cardId: string,
  status: 'ask' | 'offer' | null,
) {
  const collection = getUserCollection(expansionId)
  collection.statusMap[cardId] = status
  setUserCollection(expansionId, collection)
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
