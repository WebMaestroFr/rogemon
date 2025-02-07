export function get<T>(key: string) {
  const value = localStorage.getItem(key)
  return value && (JSON.parse(value) as T)
}
export function set(key: string, value: any) {
  const valueString = JSON.stringify(value)
  localStorage.setItem(key, valueString)
}
export function remove(key: string) {
  localStorage.removeItem(key)
}

export type CardRecords = { [cardId: string]: number }
export function getCardRecords(collectionId: string) {
  return get<CardRecords>(`cards-${collectionId}`) || {}
}
export function getcardRecord(collectionId: string, cardId: string): number {
  return getCardRecords(collectionId)[cardId] || 0
}
export function setCardRecord(collectionId: string, cardId: string, count: number) {
  const records = getCardRecords(collectionId)
  records[cardId] = count
  set(`cards-${collectionId}`, records)
}
export function removeCardRecord(collectionId: string, cardId: string) {
  const records = getCardRecords(collectionId)
  delete records[cardId]
  set(`cards-${collectionId}`, records)
}
