import express from 'express';
import { likeAPost, unlikeAPost } from '../controllers/likes.controllers.js';
const router = express.Router();

router.put('/posts/like/:id', likeAPost);
router.put('/posts/unlike/:id', unlikeAPost);

export default router;
