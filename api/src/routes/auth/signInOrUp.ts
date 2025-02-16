import { NextFunction, Request, Response } from "express";

import { User } from "../../database";
import { signToken } from "../../middlewares/verifyUser";
import { sendError, sendText } from "../../response";

// Temporary mixed register and login
// Because I'm too lazy to verify emails just yet

export default async function handleSignInOrUp(
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      // SignIn
      const isPasswordCorrect = await emailUser.comparePassword(password);
      if (!isPasswordCorrect) {
        return sendError(res, 401, "Invalid email or password");
      }
      const accessToken = signToken({
        userId: emailUser._id.toString(),
        email,
      });
      return sendText(res, 200, accessToken);
    }
    // SignUp
    const user = new User({ email, password });
    const userResult = await user.save();
    const accessToken = signToken({ userId: userResult._id.toString(), email });
    return sendText(res, 201, accessToken);
  } catch (err) {
    next(err);
  }
}
