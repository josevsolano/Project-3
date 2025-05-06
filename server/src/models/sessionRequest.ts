import mongoose from 'mongoose';

const sessionRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
    default: 'PENDING',
  },
}, {
  timestamps: true, // adds createdAt / updatedAt
});

export default mongoose.model('SessionRequest', sessionRequestSchema);
