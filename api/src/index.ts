import * as dotenv from "dotenv";
import express from "express";

dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
});

import logRequest from "./middlewares/logRequest";
import handleError from "./middlewares/handleError";
import verifyUser from "./middlewares/verifyUser";

import apiRouter from "./routes";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.use(logRequest);

app.use(verifyUser);

const staticRootPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(staticRootPath));

app.use("/api", apiRouter);

app.use(handleError);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

export default app;
