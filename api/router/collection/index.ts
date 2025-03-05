import { Router } from 'express'

import listByUserId from './listByUserId'
import getByExpansionId from './getByExpansionId'
import upsertExpansionCount from './upsertByExpansionId'

const collectionRouter = Router()

collectionRouter.get('/:expansionId', getByExpansionId)
collectionRouter.post('/:expansionId', upsertExpansionCount)

collectionRouter.get('/', listByUserId)

export default collectionRouter
