import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { sendError } from "../response";

export default function handleError(
  err: Error | string,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof Error) {
    console.error(
      chalk.red(err.name),
      chalk.bold(err.message),
      err.stack
        ?.replace(`${err.name}: ${err.message}`, "")
        .split("\n")
        .filter((line) => line.includes("/node_modules/") === false)
        .join("\n")
    );
  } else {
    console.error(chalk.red("Error"), chalk.bold(err));
  }
  if (!res.headersSent) {
    return sendError(res, 500, "Internal server error");
  }
}
