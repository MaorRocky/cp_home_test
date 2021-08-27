import Post from '../models/post.models.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

export const createPost = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(401);
    throw new Error('Invalid body');
  }

  const { title, text, name } = req.body;
  const likes = { likersArray: [], likesCount: 0 };
  const post = await Post.create({
    title,
    text,
    name,
    likes,
  });

  if (post) {
    res.status(201).send({ message: 'post created', success: true, post });
  } else {
    res.status(400);
    throw new Error('Invalid post data');
  }
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.send({ posts, success: true });
});

export const getPostByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid id');
  }

  const post = await Post.findById(id);
  if (post) {
    res.send({ post, success: true });
  } else {
    res.status(500);
    throw new Error('something went wrong, couldnt fetch post by id');
  }
});

export const deletePostByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid id');
  }

  const post = await Post.findById(id);

  if (post) {
    await post.remove();
    res.send({ post, success: true, message: 'post was deleted' });
  } else {
    res.status(404);
    throw new Error('Post was not found');
  }
});

export const updatePostByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!req.body || !isIdValid) {
    res.status(400);
    throw new Error('Invalid id or invalid body');
  }

  const post = await Post.findById(id);
  const { title, text } = req.body;
  if (post) {
    post.title = title || post.title;
    post.text = text || post.text;

    const updatedPost = await post.save();

    res.send({ updatedPost, success: true });
  } else {
    res.status(500);
    throw new Error('Post was not found');
  }
});

export const getTrendingPosts = asyncHandler(async (req, res) => {
  let posts = await Post.find({});
  posts.sort((a, b) => {
    if (a.likes.likesCount === b.likes.likesCount) {
      return b.createdAt - a.createdAt;
    }

    return b.likes.likesCount - a.likes.likesCount;
  });

  res.send({ posts, success: true });
});
