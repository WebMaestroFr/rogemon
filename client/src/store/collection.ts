import store from '@/store'
import _ from 'lodash'

import auth from './auth'

export type Collection = { [cardId: string]: number }

export function getCollectionKey(expansionId: string) {
  return `collection/${expansionId}`
}

export function getCollection(expansionId: string) {
  const key = getCollectionKey(expansionId)
  return store.get<Collection>(key) || {}
}

export function setCollection(expansionId: string, collection: Collection) {
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
    .fetch<Collection>(`/api/collection/${expansionId}`)
    .then((collection) => {
      setCollection(expansionId, collection)
      return collection
    })
    .catch(() => getCollection(expansionId))
}

async function _saveCollection(expansionId: string) {
  const collection = getCollection(expansionId)
  return auth.fetch<Collection>(`/api/collection/${expansionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection),
  })
}
// Debounce the saveCollection function to prevent making too many requests
export const saveCollection = _.debounce(_saveCollection, 1000)
