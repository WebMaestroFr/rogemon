function get<T>(key: string) {
  const value = localStorage.getItem(key)
  return value ? (JSON.parse(value) as T) : undefined
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

const debounceTimerMap = new Map<string, ReturnType<typeof setTimeout>>()
export function debounce<T>(key: string, callback: () => Promise<T>, timeout = 2000) {
  const prevTimer = debounceTimerMap.get(key)
  if (prevTimer) {
    clearTimeout(prevTimer)
  }
  return new Promise<T>((resolve, reject) => {
    const nextTimer = setTimeout(
      () =>
        callback()
          .then(resolve)
          .catch(reject)
          .finally(() => debounceTimerMap.delete(key)),
      timeout,
    )
    debounceTimerMap.set(key, nextTimer)
  })
}

export function isDebouncePending() {
  return debounceTimerMap.size > 0
}
