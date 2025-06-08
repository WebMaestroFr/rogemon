import { Router } from 'express'

import listUserCollections from './listUserCollections'
import upsertUserCollection from './upsertUserCollection'
import getUserCollection from './getUserCollection'
import getCollection from './getCollection'

const collectionRouter = Router()

collectionRouter.get('/', listUserCollections)
collectionRouter.get('/:username/:expansionId', getCollection)
collectionRouter.get('/:expansionId', getUserCollection)
collectionRouter.post('/:expansionId', upsertUserCollection)

export default collectionRouter
