import { NextFunction, Request, Response } from "express";

import { User } from "../../database";
import { signToken } from "../../middlewares/verifyUser";
import { sendError, sendText } from "../../response";
import { assertBody } from "../../middlewares/validateRequestBody";

export default async function handleSignIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertBody<{ email: string; password: string }>(req.body, res, {
      email: { label: "Email", required: true, email: true },
      password: { label: "Password", required: true, minLength: 6 },
    });
    const { email, password } = req.body;
    const emailUser = await User.findOne({ email });
    if (!emailUser) {
      return sendError(res, 401, "Invalid email or password");
    }
    const isPasswordCorrect = await emailUser.comparePassword(password);
    if (!isPasswordCorrect) {
      return sendError(res, 401, "Invalid email or password");
    }
    const accessToken = signToken({ userId: emailUser._id.toString(), email });
    return sendText(res, 200, accessToken);
  } catch (err) {
    next(err);
  }
}
