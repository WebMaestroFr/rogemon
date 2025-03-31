import mongoose from 'mongoose'
import type { ExpansionId } from '../../env'

export interface ICollection extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  expansionId: ExpansionId
  countMap: Map<string, number>
  statusMap: Map<string, null | 'ask' | 'offer'>
}

const CollectionSchema = new mongoose.Schema<ICollection>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expansionId: {
    type: String,
    required: true,
    enum: ['A1', 'A1a', 'A2', 'A2a', 'A2b'],
  },
  countMap: { type: Map, of: Number, required: true },
  statusMap: { type: Map, of: String, enum: ['ask', 'offer', null], default: null },
})

export default mongoose.model<ICollection>('Collection', CollectionSchema)
