import { Response } from "express";

export function sendError(
  res: Response,
  status: number,
  error: Error | string
) {
  const message = error instanceof Error ? error.message : error;
  res.status(status).send(message);
}

export function sendData(res: Response, status: number, data: unknown) {
  res.status(status).json(data);
}
