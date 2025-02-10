import mongoose from "mongoose";

import UserSchema from "./models/user";

if (!process.env.MONGODB_URI) {
  throw new Error("The MONGODB_URI environment variable is undefined");
}

export default mongoose.connect(process.env.MONGODB_URI).catch(console.error);

export const User = mongoose.model("User", UserSchema);
