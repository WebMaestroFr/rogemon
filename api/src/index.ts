import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";

dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
});

import authRouter from "./controllers/auth";
import userRouter from "./controllers/user";

const api = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
api.use(jsonMiddleware);

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(res.statusCode, req.method, req.url);
  next();
}
api.use(loggerMiddleware);

api.get("/", (req: Request, res: Response) => {
  res.send("Rogémon!");
});

api.use("/auth", authRouter);
api.use("/user", userRouter);

api.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

export default api;
