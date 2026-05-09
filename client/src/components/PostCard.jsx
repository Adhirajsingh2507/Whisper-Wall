/**
 * PostCard - Displays a single anonymous message with avatar, content, and timestamp.
 * First post is highlighted with a subtle animation.
 */
export default function PostCard({ post, isNew = false }) {
  const { message, createdAt } = post;
  const timeAgo = getTimeAgo(createdAt);
  const anonymousName = generateAnonymousName(post._id);
  const initials = anonymousName
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <div
      className={`glass-card rounded-2xl p-5 transition-all duration-300 hover:border-accent/30 ${
        isNew ? 'animate-bounce-in border-accent/20' : 'animate-fade-in'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ' +
            getGradientFromString(anonymousName)
          }
        >
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Username + time */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-pink-400 text-sm">
              {anonymousName}
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {timeAgo}
            </span>
          </div>

          {/* Message */}
          <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap break-words">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- Helpers ---- */

function getTimeAgo(dateInput) {
  if (!dateInput) return 'Just now';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Just now';

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function generateAnonymousName(seed) {
  const adjectives = [
    'Curious',
    'Silent',
    'Dreamy',
    'Wandering',
    'Mystic',
    'Hidden',
    'Whispering',
    'Enigmatic',
    'Shy',
    'Night',
    'Moonlit',
    'Fading',
    'Shadow',
    'Flickering',
    'Starry',
  ];
  const nouns = [
    'Soul',
    'Ghost',
    'Spirit',
    'Nebula',
    'Phantom',
    'Echo',
    'Comet',
    'Nightingale',
    'Wanderer',
    'Drifter',
    'Observer',
    'Whisper',
    'Dream',
    'Spark',
    'Raven',
  ];

  if (!seed) return 'Anonymous';

  // Simple hash for deterministic name generation from seed
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hashAbs = Math.abs(hash);
  const adj = adjectives[hashAbs % adjectives.length];
  const noun = nouns[(hashAbs >> 3) % nouns.length];
  return `${adj} ${noun}`;
}

function getGradientFromString(str) {
  const gradients = [
    'bg-gradient-to-br from-cyan-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600',
  ];
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + (hash << 5) - hash;
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
