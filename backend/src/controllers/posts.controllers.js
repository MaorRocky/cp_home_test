import Post from '../models/post.models.js';
import asyncHandler from 'express-async-handler';

const maxLimit = 10;

export const createPost = asyncHandler(async (req, res) => {
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

  const post = await Post.findById(id);
  const { title, text } = req.body;

  if (post) {
    post.title = title || post.title;
    post.text = text || post.text;

    if (post.title.length < 3 || post.title.length > 30) {
      throw new Error('invalid title');
    }
    if (post.text.length > 500) {
      throw new Error('invalid text');
    }

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
