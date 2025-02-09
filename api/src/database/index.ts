import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("The MONGODB_URI environment variable is undefined");
}

export default mongoose.connect(process.env.MONGODB_URI).catch(console.error);
