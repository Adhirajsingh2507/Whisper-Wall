import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import postRoutes from './routes/post.routes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
// Trust the first proxy (Vercel/Render) so rate-limit sees the real client IP.
app.set('trust proxy', 1);

// CORS Configuration - allow cross-origin requests from frontend
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Socket.IO instance is only set in local/long-running mode (see bottom).
// On Vercel serverless it stays null and the controller skips emits;
// the client's 10s polling fallback covers real-time there.
let io = null;
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check (no DB needed) — register before the DB gate below.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Cached Mongoose connection, reused across serverless invocations.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whisper-wall';
let connPromise = null;
function connectDB() {
  if (connPromise) return connPromise;
  connPromise = mongoose
    .connect(MONGODB_URI)
    .then((m) => {
      console.log('Connected to MongoDB');
      return m;
    })
    .catch((err) => {
      // Reset so the next request retries instead of caching a failed connect.
      connPromise = null;
      throw err;
    });
  return connPromise;
}

// Ensure the DB is connected before any /api/posts request (serverless-safe).
app.use('/api/posts', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(503).json({ success: false, message: 'Database unavailable' });
  }
});

// API Routes
app.use('/api/posts', postRoutes);

// Local / long-running mode: real HTTP server + Socket.IO live updates.
// Skipped on Vercel (serverless), where `app` is exported as the handler.
if (!process.env.VERCEL) {
  const httpServer = createServer(app);
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        console.warn(`Socket.IO CORS blocked origin: ${origin}`);
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  const PORT = process.env.PORT || 5000;
  connectDB().catch((err) =>
    console.error('Initial MongoDB connection error:', err.message)
  );
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
