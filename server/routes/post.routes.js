import express from 'express';
import rateLimit from 'express-rate-limit';
import { getPosts, createPost } from '../controllers/post.controller.js';
import { validatePost } from '../middleware/validate.js';

const router = express.Router();

// Throttle posting to curb spam: 10 posts per minute per IP.
// ponytail: in-memory store, swap for a Redis store if running multiple instances.
const postLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many posts. Please slow down and try again shortly.',
  },
});

// GET /api/posts - fetch all posts
router.get('/', getPosts);

// POST /api/posts - create a new anonymous post
router.post('/', postLimiter, validatePost, createPost);

export default router;
