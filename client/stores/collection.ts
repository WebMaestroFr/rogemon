import type { ExpansionId, ICollection } from '../../env'
import auth from './auth'
import store, { debounce } from './index'

export const emails = [
  'joni@rogemon.app',
  'maxime@rogemon.app',
  'etienne@rogemon.app',
  'fabi@rogemon.app',
]

export const expansions: Record<ExpansionId, string> = {
  A1: 'Genetic Apex',
  A1a: 'Mythical Island',
  A2: 'Space-Time Smackdown',
  A2a: 'Triumphant Light',
  A2b: 'Shining Revelry',
  A3: 'Celestial Gardians',
  A3a: 'Extradimensional Crisis',
  A3b: 'Eevee Grove',
  A4: 'Wisdom of Sea and Sky',
} as const

// TODO: Remove this once all users have migrated to the new collection structure
// Copy old collection count to new store location
for (const expansionId of Object.keys(expansions) as ExpansionId[]) {
  const username = auth.getUsername()
  if (username) {
    const oldCollectionKey = `collection/${expansionId}`
    const newCollectionCountKey = getCollectionCountKey(username, expansionId)
    const oldCollection = store.get<ICollection['countMap']>(oldCollectionKey)
    const newCollectionCount = store.get<ICollection['countMap']>(newCollectionCountKey)
    if (oldCollection && !newCollectionCount) {
      store.set(newCollectionCountKey, oldCollection)
      // store.remove(oldCollectionKey)
    }
  }
}

export function getCollectionKey(username: string, expansionId: ExpansionId) {
  return `collection/${username}/${expansionId}`
}
export function getCollectionCountKey(username: string, expansionId: ExpansionId) {
  return `${getCollectionKey(username, expansionId)}/countMap`
}
export function getCollectionStatusKey(username: string, expansionId: ExpansionId) {
  return `${getCollectionKey(username, expansionId)}/statusMap`
}

export function getCollectionCountMap(username: string, expansionId: ExpansionId) {
  const countKey = getCollectionCountKey(username, expansionId)
  return store.get<ICollection['countMap']>(countKey) || {}
}
export function getCollectionStatusMap(username: string, expansionId: ExpansionId) {
  const statusKey = getCollectionStatusKey(username, expansionId)
  return store.get<ICollection['statusMap']>(statusKey) || {}
}

export function getCollection(
  username: string,
  expansionId: ExpansionId,
): Pick<ICollection, 'countMap' | 'statusMap'> {
  const countMap = getCollectionCountMap(username, expansionId)
  const statusMap = getCollectionStatusMap(username, expansionId)
  return { countMap, statusMap }
}

export function getUserCollection(
  expansionId: ExpansionId,
): Pick<ICollection, 'countMap' | 'statusMap'> {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  return getCollection(username, expansionId)
}

export function setCollectionCountMap(
  username: string,
  expansionId: ExpansionId,
  countMap: ICollection['countMap'],
) {
  const countKey = getCollectionCountKey(username, expansionId)
  store.set(countKey, countMap)
}

export function setUserCollectionCountMap(
  expansionId: ExpansionId,
  countMap: ICollection['countMap'],
) {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  setCollectionCountMap(username, expansionId, countMap)
  saveUserCollection(expansionId)
}

export function setCollectionStatusMap(
  username: string,
  expansionId: ExpansionId,
  statusMap: ICollection['statusMap'],
) {
  const statusKey = getCollectionStatusKey(username, expansionId)
  store.set(statusKey, statusMap)
}

export function setUserCollectionStatusMap(
  expansionId: ExpansionId,
  statusMap: ICollection['statusMap'],
) {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  setCollectionStatusMap(username, expansionId, statusMap)
  saveUserCollection(expansionId)
}

export function setCollection(
  username: string,
  expansionId: ExpansionId,
  collection: Pick<ICollection, 'countMap' | 'statusMap'>,
) {
  setCollectionCountMap(username, expansionId, collection.countMap)
  setCollectionStatusMap(username, expansionId, collection.statusMap)
}

export function setUserCollection(
  expansionId: ExpansionId,
  collection: Pick<ICollection, 'countMap' | 'statusMap'>,
) {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  setCollection(username, expansionId, collection)
}

export async function loadCollection(username: string, expansionId: ExpansionId) {
  return await auth
    .fetch<ICollection>(`/api/${getCollectionKey(username, expansionId)}`)
    .then((collection) => {
      setCollection(username, expansionId, collection)
      return collection
    })
    .catch(() => getCollection(username, expansionId))
}

export async function loadUserCollection(expansionId: ExpansionId) {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  return loadCollection(username, expansionId)
}

export async function saveUserCollection(expansionId: ExpansionId): Promise<ICollection> {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  const collection = getCollection(username, expansionId)
  const collectionKey = getCollectionKey(username, expansionId)
  return debounce(`${collectionKey}`, () =>
    auth.fetch<ICollection>(`/api/collection/${expansionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}
