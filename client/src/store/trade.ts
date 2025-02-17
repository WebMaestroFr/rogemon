import auth from './auth'

interface ITradeCard {
  userId: string
  cardId: string
  expansionId: string
}
export interface ITrade {
  key: string
  cards: [ITradeCard, ITradeCard]
  priority: number
}

export async function loadTrades(userEmails: string[]) {
  return await auth.fetch<ITrade[]>(`/api/trade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmails }),
  })
}
