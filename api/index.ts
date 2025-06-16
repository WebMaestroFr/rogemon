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
import EXPANSIONS from '@api/assets/cards'
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

    // TODO: Remove this after all users have their status maps set on production.
    await setDefaultCollectionStatusMaps()
  } catch (err) {
    debug.error(err)
    throw err
  }
}

// TODO: Remove this after all users have their status maps set on production.
async function setDefaultCollectionStatusMaps() {
  // Upgrade from countMap to statusMap
  // To avoid having to manually set all cards status when collection.statusMap is released,
  // we default to "ask" for count===0 count, and to "offer" for count>=2 if status is not set.
  for (const [expansionId, expansion] of Object.entries(EXPANSIONS)) {
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
            // Assuming current users have reasonably complete collections,
            // we consider that any card with no count is "ask"
            console.log(chalk.red(`No count for card ${id}, setting to 'ask'`))
            collection.statusMap.set(id, 'ask')
            if (count === undefined) {
              // undefined means 0 with the previous implementation :(
              collection.countMap.set(id, 0)
            }
          } else if (count > 1) {
            console.log(chalk.green(`Count for card ${id} is ${count}, setting to 'offer'`))
            collection.statusMap.set(id, 'offer')
            // TODO: when we don't care for count>2 anymore we should ceil it to 2
            // Keeping the count for now will allow compatibility with parallel git branches (during development)
            // collection.countMap.set(id, 2)
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
