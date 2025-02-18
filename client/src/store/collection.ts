import store from '@/store'
import _ from 'lodash'

import auth from './auth'

export type { ICard } from '@/types'

export interface ICountMap {
  [cardId: string]: number
}

export function getCollectionKey(expansionId: string) {
  return `collection/${expansionId}`
}

export function getCollection(expansionId: string) {
  const key = getCollectionKey(expansionId)
  return store.get<ICountMap>(key) || {}
}

export function setCollection(expansionId: string, collection: ICountMap) {
  const key = getCollectionKey(expansionId)
  store.set(key, collection)
  // Save the collection to the server
  saveCollection(expansionId)
}

export function getCardCount(expansionId: string, cardId: string): number {
  return getCollection(expansionId)[cardId] || 0
}

export function setCardCount(expansionId: string, cardId: string, count: number) {
  const collection = getCollection(expansionId)
  if (count === 0) {
    delete collection[cardId]
  } else {
    collection[cardId] = count
  }
  setCollection(expansionId, collection)
}

export async function loadCollection(expansionId: string) {
  return await auth
    .fetch<ICountMap>(`/api/collection/${expansionId}`)
    .then((collection) => {
      const key = getCollectionKey(expansionId)
      store.set(key, collection)
      return collection
    })
    .catch(() => getCollection(expansionId))
}

export async function saveCollection(expansionId: string) {
  const collection = getCollection(expansionId)
  const key = getCollectionKey(expansionId)
  return store.debounce(key, () =>
    auth.fetch<ICountMap>(`/api/collection/${expansionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}
