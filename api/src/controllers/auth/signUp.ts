import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../database";
import { JWT_SECRET } from "../../middlewares/verifyAuth";
import { sendError } from "../../response";

export default async function handleSignUp(
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response
) {
  const verifyEmail = await User.findOne({ email: req.body.email });
  if (verifyEmail) {
    return sendError(res, 409, "Email already used");
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  const userResult = await user.save();
  const accessToken = jwt.sign({ userId: userResult._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return sendError(res, 201, accessToken);
}
