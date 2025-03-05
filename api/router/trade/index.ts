import { Router } from 'express'

import listUserTrades from './listUserTrades'

const tradeRouter = Router()

tradeRouter.post('/', listUserTrades)

export default tradeRouter
