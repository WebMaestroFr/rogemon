import { Router } from 'express'

import listUserCollections from './listUserCollections'
import upsertUserCollection from './upsertUserCollection'
import getCurrentUserCollection from './getCurrentUserCollection'
import getOtherUserCollection from './getOtherUserCollection'

const collectionRouter = Router()

collectionRouter.get('/', listUserCollections)
collectionRouter.get('/:expansionId', getCurrentUserCollection)
collectionRouter.get('/:expansionId/:username', getOtherUserCollection)
collectionRouter.post('/:expansionId', upsertUserCollection)

export default collectionRouter
