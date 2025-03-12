import type { ExpansionId, ICollection } from '../../env'
import auth from './auth'
import store, { debounce } from './index'

export function getCollectionCountKey(expansionId: ExpansionId) {
  return `collection/${expansionId}/countMap`
}
export function getCollectionStatusKey(expansionId: ExpansionId) {
  return `collection/${expansionId}/statusMap`
}

export function getCollection(
  expansionId: ExpansionId,
): Pick<ICollection, 'countMap' | 'statusMap'> {
  const countKey = getCollectionCountKey(expansionId)
  const statusKey = getCollectionStatusKey(expansionId)
  const countMap = store.get<ICollection['countMap']>(countKey) || {}
  const statusMap = store.get<ICollection['statusMap']>(statusKey) || {}
  return { countMap, statusMap }
}

export function setCollectionCount(expansionId: ExpansionId, countMap: ICollection['countMap']) {
  const countKey = getCollectionCountKey(expansionId)
  store.set(countKey, countMap)
  saveCollection(expansionId)
}

export function setCollectionStatus(expansionId: ExpansionId, statusMap: ICollection['statusMap']) {
  const statusKey = getCollectionStatusKey(expansionId)
  store.set(statusKey, statusMap)
  saveCollection(expansionId)
}

export async function loadCollection(expansionId: ExpansionId) {
  return await auth
    .fetch<ICollection>(`/api/collection/${expansionId}`)
    .then((collection) => {
      const countKey = getCollectionCountKey(expansionId)
      const statusKey = getCollectionStatusKey(expansionId)
      store.set(countKey, collection.countMap)
      store.set(statusKey, collection.statusMap)
      return collection
    })
    .catch(() => getCollection(expansionId))
}

export async function saveCollection(expansionId: ExpansionId) {
  const collection = getCollection(expansionId)
  return debounce(`collection/${expansionId}`, () =>
    auth.fetch<ICollection>(`/api/collection/${expansionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}
