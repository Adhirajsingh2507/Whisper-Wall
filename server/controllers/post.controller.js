import Post from '../models/Post.js';

export const getPosts = async (req, res) => {
  try {
    // Fetch posts sorted latest first, limit to prevent overload
    const posts = await Post.find().sort({ createdAt: -1 }).limit(100);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    // Already validated by validatePost middleware; schema enforces it too.
    const { message } = req.body;

    // Security: strip excessive whitespace
    const trimmed = message.trim().replace(/\s+/g, ' ');
    const profanityFiltered = filterProfanity(trimmed);

    const newPost = new Post({ message: profanityFiltered });
    await newPost.save();

    // Emit new post to all connected Socket.IO clients
    if (req.io) {
      req.io.emit('new-post', newPost);
    }

    res.status(201).json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- Profanity Filter ----------

const badWords = [
  'badword', 'spam', 'curse', 'hate', 'violence',
  'kill', 'die', 'stupid', 'idiot', 'loser',
];

function filterProfanity(text) {
  let filtered = text;
  badWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '****');
  });
  return filtered;
}
