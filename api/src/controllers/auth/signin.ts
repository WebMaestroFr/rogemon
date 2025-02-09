import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../../database/models/user";
import { JWT_SECRET } from "../../middlewares/auth";
import { validateRequestBody } from "../../utils/validator";

export default async function handleSignin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    validateRequestBody(req.body, {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
    });
  } catch (validationError) {
    res.status(412).json({ message: validationError });
    return next();
  }
  try {
    const emailUser = await User.findOne({ email: req.body.email });
    if (!emailUser) throw new Error("Authentication failed");
    const isPasswordCorrect = emailUser.comparePassword(req.body.password);
    if (!isPasswordCorrect) throw new Error("Authentication failed");
    const accessToken = jwt.sign({ userId: emailUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      accessToken,
      message: "Authentication successful",
    });
    return next();
  } catch (err) {
    return next(err);
  }
}
