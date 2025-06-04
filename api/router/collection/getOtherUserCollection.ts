import { NextFunction, Request, Response } from 'express'

import Collection from '@api/models/collection'
import assertRequestUser from '@api/utilities/assertRequestUser'
import { sendData, sendError } from '@api/utilities/sendResponse'
import User from '@api/models/user'

export default async function getOtherUserCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res)

    const otherUser = await User.findOne({ email: { $regex: `^${req.params.username}` } })
    if (!otherUser) return sendError(res, 404, 'User not found')

    const collection = await Collection.findOne({
      userId: otherUser._id,
      expansionId: req.params.expansionId,
    })
    if (!collection) return sendError(res, 404, 'Collection not found')

    return sendData(res, 200, collection.countMap)
  } catch (err) {
    next(err)
  }
}
