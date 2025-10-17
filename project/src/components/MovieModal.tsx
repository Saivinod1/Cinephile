import { useState } from 'react';
import { X, Eye, EyeOff, Heart, AlertTriangle } from 'lucide-react';
import { Movie, Review } from '../types';
import { useReviews } from '../hooks/useMovies';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  onToggleWatched: (id: string, watched: boolean) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
}

export function MovieModal({
  movie,
  onClose,
  onToggleWatched,
  onToggleFavorite
}: MovieModalProps) {
  const { reviews, addReview } = useReviews(movie.id);
  const [reviewText, setReviewText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revealedReviews, setRevealedReviews] = useState<Set<string>>(new Set());

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || submitting) return;

    try {
      setSubmitting(true);
      await addReview(reviewText.trim(), isSpoiler);
      setReviewText('');
      setIsSpoiler(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRevealReview = (reviewId: string) => {
    setRevealedReviews(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#232323] rounded-lg max-w-4xl w-full my-8 shadow-2xl">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-[#181818]/90 hover:bg-[#181818] text-[#FAFAFA] rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col md:flex-row gap-6 p-6">
            <div className="md:w-1/3">
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div className="md:w-2/3 flex flex-col">
              <h2 id="modal-title" className="text-3xl font-bold text-[#FAFAFA] mb-2">
                {movie.title}
              </h2>

              <div className="text-[#FAFAFA]/60 mb-4">
                <p className="text-lg">{movie.year} • {movie.country} • {movie.language}</p>
                <p className="mt-1">Directed by {movie.director}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-[#181818] text-[#FAFAFA]/80 text-sm rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => onToggleWatched(movie.id, !movie.watched)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    movie.watched
                      ? 'bg-[#FAFAFA] text-[#181818]'
                      : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                  }`}
                  aria-pressed={movie.watched}
                >
                  {movie.watched ? <Eye size={18} /> : <EyeOff size={18} />}
                  <span>{movie.watched ? 'Watched' : 'Mark as Watched'}</span>
                </button>

                <button
                  onClick={() => onToggleFavorite(movie.id, !movie.favorite)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    movie.favorite
                      ? 'bg-red-500 text-white'
                      : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
                  }`}
                  aria-pressed={movie.favorite}
                >
                  <Heart size={18} fill={movie.favorite ? 'currentColor' : 'none'} />
                  <span>{movie.favorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#FAFAFA] mb-2">Cast</h3>
                <p className="text-[#FAFAFA]/80">{movie.cast_members.join(', ')}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#FAFAFA] mb-2">Synopsis</h3>
                <p className="text-[#FAFAFA]/80 leading-relaxed">{movie.synopsis}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#181818] p-6">
            <h3 className="text-2xl font-semibold text-[#FAFAFA] mb-4">
              Reviews ({reviews.length})
            </h3>

            {movie.watched ? (
              <form onSubmit={handleSubmitReview} className="mb-6">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  className="w-full p-4 bg-[#181818] text-[#FAFAFA] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
                  rows={4}
                  aria-label="Write review"
                />
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 text-[#FAFAFA]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSpoiler}
                      onChange={(e) => setIsSpoiler(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <AlertTriangle size={16} />
                    <span>Contains spoilers</span>
                  </label>
                  <button
                    type="submit"
                    disabled={!reviewText.trim() || submitting}
                    className="px-6 py-2 bg-[#FAFAFA] text-[#181818] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAFAFA]/90 transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-[#181818] rounded-lg text-[#FAFAFA]/60 text-center">
                Mark this movie as watched to write a review
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-[#FAFAFA]/60 text-center py-8">
                  No reviews yet. Be the first to share your thoughts!
                </p>
              ) : (
                reviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    review={review}
                    isRevealed={revealedReviews.has(review.id)}
                    onToggleReveal={() => toggleRevealReview(review.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReviewItemProps {
  review: Review;
  isRevealed: boolean;
  onToggleReveal: () => void;
}

function ReviewItem({ review, isRevealed, onToggleReveal }: ReviewItemProps) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-[#181818] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2 text-[#FAFAFA]/60 text-sm">
        <span>{date}</span>
        {review.spoiler && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-600/20 text-yellow-500 rounded">
            <AlertTriangle size={12} />
            Spoiler
          </span>
        )}
      </div>
      {review.spoiler && !isRevealed ? (
        <button
          onClick={onToggleReveal}
          className="text-[#FAFAFA] underline hover:text-[#FAFAFA]/80"
        >
          Click to reveal spoiler
        </button>
      ) : (
        <>
          <p className="text-[#FAFAFA]/90 leading-relaxed">{review.text}</p>
          {review.spoiler && (
            <button
              onClick={onToggleReveal}
              className="text-[#FAFAFA]/60 text-sm mt-2 underline hover:text-[#FAFAFA]/80"
            >
              Hide spoiler
            </button>
          )}
        </>
      )}
    </div>
  );
}
