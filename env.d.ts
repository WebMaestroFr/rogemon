/// <reference types="vite/client" />

import { IUser } from './api/models/user'

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser | null
  }
}

export interface ICard {
  id: string
  name: string
  hp: string
  card_type: string
  evolution_type: string
  image: string
  attacks: {
    cost: string[]
    name: string
    damage: string
    effect: string
  }[]
  ability: {
    name: string
    effect: string
  }
  weakness: string
  retreat: string
  rarity: string
  fullart: string
  ex: string
  set_details: string
  pack: string
  alternate_versions: {
    version: string
    rarity: string
  }[]
  artist: string
  probability: {
    [name: string]: string
  }
  crafting_cost: number | 'Unknown'
}

export type ExpansionId = 'A1' | 'A1a' | 'A2' | 'A2a'

export interface ICollectionCount {
  [cardId: string]: number
}

export interface ITradeCard {
  userId: string
  cardId: string
  expansionId: ExpansionId
  count: number
}
export interface ITrade {
  key: string
  cards: [ITradeCard, ITradeCard]
  priority: number
}
