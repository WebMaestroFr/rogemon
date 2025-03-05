import type { ITradeEmailMap } from '../../env'
import auth from './auth'

export async function listTradesByEmail(emails: string[]) {
  return await auth.fetch<ITradeEmailMap>(`/api/trade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  })
}
