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
      minLength: [3, 'minLength of title is 3'],
      maxLength: [30, 'minLength of title is 30'],
    },
    text: {
      type: String,
      required: true,
      maxLength: [500, 'minLength of title is 30'],
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
