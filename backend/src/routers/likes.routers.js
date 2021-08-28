import express from 'express';
import { likeAPost, unlikeAPost } from '../controllers/likes.controllers.js';
import { validIdHandler } from '../middlewares/errorMiddleWare.js';

const router = express.Router();

router.patch('/posts/like/:id', validIdHandler, likeAPost);
router.patch('/posts/unlike/:id', validIdHandler, unlikeAPost);

export default router;
