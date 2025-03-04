import { type NextFunction, type Request, type Response } from "express";

import User from "@api/models/user";
import { verifyToken } from "@api/utilities/userToken";

export default async function verifyUser(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      const jwtPayload = verifyToken(token);
      req.user = await User.findById(jwtPayload.userId);
    }
    next();
  } catch (err) {
    next(err);
  }
}
