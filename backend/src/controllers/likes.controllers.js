import mongoose from 'mongoose';
import Post from '../models/post.models.js';

export const likeAPost = async (req, res) => {
  const { id } = req.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    res
      .status(400)
      .send({ message: 'invalid request, bad ID', success: false });
  }

  try {
    const post = await Post.findById(id);
    console.log(post);
    post.likes = post.likes + 1;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'something went wrong', success: false });
  }

  res.send({ data, success: true });
};

export const unlikeAPost = async (req, res) => {
    const { id } = req.params;
    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid) {
      res
        .status(400)
        .send({ message: 'invalid request, bad ID', success: false });
    }
  
    try {
      const post = await Post.findById(id);
      console.log(post);
      post.likes = post.likes - 1;
      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'something went wrong', success: false });
    }
  
    res.send({ data, success: true });
  };
  