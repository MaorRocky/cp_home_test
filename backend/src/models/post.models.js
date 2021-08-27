import mongoose from 'mongoose';

const LikesSchema = mongoose.Schema({
  likersArray: {
    type: [String],
  },
  likesCount: {
    type: Number,
  },
});

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
    likes: LikesSchema,
  },

  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
