import express, { Request, Response } from "express";

import authRouter from "./controllers/auth";
import userRouter from "./controllers/user";

const api = express();
const port = process.env.PORT || 3000;

api.get("/", (req: Request, res: Response) => {
  res.send("Rogémon!");
});

api.use("/auth", authRouter);
api.use("/user", userRouter);

api.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

export default api;
