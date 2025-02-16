import { Response } from "express";

export function sendText(res: Response, status: number, text: string) {
  res.status(status).send(text);
}

export function sendError(
  res: Response,
  status: number,
  error: Error | string
) {
  const message = error instanceof Error ? error.message : error;
  res.status(status).send(message);
}

export function sendData<T>(res: Response, status: number, data: T) {
  res.status(status).json(data);
}

export default { sendText, sendError, sendData };
