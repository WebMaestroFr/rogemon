import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../../database";
import validateRequestBody from "../../utils/validateRequestBody";
import { JWT_SECRET } from "../../middlewares/auth";

// Temporary mixed register and login
// Because I'm too lazy to verify emails just yet

export default async function handleSignInOrUp(
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
    res.status(412);
    return next(validationError);
  }
  try {
    const emailUser = await User.findOne({ email: req.body.email });
    if (emailUser) {
      const isPasswordCorrect = emailUser.comparePassword(req.body.password);
      if (!isPasswordCorrect) throw "Authentication failed";
      const accessToken = jwt.sign({ userId: emailUser._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).send(accessToken);
      return next();
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
