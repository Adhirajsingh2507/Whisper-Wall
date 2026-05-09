import { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import socket from '../socket/index.js';
import { useSocket } from './useSocket.js';

/**
 * Custom hook for managing posts.
 * Handles fetching, auto-refreshing via polling, and real-time updates via Socket.IO.
 */
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Auto-refresh feed every 10 seconds as a fallback
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time: prepend new post when server emits 'new-post'
  useSocket('new-post', (newPost) => {
    setPosts((prev) => {
      // Avoid duplicates
      const exists = prev.find((p) => p._id === newPost._id);
      if (exists) return prev;
      return [newPost, ...prev];
    });
  });

  // Post a new message
  const createPost = async (message) => {
    const response = await api.post('/posts', { message });
    return response.data;
  };

  return { posts, loading, error, fetchPosts, createPost };
};
