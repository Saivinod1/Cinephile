import { Eye, EyeOff, Heart, MessageSquare } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  reviewCount: number;
  reviewSnippet?: string;
  onToggleWatched: (id: string, watched: boolean) => void;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  onClick: () => void;
}

export function MovieCard({
  movie,
  reviewCount,
  reviewSnippet,
  onToggleWatched,
  onToggleFavorite,
  onClick
}: MovieCardProps) {
  const handleWatchedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatched(movie.id, !movie.watched);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(movie.id, !movie.favorite);
  };

  return (
    <article
      className="bg-[#232323] rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-xl group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#181818]">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#FAFAFA] font-semibold text-lg leading-tight truncate">
              {movie.title}
            </h3>
            <p className="text-[#FAFAFA]/60 text-sm mt-1">
              {movie.year} • {movie.country}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-[#181818] text-[#FAFAFA]/80 text-xs rounded"
            >
              {genre}
            </span>
          ))}
        </div>

        {reviewCount > 0 && (
          <div className="mb-3 pb-3 border-b border-[#181818]">
            <div className="flex items-center gap-1.5 text-[#FAFAFA]/60 text-sm mb-1.5">
              <MessageSquare size={14} />
              <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
            </div>
            {reviewSnippet && (
              <p className="text-[#FAFAFA]/70 text-sm line-clamp-2 italic">
                "{reviewSnippet}"
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleWatchedClick}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors ${
              movie.watched
                ? 'bg-[#FAFAFA] text-[#181818]'
                : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
            }`}
            aria-label={movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
            aria-pressed={movie.watched}
          >
            {movie.watched ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="text-sm font-medium">
              {movie.watched ? 'Watched' : 'Watch'}
            </span>
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`px-3 py-2 rounded transition-colors ${
              movie.favorite
                ? 'bg-red-500 text-white'
                : 'bg-[#181818] text-[#FAFAFA] hover:bg-[#2a2a2a]'
            }`}
            aria-label={movie.favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={movie.favorite}
          >
            <Heart size={16} fill={movie.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
}
