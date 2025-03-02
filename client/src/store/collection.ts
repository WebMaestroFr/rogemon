import store from '@/store'

import auth from './auth'
import type { ICollectionCount } from '@/types'

export function getCollectionKey(expansionId: string) {
  return `collection/${expansionId}`
}

export function getCollectionCount(expansionId: string) {
  const key = getCollectionKey(expansionId)
  return store.get<ICollectionCount>(key) || {}
}

export function setCollectionCount(expansionId: string, collection: ICollectionCount) {
  const key = getCollectionKey(expansionId)
  store.set(key, collection)
  saveCollectionCount(expansionId)
}

export async function loadCollectionCount(expansionId: string) {
  return await auth
    .fetch<ICollectionCount>(`/api/collection/${expansionId}`)
    .then((collection) => {
      const key = getCollectionKey(expansionId)
      store.set(key, collection)
      return collection
    })
    .catch(() => getCollectionCount(expansionId))
}

export async function saveCollectionCount(expansionId: string) {
  const collection = getCollectionCount(expansionId)
  const key = getCollectionKey(expansionId)
  return store.debounce(key, () =>
    auth.fetch<ICollectionCount>(`/api/collection/${expansionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}
