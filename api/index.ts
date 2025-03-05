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
  } catch (err) {
    debug.error(err)
    throw err
  }
}

setupServer()

export default app
