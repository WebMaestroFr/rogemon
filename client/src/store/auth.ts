export function getToken() {
  return localStorage.getItem('accessToken')
}

export async function signIn(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signIn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error('SignIn failed')
  const accessToken = await response.json()
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

export async function signUp(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error('SignUp failed')
  const accessToken = await response.json()
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

export async function signInOrUp(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signInOrUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error('SignInOrUp failed')
  const accessToken = await response.json()
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

export function signOut() {
  localStorage.removeItem('accessToken')
}

export default { getToken, signIn, signUp, signOut }
