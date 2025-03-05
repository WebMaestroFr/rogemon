import { NextFunction, Request, Response } from 'express'

import Collection from '@api/models/collection'
import assertRequestUser from '@api/utilities/assertRequestUser'
import { sendData } from '@api/utilities/sendResponse'

export default async function listByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    assertRequestUser(req.user, res)
    const collections = await Collection.find({ userId: req.user._id })
    return sendData(res, 200, collections)
  } catch (err) {
    next(err)
  }
}
