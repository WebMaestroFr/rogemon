import type { ExpansionId, ICollection } from '../../env'
import auth from './auth'
import store, { debounce } from './index'

export const emails = [
  'joni@rogemon.app',
  'maxime@rogemon.app',
  'etienne@rogemon.app',
  'fabi@rogemon.app',
]

export const usernames = emails.map((email) => email.split('@')[0])

export const expansions: Record<ExpansionId, string> = {
  A1: 'Genetic Apex',
  A1a: 'Mythical Island',
  A2: 'Space-Time Smackdown',
  A2a: 'Triumphant Light',
  A2b: 'Shining Revelry',
  A3: 'Celestial Gardians',
  A3a: 'Extradimensional Crisis',
} as const

export function getCollectionKey(username: string, expansionId: ExpansionId) {
  return `user/${username}/collection/${expansionId}`
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

export function setCollectionCount(
  username: string,
  expansionId: ExpansionId,
  countMap: ICollection['countMap'],
) {
  const countKey = getCollectionCountKey(username, expansionId)
  store.set(countKey, countMap)
  saveCollection(username, expansionId)
}

export function setCollectionStatus(
  username: string,
  expansionId: ExpansionId,
  statusMap: ICollection['statusMap'],
) {
  const statusKey = getCollectionStatusKey(username, expansionId)
  store.set(statusKey, statusMap)
  saveCollection(username, expansionId)
}

export function setCollection(
  username: string,
  expansionId: ExpansionId,
  collection: Pick<ICollection, 'countMap' | 'statusMap'>,
) {
  setCollectionCount(username, expansionId, collection.countMap)
  setCollectionStatus(username, expansionId, collection.statusMap)
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

export async function saveCollection(username: string, expansionId: ExpansionId) {
  const collection = getCollection(username, expansionId)
  const collectionKey = getCollectionKey(username, expansionId)
  return debounce(`${collectionKey}`, () =>
    auth.fetch<ICollection>(`/api/${collectionKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    }),
  )
}

export async function saveUserCollection(expansionId: ExpansionId): Promise<ICollection> {
  const username = auth.getUsername()
  if (!username) {
    throw new Error('User is not authenticated')
  }
  return saveCollection(username, expansionId)
}
