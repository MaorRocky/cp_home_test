import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
      maxLength: [500, 'max of text is 500'],
    },
    author: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    userIdArray: {
      type: [String],
      default: [],
    },
  },

  { timestamps: true }
);

PostSchema.index({ likesCount: -1, createdAt: -1 });
PostSchema.plugin(mongoosePaginate);

export default mongoose.model('Post', PostSchema);
