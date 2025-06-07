import * as dotenv from 'dotenv'
import express from 'express'
import chalk from 'chalk'

dotenv.config()

import logRequest from './middlewares/logRequest'
import handleError from './middlewares/handleError'
import verifyUser from './middlewares/verifyUser'
import apiRouter from './router'
import connectDatabase from './utilities/connectDatabase'
import debug from './utilities/debug'
import serveStaticFiles from './utilities/serveStaticFiles'
import serveDevelopment from './utilities/serveDevelopment'
import Collection from '@api/models/collection'

const ascii =
  " ____               __                       _  \n\
|  _ \\ ___   __ _  /_/ _ __ ___   ___  _ __ | | \n\
| |_) / _ \\ / _` |/ _ \\ '_ ` _ \\ / _ \\| '_ \\| | \n\
|  _ < (_) | (_| |  __/ | | | | | (_) | | | |_| \n\
|_| \\_\\___/ \\__, |\\___|_| |_| |_|\\___/|_| |_(_) \n\
            |___/                              \n"

const app = express()

async function setupServer() {
  debug.log(chalk.blue(ascii))
  try {
    const jsonMiddleware = express.json()

    app.use(jsonMiddleware)
    app.use(logRequest)
    app.use(verifyUser)
    app.use('/api', apiRouter)
    app.use(handleError)

    if (process.env.NODE_ENV === 'development') {
      await serveDevelopment(app, {
        api: Number(process.env.PORT_API) || 3000,
        client: Number(process.env.PORT_CLIENT) || 5173,
      })
    } else {
      serveStaticFiles(app)
    }

    await connectDatabase()

    await fixStatusMaps()
  } catch (err) {
    debug.error(err)
    throw err
  }
}

async function fixStatusMaps() {
  // To avoid having to manually set all status when it's released, we default to "ask" for count===0 count and "offer" for count>=2 if status is not set.
  const allCollections = await Collection.find()
  console.log(chalk.yellow(`Fixing status maps for ${allCollections.length} collections...`))
  for (const collection of allCollections) {
    for (const [cardId, count] of collection.countMap) {
      console.log(
        chalk.blue(`Checking card ${cardId} with count ${count} for user ${collection.userId}`),
      )
      if (!collection.statusMap.has(cardId)) {
        if (count > 1) {
          collection.statusMap.set(cardId, 'offer')
          // collection.countMap.set(cardId, 1)
        } else if (!count) {
          collection.statusMap.set(cardId, 'ask')
          // collection.countMap.set(cardId, 0)
        }
      }
    }
    await collection.save()
  }
}

setupServer()

export default app
