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

const expansionsJson = {
  A1,
  A1a,
  A2,
  A2a,
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
      emails: { required: true, email: true, array: true },
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
      const emailTrade = emailTrades.get(otherUser.email) || new Map<string, ITrade>()
      const cardIds = new Set([
        ...userCollection.countMap.keys(),
        ...otherCollection.countMap.keys(),
      ])
      for (const cardId of cardIds) {
        const userCount = userCollection.countMap.get(cardId) || 0
        const otherCount = otherCollection.countMap.get(cardId) || 0
        if ((userCount > 0 && otherCount > 0) || (userCount < 1 && otherCount < 1)) {
          continue
        }
        const rarity = getCardRarity(otherCollection.expansionId, cardId)
        console.log(otherCollection.expansionId, cardId, { userCount, otherCount, rarity })
        const rarityTrade = emailTrade.get(rarity) || { ask: [], offer: [] }
        if (userCount < 1 && otherCount > 1) {
          console.log(`User ${userEmail} wants ${cardId} from ${otherUser.email}`)
          rarityTrade.offer.push({
            cardId,
            expansionId: otherCollection.expansionId,
            priority: Math.min(otherCount, 3) - userCount,
          })
        } else if (userCount > 1 && otherCount < 1) {
          console.log(`User ${userEmail} has ${cardId} for ${otherUser.email}`)
          rarityTrade.ask.push({
            cardId,
            expansionId: otherCollection.expansionId,
            priority: Math.min(userCount, 3) - otherCount,
          })
        }
        emailTrade.set(rarity, rarityTrade)
      }
      emailTrades.set(otherUser.email, emailTrade)
      return emailTrades
    }, new Map())

    return sendData(res, 200, emailTrades)
  } catch (err) {
    next(err)
  }
}
