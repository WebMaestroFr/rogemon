import * as dotenv from "dotenv";
import express from "express";

dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
});

import logRequest from "./middlewares/logRequest";
import handleError from "./middlewares/handleError";
import verifyUser from "./middlewares/verifyUser";

import apiRouter from "./routes";

const app = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.use(logRequest);

app.use(verifyUser);

app.use("/api", apiRouter);

app.use("/", express.static("../../client/dist"));

app.use(handleError);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

export default app;
