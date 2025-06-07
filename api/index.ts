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
import { expansionsJson } from './router/trade/listUserTrades'

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

    // TODO: Remove this after all users have their status maps set on production.
    await fixStatusMaps()
  } catch (err) {
    debug.error(err)
    throw err
  }
}

async function fixStatusMaps() {
  // To avoid having to manually set all cards status when collection.statusMap is released,
  // we default to "ask" for count===0 count, and to "offer" for count>=2 if status is not set.
  for (const [expansionId, expansion] of Object.entries(expansionsJson)) {
    const expansionCollections = await Collection.find({ expansionId })
    for (const collection of expansionCollections) {
      if (!collection.statusMap) {
        collection.statusMap = new Map<string, 'ask' | 'offer'>()
        console.log(
          chalk.blue(
            `Adding status maps to ${expansionId} collection (${expansion.length} cards) for user ${collection.userId}`,
          ),
        )
        for (const { id } of expansion) {
          const count = collection.countMap.get(id)
          if (!count) {
            // "No count" means 0 with the previous implementation :(
            console.log(chalk.red(`No count for card ${id}, setting to 'ask'`))
            // Assuming current users have reasonably completed collection,
            // it should be quite accurate to consider that any card with count < 1 is "ask"
            collection.statusMap.set(id, 'ask')
            collection.countMap.set(id, 0)
          } else if (count > 1) {
            console.log(chalk.green(`Count for card ${id} is ${count}, setting to 'offer'`))
            collection.statusMap.set(id, 'offer')
            collection.countMap.set(id, 2)
          }
        }
        await collection.save()
      }
    }
    console.log(chalk.green(`Added status maps to ${expansionId} collections`))
  }
}

setupServer()

export default app
