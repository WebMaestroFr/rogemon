import storage from '.'

export type CardCounts = { [cardId: string]: number }

export function getCardCountsKey(collectionId: string) {
  return `cardCounts__${collectionId}`
}

export function getCardCounts(collectionId: string) {
  const collectionKey = getCardCountsKey(collectionId)
  return storage.get<CardCounts>(collectionKey) || {}
}

export function getcardCount(collectionId: string, cardId: string): number {
  return getCardCounts(collectionId)[cardId] || 0
}

export function setCardCount(collectionId: string, cardId: string, count: number) {
  const records = getCardCounts(collectionId)
  if (count === 0) {
    delete records[cardId]
  } else {
    records[cardId] = count
  }
  const collectionKey = getCardCountsKey(collectionId)
  storage.set(collectionKey, records)
}

export function removeCardCount(collectionId: string, cardId: string) {
  const records = getCardCounts(collectionId)
  delete records[cardId]
  const collectionKey = getCardCountsKey(collectionId)
  storage.set(collectionKey, records)
}
