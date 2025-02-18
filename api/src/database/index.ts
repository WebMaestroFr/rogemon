import mongoose from "mongoose";

import CollectionSchema, { ICollection } from "./schemas/collection";
import UserSchema, { IUser } from "./schemas/user";
import chalk from "chalk";

if (!process.env.MONGODB_URI) {
  throw new Error("The MONGODB_URI environment variable is undefined");
}

export default mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 60000,
  })
  .then(() => console.log(chalk.green("✔"), "Connected to MongoDB database"))
  .catch((err) =>
    console.error(chalk.red("✖"), "Error connecting to MongoDB database:", err)
  );

export const Collection = mongoose.model<ICollection>(
  "Collection",
  CollectionSchema
);
export const User = mongoose.model<IUser>("User", UserSchema);

export type { ICollection, IUser };
