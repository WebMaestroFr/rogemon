import { NextFunction, Request, Response, Router } from "express";

import User from "../database/models/user";

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find();
  res.status(200).json(users);
  return next();
});

userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
      return next();
    }
    const error = new Error("User not found");
    return next(error);
  }
);

export default userRouter;
