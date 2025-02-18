import type { ITrade } from '@/types'
import auth from './auth'

export async function loadTrades(emails: string[]) {
  return await auth.fetch<ITrade[]>(`/api/trade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  })
}
