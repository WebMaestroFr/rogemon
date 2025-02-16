import { NextFunction, Request, Response, Router } from "express";

import { CardCount } from "../../database";
import { sendData } from "../../response";
import validateRequestBody from "../../middlewares/validateRequestBody";
import { assertUser } from "../../middlewares/verifyUser";

const cardCountRouter = Router();

cardCountRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      assertUser(req);
      const cardCounts = await CardCount.find({ userId: req.user._id });
      return sendData(res, 200, cardCounts);
    } catch (err) {
      next(err);
    }
  }
);

cardCountRouter.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cardCounts = await CardCount.find({ userId: req.params.userId });
      return sendData(res, 200, cardCounts);
    } catch (err) {
      next(err);
    }
  }
);

cardCountRouter.post(
  "/",
  validateRequestBody({
    collectionId: { label: "Collection ID", required: true },
    count: { label: "Count", required: true },
  }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      assertUser(req);
      const { collectionId, count } = req.body;
      const cardCount = await CardCount.findOneAndUpdate(
        {
          userId: req.user._id,
          collectionId,
        },
        { count },
        { new: true, upsert: true }
      );
      const cardCountResult = await cardCount.save();
      return sendData(res, 201, cardCountResult);
    } catch (err) {
      next(err);
    }
  }
);

export default cardCountRouter;
