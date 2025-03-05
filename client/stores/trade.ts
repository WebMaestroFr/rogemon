import type { ITrade } from '../../env'
import auth from './auth'

export async function loadTrades(emails: string[]) {
  return await auth.fetch<{ [email: string]: ITrade[] }>(`/api/trade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  })
}
