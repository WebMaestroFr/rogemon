import mongoose from "mongoose";

import CardCountSchema from "./schemas/cardCount";
import UserSchema, { IUser } from "./schemas/user";

if (!process.env.MONGODB_URI) {
  throw new Error("The MONGODB_URI environment variable is undefined");
}

export default mongoose.connect(process.env.MONGODB_URI).catch(console.error);

export const CardCount = mongoose.model("CardCount", CardCountSchema);
export const User = mongoose.model<IUser>("User", UserSchema);
