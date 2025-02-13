import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../database";
import { JWT_SECRET } from "../../middlewares/verifyAuth";
import { sendError } from "../../response";

export default async function handleSignIn(
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response
) {
  const emailUser = await User.findOne({ email: req.body.email });
  if (!emailUser) {
    return sendError(res, 401, "Invalid email or password");
  }
  const isPasswordCorrect = await emailUser.comparePassword(req.body.password);
  if (!isPasswordCorrect) {
    return sendError(res, 401, "Invalid email or password");
  }
  const accessToken = jwt.sign({ userId: emailUser._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return sendError(res, 200, accessToken);
}
