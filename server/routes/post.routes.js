import express from 'express';
import { getPosts, createPost } from '../controllers/post.controller.js';

const router = express.Router();

// GET /api/posts - fetch all posts
router.get('/', getPosts);

// POST /api/posts - create a new anonymous post
router.post('/', createPost);

export default router;
