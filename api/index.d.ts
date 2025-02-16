import type { IUser } from "./src/database/schemas/user";

declare module "express-serve-static-core" {
  interface Request {
    body?: { [key: string]: string };
    user?: IUser | null;
  }
}
