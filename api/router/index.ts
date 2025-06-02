import { Router } from 'express'

import authRouter from './auth'
import collectionRouter from './collection'
import tradeRouter from './trade'
import userRouter from './user'

const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/collection', collectionRouter)
apiRouter.use('/trade', tradeRouter)
apiRouter.use('/user', userRouter)

apiRouter.get('/', (_req, res) => {
  res.send('Rogémon!')
})

export default apiRouter
