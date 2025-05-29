import { Router } from 'express'

import getUserCollection from './getUserCollection'
import listUserCollections from './listUserCollections'
import upsertUserCollection from './upsertUserCollection'

const collectionRouter = Router()

collectionRouter.get('/:expansionId', getUserCollection)
collectionRouter.get('/:expansionId/:username', getUserCollection)
collectionRouter.post('/:expansionId', upsertUserCollection)
collectionRouter.get('/', listUserCollections)

export default collectionRouter
