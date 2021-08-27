import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostByID,
  deletePostByID,
  updatePostByID,
  getTrendingPosts
} from '../controllers/posts.controllers.js';

const router = express.Router();

router.get('/posts', getAllPosts);
router.get('/posts/trendings', getTrendingPosts);
router.get('/posts/:id', getPostByID);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePostByID);
router.patch('/posts/:id', updatePostByID);

export default router;
