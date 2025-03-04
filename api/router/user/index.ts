import { Router } from "express";

import getUser from "./getUser";
import listUsers from "./listUsers";

const userRouter = Router();
userRouter.get("/", listUsers);
userRouter.get("/:id", getUser);

export default userRouter;
