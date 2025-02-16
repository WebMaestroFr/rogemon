import * as dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
});

import logRequest from "./middlewares/logRequest";
import handleError from "./middlewares/handleError";
import verifyUser from "./middlewares/verifyUser";

import apiRouter from "./routes";

const api = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
api.use(jsonMiddleware);

api.use(logRequest);

api.use(verifyUser);

api.use("/api", apiRouter);

api.get("/", (_req: Request, res: Response) => {
  res.send("Rogémon!");
});

api.use(handleError);

api.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

export default api;
