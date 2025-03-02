import { Document, Schema, Types } from "mongoose";

export interface ICollection extends Document {
  userId: Types.ObjectId;
  expansionId: "A1" | "A1a" | "A2" | "A2a";
  countMap: Map<string, number>;
}

const CollectionSchema = new Schema<ICollection>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expansionId: {
    type: String,
    required: true,
    enum: ["A1", "A1a", "A2"],
  },
  countMap: { type: Map, of: Number, required: true },
});

export default CollectionSchema;
