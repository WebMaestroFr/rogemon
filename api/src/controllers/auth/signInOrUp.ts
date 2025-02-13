import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../database";
import { JWT_SECRET } from "../../middlewares/verifyAuth";
import { sendError } from "../../response";

// Temporary mixed register and login
// Because I'm too lazy to verify emails just yet

export default async function handleSignInOrUp(
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response
) {
  const emailUser = await User.findOne({ email: req.body.email });
  if (emailUser) {
    // SignIn
    const isPasswordCorrect = await emailUser.comparePassword(
      req.body.password
    );
    if (!isPasswordCorrect) {
      return sendError(res, 401, "Invalid email or password");
    }
    const accessToken = jwt.sign({ userId: emailUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return sendError(res, 200, accessToken);
  }
  // SignUp
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
