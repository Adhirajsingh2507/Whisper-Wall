import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true,
    maxlength: [300, 'Message cannot exceed 300 characters'],
    minlength: [1, 'Message cannot be empty'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index for efficient latest-first queries
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;
