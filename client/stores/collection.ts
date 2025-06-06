import type { ExpansionId, ICollectionCount } from '../../env'
import auth from './auth'
import store, { debounce } from './index'

export const emails = ['test@test.tt', 'test2@test.tt']

export const expansions: Record<ExpansionId, string> = {
  A1: 'Genetic Apex',
  A1a: 'Mythical Island',
  A2: 'Space-Time Smackdown',
  A2a: 'Triumphant Light',
  A2b: 'Shining Revelry',
  A3: 'Celestial Gardians',
  A3a: 'Extradimensional Crisis',
} as const

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

export async function loadCollectionByUsername(expansionId: ExpansionId, username: string) {
  return await auth.fetch<ICollectionCount>(`/api/collection/${expansionId}/${username}`)
}

export async function saveCollection(expansionId: ExpansionId) {
  const collection = getCollection(expansionId)
  const key = getCollectionKey(expansionId)
  return debounce(key, () =>
    auth.fetch<ICollectionCount>(`/api/collection/${expansionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}
