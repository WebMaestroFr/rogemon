import { type Request, type Response } from "express";

import { type IUser } from "@api/models/user";
import { sendError } from "@api/utilities/sendResponse";

export default function assertRequestUser(
  user: Request["user"],
  res: Response,
): asserts user is IUser {
  if (!user) {
    sendError(res, 401, "User is not authenticated");
    throw "User is not authenticated";
  }
}
