import { type NextFunction, type Request, type Response } from "express";

import debug from "@api/utilities/debug";
import { sendError } from "@api/utilities/sendResponse";

export default function handleError(
  err: Error | string,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  debug.error(err);
  if (!res.headersSent) {
    return sendError(res, 500, "Internal server error");
  }
}
