import { Router } from "express";

import authRouter from "./auth";
import collectionRouter from "./collection";
import userRouter from "./user";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/collection", collectionRouter);
apiRouter.use("/user", userRouter);

export default apiRouter;
