import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    comments: mongoose.Types.ObjectId[];
}

const PostSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
    { timestamps: true }
);

PostSchema.pre('find', function () {
    this.populate('author').populate('comments');
});

PostSchema.pre('findOne', function () {
    this.populate('author').populate('comments');
});

export default mongoose.model<IPost>('Post', PostSchema);