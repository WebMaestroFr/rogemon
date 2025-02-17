import { NextFunction, Request, Response } from "express";
import { User } from "../../database";
import { sendData } from "../../response";
import { assertUser } from "../../middlewares/verifyUser";

import { Router } from "express";

const tradeRouter = Router();

export async function listByUserEmails(
  req: Request<unknown, unknown, { userEmails: string[] }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    assertUser(req as Request, res);
    const { userEmails } = req.body;
    const users = await User.find({ email: { $in: userEmails } });
    const userIds = users.map((user) => user._id);
    // TODO
    return sendData(res, 200, [
      {
        key: "A1-001/A1-002",
        cards: [
          { userId: userIds[0], cardId: "001", expansionId: "A1" },
          { userId: userIds[1], cardId: "002", expansionId: "A1" },
        ],
        priority: 1,
      },
    ]);
  } catch (err) {
    next(err);
  }
}

tradeRouter.post("/", listByUserEmails);

export default tradeRouter;
