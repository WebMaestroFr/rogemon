import type { ExpansionId, ICard } from '../../env'
import { getCollection, setCollectionCount } from './collection'

export function getCardCount(expansionId: ExpansionId, cardId: string): number {
  return getCollection(expansionId)[cardId] || 0
}

export function setCardCount(expansionId: ExpansionId, cardId: string, count: number) {
  const collection = getCollection(expansionId)
  if (count === 0) {
    delete collection[cardId]
  } else {
    collection[cardId] = count
  }
  setCollectionCount(expansionId, collection)
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
