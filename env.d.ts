/// <reference types="vite/client" />

import type { ICollection as ICollectionModel } from './api/models/collection'
import type { IUser as IUserModel } from './api/models/user'

export interface ICollection extends ICollectionModel {
  _id: string
  countMap: {
    [cardId: string]: number
  }
  statusMap: {
    [cardId: string]: 'ask' | 'offer' | null
  }
}
export interface IUser extends IUserModel {
  _id: string
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

export type ExpansionId = 'A1' | 'A1a' | 'A2' | 'A2a' | 'A2b' | 'A3'

export interface ICollectionCount {
  [cardId: string]: number
}

export interface ITradeCard {
  cardId: string
  expansionId: ExpansionId
  priority: number
}
export interface ITrade {
  ask: ITradeCard[]
  offer: ITradeCard[]
}
export interface ITradeRarityMap {
  [rarity: string]: ITrade
}
export interface ITradeEmailMap {
  [email: string]: ITradeRarityMap
}
