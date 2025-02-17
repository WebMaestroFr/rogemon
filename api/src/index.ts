import * as dotenv from "dotenv";
import express from "express";

dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
});

import logRequest from "./middlewares/logRequest";
import handleError from "./middlewares/handleError";
import verifyUser from "./middlewares/verifyUser";

import apiRouter from "./routes";
import chalk from "chalk";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.use(logRequest);

app.use(verifyUser);

app.use("/api", apiRouter);

app.use(handleError);

if (process.env.NODE_ENV === "dev") {
  const ascii =
    "\
 ____               __                       _  \n\
|  _ \\ ___   __ _  /_/ _ __ ___   ___  _ __ | | \n\
| |_) / _ \\ / _` |/ _ \\ '_ ` _ \\ / _ \\| '_ \\| | \n\
|  _ < (_) | (_| |  __/ | | | | | (_) | | | |_| \n\
|_| \\_\\___/ \\__, |\\___|_| |_| |_|\\___/|_| |_(_) \n\
            |___/                              \n";
  const signature = "Rogémon Dev API\n";
  console.log(
    chalk.blue(ascii.slice(0, -signature.length)) + chalk.yellow(signature)
  );

  const staticRootPath = path.resolve(__dirname, "../../client/dist");
  console.log(chalk.green("✔"), `Serving static files from ${staticRootPath}`);
  app.use(express.static(staticRootPath));

  app.listen(port, () => {
    console.log(
      chalk.green("✔"),
      `API running at ${chalk.underline(`http://localhost:${port}`)}`
    );
  });
}

export default app;
