import mongoose from 'mongoose'

export interface ICollection extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  expansionId: 'A1' | 'A1a' | 'A2' | 'A2a' | 'A2b'
  countMap: Map<string, number>
}

const CollectionSchema = new mongoose.Schema<ICollection>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expansionId: {
    type: String,
    required: true,
    enum: ['A1', 'A1a', 'A2', 'A2a', 'A2b'],
  },
  countMap: { type: Map, of: Number, required: true },
})

export default mongoose.model<ICollection>('Collection', CollectionSchema)
