import mongoose from "mongoose";

const CardCountSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  collectionId: { type: String, required: true },
  count: { type: Map, of: Number, required: true },
});

export default CardCountSchema;
