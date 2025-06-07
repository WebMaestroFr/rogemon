import { NextFunction, Request, Response } from 'express'

import Collection, { type ICollection } from '@api/models/collection'
import assertRequestUser from '@api/utilities/assertRequestUser'
import { sendData } from '@api/utilities/sendResponse'
import assertRequestBody from '@api/utilities/assertRequestBody'

export default async function upsertUserCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('upsertUserCollection called', req.params.expansionId, req.body)
  try {
    assertRequestUser(req.user, res)
    assertRequestBody<Partial<ICollection>>(req.body, res, {
      countMap: { required: true, type: 'object' },
      statusMap: { required: true, type: 'object' },
    })
    const collection = await Collection.findOneAndUpdate(
      {
        userId: req.user._id,
        expansionId: req.params.expansionId,
      },
      req.body,
      { new: true, upsert: true },
    )
    const collectionResult = await collection.save()
    return sendData(res, 201, collectionResult)
  } catch (err) {
    next(err)
  }
}
