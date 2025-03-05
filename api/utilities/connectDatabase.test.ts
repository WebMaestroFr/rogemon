import mongoose from 'mongoose'
import { it, expect, vi } from 'vitest'
import connectDatabase, { MONGODB_URI } from './connectDatabase'

vi.mock('mongoose', async (importOriginal) => {
  const actualMongoose = await importOriginal<typeof import('mongoose')>()
  const mockedMongoose = {
    ...actualMongoose,
    default: {
      ...actualMongoose.default,
      connect: vi.fn(() => {
        mockedMongoose.default.connection.readyState = 1
        return Promise.resolve()
      }),
      connection: {
        readyState: 0,
      },
    },
  }
  return mockedMongoose
})

it('should connect to the database if disconnected', async () => {
  Object.defineProperty(mongoose.connection, 'readyState', { value: 0 })

  await connectDatabase()

  expect(mongoose.connect).toHaveBeenCalledWith(MONGODB_URI, expect.any(Object))
})

it('should wait if the database is disconnecting', async () => {
  Object.defineProperty(mongoose.connection, 'readyState', { value: 3 })
  const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

  connectDatabase()

  expect(setTimeoutSpy).toHaveBeenCalled()
})

it('should wait if the database is connecting', async () => {
  Object.defineProperty(mongoose.connection, 'readyState', { value: 2 })
  const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

  connectDatabase()

  expect(setTimeoutSpy).toHaveBeenCalled()
})

it('should resolve if the database is already connected', async () => {
  Object.defineProperty(mongoose.connection, 'readyState', { value: 1 })

  await expect(connectDatabase()).resolves.toBeUndefined()
})
