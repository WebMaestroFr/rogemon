import mongoose from "mongoose";

import CollectionSchema, { ICollection } from "./schemas/collection";
import UserSchema, { IUser } from "./schemas/user";

if (!process.env.MONGODB_URI) {
  throw new Error("The MONGODB_URI environment variable is undefined");
}

export const ObjectId = mongoose.Types.ObjectId;

export default mongoose.connect(process.env.MONGODB_URI).catch(console.error);

export const Collection = mongoose.model<ICollection>(
  "Collection",
  CollectionSchema
);
export const User = mongoose.model<IUser>("User", UserSchema);
