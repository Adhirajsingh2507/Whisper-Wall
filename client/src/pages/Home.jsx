import { usePosts } from '../hooks/usePosts.js';
import { useToast } from '../App.jsx';
import Navbar from '../components/Navbar.jsx';
import PostForm from '../components/PostForm.jsx';
import PostList from '../components/PostList.jsx';

/**
 * Home Page - Main layout for Whisper Wall.
 * Composes the Navbar, PostForm, and PostList.
 */
export default function Home() {
  const { posts, loading, error, fetchPosts, createPost } = usePosts();
  const { addToast } = useToast();

  const handleCreate = async (message) => {
    try {
      await createPost(message);
      addToast('Your whisper has been posted!', 'success');
    } catch (err) {
      console.error('Create post error:', err);
      addToast(
        err.response?.data?.message || 'Failed to post message',
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onRefresh={fetchPosts} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 mb-3">
            Whisper Wall
          </h1>
          <p className="text-gray-400 text-lg">
            Share your thoughts, anonymously.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-pink-400">
                {posts.length}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Whispers
              </span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-400">
                Live
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Feed
              </span>
            </div>
          </div>
        </div>

        {/* Post Form */}
        <PostForm onSubmit={handleCreate} />

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-dark-700" />
          <span className="text-gray-500 text-sm">Recent Whispers</span>
          <div className="flex-1 h-px bg-dark-700" />
        </div>

        {/* Post List */}
        <PostList posts={posts} loading={loading} error={error} />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm">
        Made with — no cookies, no tracking, just whispers.
      </footer>
    </div>
  );
}
