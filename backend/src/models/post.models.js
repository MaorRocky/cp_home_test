import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      min: [3, 'Title should have more than 3 characters'],
      max: [30, 'Title should have no more than 30 characters'],
      required: [true, 'Title is required'],
    },
    text: {
      type: String,
      min: [5, 'text should have more than 5 characters'],
      max: [300, 'text should have no more than 300 characters'],
      required: [true, 'text is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
