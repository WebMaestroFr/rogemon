import { NextFunction, Request, Response } from 'express'

import Collection from '@api/models/collection'
import User from '@api/models/user'
import assertRequestBody from '@api/utilities/assertRequestBody'
import assertRequestUser from '@api/utilities/assertRequestUser'
import type { ExpansionId, ITrade, ITradeEmailMap } from '../../../env'
import { sendData } from '@api/utilities/sendResponse'

import A1 from '../../assets/cards/A1.json'
import A1a from '../../assets/cards/A1a.json'
import A2 from '../../assets/cards/A2.json'
import A2a from '../../assets/cards/A2a.json'
import A2b from '../../assets/cards/A2b.json'
import A3 from '../../assets/cards/A3.json'
import A3a from '../../assets/cards/A3a.json'

const expansionsJson = {
  A1,
  A1a,
  A2,
  A2a,
  A2b,
  A3,
  A3a,
}

export function getCardRarity(expansionId: ExpansionId, cardId: string): string {
  const expansionJson = expansionsJson[expansionId]
  if (!expansionJson) {
    throw new Error(`Unknown expansion ${expansionId}`)
  }
  const card = expansionJson.find((card) => card.id === cardId)
  if (!card) {
    throw new Error(`Unknown card ${cardId} for expansion ${expansionId}`)
  }
  return card.rarity
}

export default async function listUserTrades(req: Request, res: Response, next: NextFunction) {
  try {
    assertRequestUser(req.user, res)
    assertRequestBody<{ emails: string[] }>(req.body, res, {
      emails: { required: true, email: true, type: 'array' },
    })

    const userId = req.user._id
    const userEmail = req.user.email
    const otherEmails = req.body.emails.filter((email) => email !== userEmail)

    const otherUsers = await User.find({ email: { $in: otherEmails } })
    const otherIds = otherUsers.map((user) => user._id)

    const collections = await Collection.find({
      userId: { $in: [userId, ...otherIds] },
    })
    const userCollections = collections.filter((collection) => collection.userId.equals(userId))
    const otherCollections = collections.filter((collection) => !collection.userId.equals(userId))

    const emailTrades = otherCollections.reduce<ITradeEmailMap>((emailTrades, otherCollection) => {
      const userCollection = userCollections.find(
        (collection) => collection.expansionId === otherCollection.expansionId,
      )
      const otherUser = otherUsers.find((user) => user._id.equals(otherCollection.userId))
      if (!userCollection || !otherUser) {
        return emailTrades
      }
      const emailTrade = emailTrades[otherUser.email] || new Map<string, ITrade>()
      const cardIds = new Set([
        ...userCollection.statusMap.keys(),
        ...otherCollection.statusMap.keys(),
      ])
      for (const cardId of cardIds) {
        const userStatus = userCollection.statusMap.get(cardId)
        const otherStatus = otherCollection.statusMap.get(cardId)
        if (userStatus === otherStatus) {
          continue // Skip if both have the same status
        }
        const rarity = getCardRarity(otherCollection.expansionId, cardId)
        const rarityTrade = emailTrade[rarity] || { ask: [], offer: [] }
        if (userStatus === 'ask' && otherStatus === 'offer') {
          rarityTrade.ask.push({
            cardId,
            expansionId: otherCollection.expansionId,
          })
          emailTrade[rarity] = rarityTrade
        } else if (userStatus === 'offer' && otherStatus === 'ask') {
          rarityTrade.offer.push({
            cardId,
            expansionId: otherCollection.expansionId,
          })
          emailTrade[rarity] = rarityTrade
        }
      }
      emailTrades[otherUser.email] = emailTrade
      return emailTrades
    }, {})

    return sendData(res, 200, emailTrades)
  } catch (err) {
    next(err)
  }
}
