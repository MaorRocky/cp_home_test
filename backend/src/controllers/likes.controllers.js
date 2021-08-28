import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Post from '../models/post.models.js';

export const likeAPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.query;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    res.status(400);
    throw new Error('Invalid id');
  }
  if (!user) {
    res.status(400);
    throw new Error('Invalid user id');
  }

  const post = await Post.findById(id);

  if (post) {
    if (post.userIdArray.includes(user)) {
      res.status(500);
      throw new Error(`${user} already liked this post`);
    } else {
      post.userIdArray.unshift(user);
      post.likesCount = post.likesCount + 1;
      const updatedPost = await post.save();
      res.send({ updatedPost, success: true });
    }
  } else {
    res.status(500);
    throw new Error('something went wrong, couldnt fetch post by id');
  }
});

export const unlikeAPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req.query;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  
  if (!isIdValid) {
    res.status(400);
    throw new Error('Invalid id');
  }
  if (!user) {
    res.status(400);
    throw new Error('Invalid user id');
  }

  const post = await Post.findById(id);
  if (post) {
    if (post.userIdArray.includes(user)) {
      post.userIdArray = post.userIdArray.filter((like) => like !== user);
      post.likesCount = post.likesCount - 1;
      const updatedPost = await post.save();
      res.send({ updatedPost, success: true });
    } else {
      res.send({
        success: false,
        message: `user ${user} didnt like this post, hence he cannot unlike it`,
        post,
      });
    }
  } else {
    res.status(500);
    throw new Error('something went wrong, couldnt fetch post by id');
  }
});
