import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../database";
import validateRequestBody from "../../utils/validateRequestBody";
import { JWT_SECRET } from "../../middlewares/auth";

export default async function handleSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body);
  try {
    validateRequestBody(req.body, {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
    });
  } catch (validationError) {
    res.status(412);
    return next(validationError);
  }
  try {
    const verifyEmail = await User.findOne({ email: req.body.email });
    if (verifyEmail) {
      res.status(403);
      return next("Email already used.");
    }
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    const result = await user.save();
    const accessToken = jwt.sign({ userId: result._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).send(accessToken);
    return next();
  } catch (err) {
    return next(err);
  }
}
