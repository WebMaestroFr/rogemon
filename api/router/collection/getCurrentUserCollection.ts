import { NextFunction, Request, Response } from 'express'

import Collection from '@api/models/collection'
import assertRequestUser from '@api/utilities/assertRequestUser'
import { sendData, sendError } from '@api/utilities/sendResponse'

export default async function getCurrentUserCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res)
    const collection = await Collection.findOne({
      userId: req.user._id,
      expansionId: req.params.expansionId,
    })
    if (!collection) return sendError(res, 404, 'Collection not found')

    return sendData(res, 200, collection.countMap)
  } catch (err) {
    next(err)
  }
}
