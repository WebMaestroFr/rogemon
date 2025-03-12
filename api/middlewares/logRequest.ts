import chalk from 'chalk'
import { type NextFunction, type Request, type Response } from 'express'

import debug from '@api/utilities/debug'

export default function logRequest(req: Request, res: Response, next: NextFunction) {
  function logRequest() {
    if (res.statusCode >= 500) {
      debug.log(
        chalk.red(chalk.bold('✘', res.statusCode), req.method),
        chalk.italic(req.originalUrl),
        chalk.dim.red(res.statusMessage),
      )
    } else if (res.statusCode >= 400) {
      debug.log(
        chalk.yellow(chalk.bold('✘', res.statusCode), req.method),
        chalk.italic(req.originalUrl),
        chalk.dim.yellow(res.statusMessage),
      )
    } else if (res.statusCode >= 300) {
      debug.log(
        chalk.cyan(chalk.bold('•', res.statusCode), req.method),
        chalk.italic(req.originalUrl),
        chalk.dim.cyan(res.statusMessage),
      )
    } else {
      debug.log(
        chalk.green(chalk.bold('✔', res.statusCode), req.method),
        chalk.italic(req.originalUrl),
        chalk.dim.green(res.statusMessage),
      )
    }
    if (process.env.NODE_ENV === 'development') {
      if (req.body && Object.keys(req.body).length > 0) {
        debug.log(chalk.dim(JSON.stringify(req.body)))
      }
    }
  }
  try {
    if (res.headersSent) {
      logRequest()
    } else {
      res.on('finish', logRequest)
    }
    next()
  } catch (error) {
    next(error)
  }
}
