import PostCard from './PostCard.jsx';

/**
 * PostList - Displays the list of all anonymous messages.
 * Handles loading skeleton, empty state, and populated list.
 */
export default function PostList({ posts, loading, error }) {
  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3.464L13.732 4.464c-.928-1.667-2.464-1.667-3.464 0L3.732 17.464C3.002 19.167 4.076 20 5.732 20z"
            />
          </svg>
        </div>
        <p className="text-red-300 font-medium">{error}</p>
        <p className="text-gray-500 text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-gray-300 font-medium">No whispers yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Be the first to share an anonymous thought!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostCard
          key={post._id || post.id || index}
          post={post}
          isNew={index === 0}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for posts while fetching data.
 */
function PostSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-dark-700 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-32 h-4 bg-dark-700 rounded" />
            <div className="w-16 h-3 bg-dark-700 rounded" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-3 bg-dark-700 rounded" />
            <div className="w-3/4 h-3 bg-dark-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
