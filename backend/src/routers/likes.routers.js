import express from 'express';
import { likeAPost, unlikeAPost } from '../controllers/likes.controllers.js';
const router = express.Router();

router.patch('/posts/like/:id', likeAPost);
router.patch('/posts/unlike/:id', unlikeAPost);

export default router;
