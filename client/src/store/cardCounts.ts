import store from '@/store'
import auth from './auth'

export type CardCount = { [cardId: string]: number }

export function getCollectionCountKey(collectionId: string) {
  return `cardCount__${collectionId}`
}

export function getCollectionCount(collectionId: string) {
  const key = getCollectionCountKey(collectionId)
  return store.get<CardCount>(key) || {}
}

export function getCardCount(collectionId: string, cardId: string): number {
  return getCollectionCount(collectionId)[cardId] || 0
}

export function setCardCount(collectionId: string, cardId: string, cardCount: number) {
  const count = getCollectionCount(collectionId)
  if (cardCount === 0) {
    delete count[cardId]
  } else {
    count[cardId] = cardCount
  }
  const key = getCollectionCountKey(collectionId)
  store.set(key, count)
}

export function removeCardCount(collectionId: string, cardId: string) {
  const count = getCollectionCount(collectionId)
  delete count[cardId]
  const key = getCollectionCountKey(collectionId)
  store.set(key, count)
}

export async function loadCollectionCounts() {
  const collectionCounts =
    await auth.fetch<{ collectionId: string; count: CardCount }[]>(`/api/card-count`)
  for (const { collectionId, count } of collectionCounts) {
    const key = getCollectionCountKey(collectionId)
    store.set(key, count)
  }
  return collectionCounts
}

export async function loadCollectionCount(collectionId: string) {
  const cardCounts = await loadCollectionCounts()
  return cardCounts.find((cardCount) => cardCount.collectionId === collectionId)
}

export async function saveCollectionCount(collectionId: string) {
  const count = getCollectionCount(collectionId)
  return auth.fetch('/api/card-count', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collectionId, count }),
  })
}
