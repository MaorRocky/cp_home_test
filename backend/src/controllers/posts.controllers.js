import Post from '../models/post.models.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const maxLimit = 10;

export const createPost = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(401);
    throw new Error('Invalid body');
  }

  const { title, text, author } = req.body;

  const post = await Post.create({
    title,
    text,
    author,
  });

  if (post) {
    res.status(201).send({ message: 'post created', success: true, post });
  } else {
    res.status(400);
    throw new Error('Invalid post data');
  }
});

export const getPosts = asyncHandler(async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || maxLimit;
  limit = Math.min(limit, maxLimit);

  const options = {
    page,
    limit,
    sort: { createdAt: -1 },
  };

  const posts = await Post.paginate({}, options);
  if (posts) {
    res.send({ posts, success: true });
  } else {
    res.status(500);
    throw new Error('Invalid get posts request');
  }
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
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || maxLimit;
  limit = Math.min(limit, maxLimit);

  const options = {
    page,
    limit,
    sort: { likesCount: -1, createdAt: -1 },
  };

  const posts = await Post.paginate({}, options);
  if (posts) {
    res.send({ posts, success: true });
  } else {
    res.status(500);
    throw new Error('Trending posts were not fetched');
  }
});

export const getTrendingPostsByAuthor = asyncHandler(async (req, res) => {
  const { author } = req.params;

  if (!author) {
    res.status(400);
    throw new Error('Invalid author');
  }
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || maxLimit;
  limit = Math.min(limit, maxLimit);

  const options = {
    page,
    limit,
    sort: { likesCount: -1, createdAt: -1 },
  };

  const posts = await Post.paginate({ author: author }, options);
  if (posts) {
    res.send({ posts, success: true });
  } else {
    res.status(500);
    throw new Error('Trending posts were not fetched');
  }
});
