import * as dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";

import authRouter from "./controllers/auth";
import userRouter from "./controllers/user";

const api = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
api.use(jsonMiddleware);

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.method, req.url, res.statusCode);
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
