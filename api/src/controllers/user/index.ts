import { NextFunction, Request, Response, Router } from "express";

import { User } from "../../database";
import { sendData, sendError } from "../../response";

const userRouter = Router();

userRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await User.find();
      return sendData(res, 200, users);
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        return sendData(res, 200, user);
      }
      return sendError(res, 404, "User not found");
    } catch (err) {
      next(err);
    }
  }
);

export default userRouter;
