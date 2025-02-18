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
      err.message,
      err.stack &&
        "\n" +
          err.stack
            .split("\n")
            .filter(
              (line) =>
                line.includes("at /workspace/") &&
                !line.includes("/node_modules/")
            )
            .filter((value, index, self) => self.indexOf(value) === index)
            .join("\n")
    );
  } else {
    console.error(chalk.red("✘"), err);
  }
  if (!res.headersSent) {
    return sendError(res, 500, "Internal server error");
  }
}
