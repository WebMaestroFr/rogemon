import mongoose from 'mongoose'

import debug from '@api/utilities/debug'

if (!process.env.MONGODB_URI) {
  throw new Error('The MONGODB_URI environment variable is undefined')
}

export const MONGODB_URI = process.env.MONGODB_URI

interface CheckDatabaseConnection {
  (resolve: () => void): void
}

const processDatabaseConnection: CheckDatabaseConnection = (resolve) => {
  switch (mongoose.connection.readyState) {
    case 99: // Uninitialized
    case 0: // Disconnected
      debug.info('Connecting to database...')
      mongoose
        .connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 60000,
        })
        .then(() => processDatabaseConnection(resolve))
      break
    case 3: // Disonnecting
      debug.info('Waiting for database to disconnect...')
      setTimeout(() => processDatabaseConnection(resolve), 1000)
      break
    case 2: // Connecting
      debug.info('Waiting for database to connect...')
      setTimeout(() => processDatabaseConnection(resolve), 1000)
      break
    case 1: // Connected
      debug.success(`Database is connected`)
      resolve()
  }
}

export default async function connectDatabase() {
  try {
    return await new Promise<void>(processDatabaseConnection)
  } catch (err) {
    debug.error('Error connecting to database')
    throw err
  }
}
