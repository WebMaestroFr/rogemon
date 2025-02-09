import { NextFunction, Request, Response } from "express";

export default async function handleProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.locals.user) {
    res.status(200).json(res.locals.user);
    return next();
  }
  res.status(401);
  return next("User is not authenticated");
}
