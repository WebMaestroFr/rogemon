import chalk from "chalk";
import { type Express } from "express";

import checkServerPort from "./checkServerPort";
import debug from "./debug";
import serveStaticFiles from "./serveStaticFiles";

export default function serveDevelopment(
  app: Express,
  ports: { api: number; client: number },
) {
  return new Promise<void>((resolve) => {
    app.listen(ports.api, async () => {
      debug.success(
        `Development ${chalk.bold("API")} is running at ${chalk.underline(`http://localhost:${ports.api}/api`)}`,
      );
      await redirectToDevelopmentClient(app, ports.api, ports.client);
      resolve();
    });
  });
}

async function redirectToDevelopmentClient(
  app: Express,
  apiPort: number,
  clientPort: number,
) {
  const clientIsRunning = await checkServerPort(clientPort);
  if (clientIsRunning) {
    debug.success(
      `Development ${chalk.bold("client")} is running at ${chalk.underline(`http://localhost:${clientPort}`)}`,
    );
    app.get("/", (_req, res, next) => {
      debug.info(
        `Redirecting from development ${chalk.italic("api")} root at ${chalk.underline(`http://localhost:${chalk.bold(apiPort)}`)} to development ${chalk.italic("client")} at ${chalk.underline(`http://localhost:${chalk.bold(clientPort)}`)}`,
      );
      res.redirect(`http://localhost:${clientPort}`);
      next();
    });
  } else {
    debug.warn(`Development ${chalk.bold("client")} is not running`);
    serveStaticFiles(app);
  }
}
