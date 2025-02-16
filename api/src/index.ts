import * as dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
});

import authRouter from "./controllers/auth";
import cardCountRouter from "./controllers/cardCount";
import userRouter from "./controllers/user";
import logRequest from "./middlewares/logRequest";
import handleError from "./middlewares/handleError";
import verifyUser from "./middlewares/verifyUser";

const api = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
api.use(jsonMiddleware);

api.use(verifyUser);

api.use("/auth", authRouter);
api.use("/card-count", cardCountRouter);
api.use("/user", userRouter);

api.get("/", (_req: Request, res: Response) => {
  res.send("Rogémon!");
});

api.use(logRequest);

api.use(handleError);

api.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

export default api;
