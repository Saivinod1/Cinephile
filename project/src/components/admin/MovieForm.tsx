import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Movie } from '../../types';

interface MovieFormProps {
  movie?: Movie | null;
  onSubmit: (data: Partial<Movie>) => Promise<void>;
  onCancel: () => void;
}

export function MovieForm({ movie, onSubmit, onCancel }: MovieFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    poster: '',
    genres: '',
    director: '',
    cast_members: '',
    country: '',
    language: '',
    synopsis: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        year: movie.year,
        poster: movie.poster,
        genres: movie.genres.join(', '),
        director: movie.director,
        cast_members: movie.cast_members.join(', '),
        country: movie.country,
        language: movie.language,
        synopsis: movie.synopsis
      });
    }
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        title: formData.title,
        year: formData.year,
        poster: formData.poster,
        genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
        director: formData.director,
        cast_members: formData.cast_members.split(',').map(c => c.trim()).filter(Boolean),
        country: formData.country,
        language: formData.language,
        synopsis: formData.synopsis
      });
      onCancel();
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Failed to save movie. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#232323] rounded-lg max-w-2xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-[#181818]">
          <h2 className="text-2xl font-bold text-[#FAFAFA]">
            {movie ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#181818] rounded-lg transition-colors text-[#FAFAFA]"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
                required
              />
            </div>

            <div>
              <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
              Poster URL
            </label>
            <input
              type="url"
              value={formData.poster}
              onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
              className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
              Genres (comma-separated)
            </label>
            <input
              type="text"
              value={formData.genres}
              onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
              placeholder="Drama, Thriller, Comedy"
              className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
                Director
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
                required
              />
            </div>

            <div>
              <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
              Cast (comma-separated)
            </label>
            <input
              type="text"
              value={formData.cast_members}
              onChange={(e) => setFormData({ ...formData, cast_members: e.target.value })}
              placeholder="Actor 1, Actor 2, Actor 3"
              className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#FAFAFA] text-sm font-medium mb-2">
              Synopsis
            </label>
            <textarea
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-[#181818] text-[#FAFAFA] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FAFAFA]/20"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-[#FAFAFA] text-[#181818] rounded-lg font-medium hover:bg-[#FAFAFA]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-[#181818] text-[#FAFAFA] rounded-lg font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
