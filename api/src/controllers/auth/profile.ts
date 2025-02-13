import { Request, Response } from "express";

import { sendData, sendError } from "../../response";

export default async function handleProfile(_req: Request, res: Response) {
  if (res.locals.user) {
    return sendData(res, 200, res.locals.user);
  }
  return sendError(res, 401, "User is not authenticated");
}
