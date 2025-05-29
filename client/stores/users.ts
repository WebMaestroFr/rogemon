import auth from './auth'

export async function loadUsers() {
  return await auth
    .fetch<string[]>(`/api/profiles`)
    .then((collection) => {
      return collection
    })
    .catch((err) => console.error(err))
}
