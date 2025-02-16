import mongoose from "mongoose";

export interface ICollection extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  expansionId: "A1" | "A1a" | "A2" | "P-A";
  countMap: Map<string, number>;
}

const CollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  expansionId: {
    type: String,
    required: true,
    enum: ["A1", "A1a", "A2", "P-A"],
  },
  countMap: { type: Map, of: Number, required: true },
});

export default CollectionSchema;
