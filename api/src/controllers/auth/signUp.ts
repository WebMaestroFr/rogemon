import { NextFunction, Request, Response } from "express";

import { User } from "../../database";
import { signToken } from "../../middlewares/verifyUser";
import { sendError, sendText } from "../../response";

export default async function handleSignUp(
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const verifyEmail = await User.findOne({ email });
    if (verifyEmail) {
      return sendError(res, 409, "Email already used");
    }
    const user = new User({ email, password });
    const userResult = await user.save();
    const accessToken = signToken({ userId: userResult._id.toString(), email });
    return sendText(res, 201, accessToken);
  } catch (err) {
    next(err);
  }
}
