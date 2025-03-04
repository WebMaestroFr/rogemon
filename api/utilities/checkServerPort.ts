import { createServer } from 'net'

import debug from './debug'

export default async function checkServerPort(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = createServer().listen(port)
    server.on('listening', () => {
      server.close()
      resolve(false)
    })
    server.on('error', (err) => {
      if (err instanceof Error && err.message.includes('EADDRINUSE')) {
        resolve(true)
      } else {
        debug.error(err)
        reject(err)
      }
    })
  })
}
