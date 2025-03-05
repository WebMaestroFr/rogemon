import type { ExpansionId, ICollectionCount } from '../../env'
import auth from './auth'
import store from './index'

export function getCollectionKey(expansionId: ExpansionId) {
  return `collection/${expansionId}`
}

export function getCollection(expansionId: ExpansionId) {
  const key = getCollectionKey(expansionId)
  return store.get<ICollectionCount>(key) || {}
}

export function setCollectionCount(expansionId: ExpansionId, collection: ICollectionCount) {
  const key = getCollectionKey(expansionId)
  store.set(key, collection)
  saveCollection(expansionId)
}

export async function loadCollection(expansionId: ExpansionId) {
  return await auth
    .fetch<ICollectionCount>(`/api/collection/${expansionId}`)
    .then((collection) => {
      const key = getCollectionKey(expansionId)
      store.set(key, collection)
      return collection
    })
    .catch(() => getCollection(expansionId))
}

export async function saveCollection(expansionId: ExpansionId) {
  const collection = getCollection(expansionId)
  const key = getCollectionKey(expansionId)
  return store.debounce(key, () =>
    auth.fetch<ICollectionCount>(`/api/collection/${expansionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}
