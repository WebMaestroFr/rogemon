function get<T>(key: string) {
  const value = localStorage.getItem(key)
  return value && (JSON.parse(value) as T)
}

function set(key: string, value: any) {
  const valueString = JSON.stringify(value)
  localStorage.setItem(key, valueString)
}

function remove(key: string) {
  localStorage.removeItem(key)
}

export default { get, set, remove }
