import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
