import express, { type Express } from 'express'

import debug from './debug'

export default function serveStaticFiles(app: Express, staticRootPath = '/workspace/dist/static') {
  debug.success(`Serving static files from ${staticRootPath}`)
  const staticMiddleware = express.static(staticRootPath)
  app.use(staticMiddleware)
}
