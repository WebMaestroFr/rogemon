import { NextFunction, Request, Response } from "express";

import { User } from "../../database";
import { signToken } from "../../middlewares/verifyUser";
import { sendError, sendText } from "../../response";
import { assertBody } from "../../middlewares/validateRequestBody";

export default async function handleSignUp(
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
