import { NextFunction, Request, Response } from "express";
import chalk from "chalk";

export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const stdoutColumns = process.stdout.columns || 80;
  const stdoutPaddedString = " ".repeat(stdoutColumns - 1);
  function logRequest() {
    if (res.statusCode >= 500) {
      console.error(
        chalk.red(res.statusCode),
        req.method,
        chalk.italic(req.originalUrl)
      );
    } else if (res.statusCode >= 400) {
      console.warn(
        chalk.yellow(res.statusCode),
        req.method,
        chalk.italic(req.originalUrl)
      );
    } else if (res.statusCode >= 300) {
      const message = `${chalk.cyan(res.statusCode)} ${req.method} ${chalk.italic(req.originalUrl)}`;
      const paddedMessage = message + stdoutPaddedString.slice(message.length);
      process.stdout.write(`${paddedMessage}\r`);
    } else {
      console.log(
        chalk.green(res.statusCode),
        req.method,
        chalk.italic(req.originalUrl)
      );
    }
  }
  if (res.headersSent) {
    logRequest();
  } else {
    res.on("finish", logRequest);
  }
  return next();
}
