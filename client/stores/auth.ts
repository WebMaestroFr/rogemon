function getToken() {
  return localStorage.getItem('accessToken')
}

async function signIn(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signIn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw 'Request to sign in failed'
  const accessToken = await response.text()
  localStorage.setItem('accessToken', accessToken)
  location.reload()
}

async function signInOrUp(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signInOrUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw 'Request to sign in or up failed'
  const accessToken = await response.text()
  localStorage.setItem('accessToken', accessToken)
  location.reload()
}

async function signUp(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw 'Request to sign up failed'
  const accessToken = await response.text()
  localStorage.setItem('accessToken', accessToken)
  location.reload()
}

function signOut() {
  localStorage.clear()
  location.reload()
}

async function authFetch<T>(url: string, init: RequestInit = {}) {
  const token = getToken()
  if (!token) {
    throw 'Authentication token is missing'
  }
  const requestInit = {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await fetch(url, requestInit)
  if (res.status === 401) {
    signOut()
  }
  if (!res.ok) {
    throw res.text()
  }
  return res.json() as T
}

export default {
  fetch: authFetch,
  getToken,
  signIn,
  signInOrUp,
  signUp,
  signOut,
}
