import type { Response } from 'express'

export function sendText(res: Response, status: number, text: string) {
  res.status(status)
  res.send(text)
}

export function sendError(res: Response, status: number, message: string) {
  res.status(status)
  res.send(message)
}

export function sendData<T>(res: Response, status: number, data: T) {
  res.status(status)
  res.json(data)
}

export default { sendText, sendError, sendData }
