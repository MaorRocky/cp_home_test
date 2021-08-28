import express from 'express';
import {
  createPost,
  getPosts,
  getPostByID,
  deletePostByID,
  updatePostByID,
  getTrendingPosts,
} from '../controllers/posts.controllers.js';
import { validIdHandler } from '../middlewares/errorMiddleWare.js';
const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/trendings', getTrendingPosts);

router.get('/posts/:id', validIdHandler, getPostByID);
router.post('/posts', createPost);
router.delete('/posts/:id', validIdHandler, deletePostByID);
router.patch('/posts/:id', validIdHandler, updatePostByID);

export default router;
