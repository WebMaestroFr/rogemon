import { NextFunction, Request, Response } from "express";
import User from "../../database/models/user";
import validateRequestBody from "../../utils/validateRequestBody";

export default async function handleSignup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    validateRequestBody(req.body, {
      name: { required: true, minLength: 3 },
      email: { required: true, email: true },
      password: { required: true, minLength: 6 },
    });
  } catch (validationError) {
    res.status(412).json({ message: validationError });
    return next();
  }
  try {
    const verifyEmail = await User.findOne({ email: req.body.email });
    if (verifyEmail) {
      res.status(403);
      return next("Email already used.");
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const result = await user.save();
    res.status(201).json(result);
    return next();
  } catch (err) {
    return next(err);
  }
}
