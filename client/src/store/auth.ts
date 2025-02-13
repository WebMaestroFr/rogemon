function getToken() {
  return localStorage.getItem('accessToken')
}

async function signIn(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signIn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw 'SignIn request failed'
  const accessToken = await response.text()
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

async function signInOrUp(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signInOrUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw 'SignInOrUp request failed'
  const accessToken = await response.text()
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

async function signUp(body: { email: string; password: string }) {
  const response = await fetch('/api/auth/signUp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw 'SignUp request failed'
  const accessToken = await response.text()
  localStorage.setItem('accessToken', accessToken)
  return accessToken
}

function signOut() {
  localStorage.removeItem('accessToken')
}

export default { getToken, signIn, signInOrUp, signUp, signOut }
