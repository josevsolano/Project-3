<<<<<<< HEAD
// server/models/SessionRequest.js
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
=======
import mongoose from 'mongoose';

const sessionRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  dateScheduled: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  attendees: {
    type: Number,
    default: 0,
  },
  feedback: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
      comment: {
        type: String,
        required: true,
      },
      dateCreated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},
 { timestamps: true });

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  tutorId?: mongoose.Types.ObjectId;
  dateScheduled: Date;
  tags: string[];
  attendees: number;
  feedback: {
    userId: mongoose.Types.ObjectId;
    comment: string;
    dateCreated: Date;
  }[];
  createdAt: Date;
}

const Session = mongoose.model('Session', sessionRequestSchema);
export default Session;
>>>>>>> origin/main
