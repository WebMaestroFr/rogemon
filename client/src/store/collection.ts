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
      const key = getCollectionKey(expansionId)
      store.set(key, collection)
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
const debounceTimerMap = new Map<string, ReturnType<typeof setTimeout>>()
export function saveCollection(expansionId: string, timeout = 1500) {
  const key = getCollectionKey(expansionId)
  const timer = debounceTimerMap.get(key)
  if (timer) {
    clearTimeout(timer)
  }
  return new Promise<Collection>((resolve, reject) =>
    debounceTimerMap.set(
      key,
      setTimeout(() => {
        _saveCollection(expansionId).then(resolve).catch(reject)
      }, timeout),
    ),
  )
}
