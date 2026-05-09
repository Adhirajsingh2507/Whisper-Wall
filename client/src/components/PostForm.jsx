import { useState } from 'react';

const MAX_LENGTH = 300;

/**
 * PostForm - Writable text area for submitting anonymous messages.
 * Features character counter, length warning, and validation.
 */
export default function PostForm({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = message.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const isEmpty = message.trim().length === 0;
  const canSubmit = !isEmpty && !isOverLimit && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    await onSubmit(message.trim());
    setMessage('');
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setMessage(value);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={message}
            onChange={handleChange}
            placeholder="What's on your mind? Share an anonymous thought..."
            className="w-full min-h-[120px] p-4 bg-dark-900/50 border border-dark-700 rounded-xl
              text-gray-200 placeholder-gray-500 resize-none outline-none
              focus:border-accent focus:ring-1 focus:ring-accent/30
              transition-all duration-200 leading-relaxed"
            disabled={isSubmitting}
          />
        </div>

        {/* Character counter (hidden on very small screens) */}
        <div className="hidden sm:block text-xs text-gray-500 -mt-2 ml-1">
          <span
            className={
              isOverLimit
                ? 'text-red-400'
                : charCount > MAX_LENGTH * 0.85
                  ? 'text-yellow-400'
                  : ''
            }
          >
            {charCount}
          </span>
          / {MAX_LENGTH}
        </div>

        {/* Mobile counter */}
        <div className="sm:hidden text-xs text-gray-500 -mt-2 ml-1">
          <span className={isOverLimit ? 'text-red-400' : ''}>{charCount}</span>{' '}
          / {MAX_LENGTH}
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            No sign-up needed. Just share your thoughts.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium
              rounded-xl transition-all duration-200 disabled:opacity-50
              disabled:cursor-not-allowed disabled:hover:bg-accent
              shadow-lg shadow-accent/20 hover:shadow-accent/30
              flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Posting...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Whisper
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
