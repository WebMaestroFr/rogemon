function get<T>(key: string) {
  const value = localStorage.getItem(key)
  return value && (JSON.parse(value) as T)
}

type ItemValue = string | number | boolean | null | { [key: string]: ItemValue } | ItemValue[]
function set(key: string, value: ItemValue) {
  const valueString = JSON.stringify(value)
  localStorage.setItem(key, valueString)
}

function remove(key: string) {
  localStorage.removeItem(key)
}

export default { get, set, remove }
