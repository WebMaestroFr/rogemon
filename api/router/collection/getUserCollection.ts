import { NextFunction, Request, Response } from 'express'

import Collection from '@api/models/collection'
import assertRequestUser from '@api/utilities/assertRequestUser'
import { sendData, sendError } from '@api/utilities/sendResponse'
import User from '@api/models/user'
import type { Types } from 'mongoose'

export default async function getUserCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res)

    let otherUser: Types.ObjectId | null = null
    if (req.params.username) {
      const user = await User.findOne({ email: { $regex: `^${req.params.username}` } })
      if (user) otherUser = user._id
    }

    const collection = await Collection.findOne({
      userId: otherUser || req.user._id,
      expansionId: req.params.expansionId,
    })
    if (!collection) {
      return sendError(res, 404, 'Collection not found')
    }
    return sendData(res, 200, collection.countMap)
  } catch (err) {
    next(err)
  }
}
