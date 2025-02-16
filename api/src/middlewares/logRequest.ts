import { NextFunction, Request, Response } from "express";
import chalk from "chalk";

export default function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      console.log(
        chalk.cyan(res.statusCode),
        req.method,
        chalk.italic(req.originalUrl)
      );
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
