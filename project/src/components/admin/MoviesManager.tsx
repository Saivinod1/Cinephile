import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Movie } from '../../types';
import { MovieForm } from './MovieForm';
import { supabase } from '../../lib/supabase';

interface MoviesManagerProps {
  movies: Movie[];
  onRefresh: () => void;
}

export function MoviesManager({ movies, onRefresh }: MoviesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const handleAddMovie = async (data: Partial<Movie>) => {
    const { error } = await supabase
      .from('movies')
      .insert({
        title: data.title,
        year: data.year,
        poster: data.poster,
        genres: data.genres,
        director: data.director,
        cast_members: data.cast_members,
        country: data.country,
        language: data.language,
        synopsis: data.synopsis,
        watched: false,
        favorite: false
      });

    if (error) throw error;
    onRefresh();
  };

  const handleUpdateMovie = async (data: Partial<Movie>) => {
    if (!editingMovie) return;

    const { error } = await supabase
      .from('movies')
      .update({
        title: data.title,
        year: data.year,
        poster: data.poster,
        genres: data.genres,
        director: data.director,
        cast_members: data.cast_members,
        country: data.country,
        language: data.language,
        synopsis: data.synopsis
      })
      .eq('id', editingMovie.id);

    if (error) throw error;
    onRefresh();
  };

  const handleDeleteMovie = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movie? All associated reviews will also be deleted.')) {
      return;
    }

    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete movie. Please try again.');
      return;
    }

    onRefresh();
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#FAFAFA]">Manage Movies</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] text-[#181818] rounded-lg font-medium hover:bg-[#FAFAFA]/90 transition-colors"
        >
          <Plus size={20} />
          Add Movie
        </button>
      </div>

      <div className="bg-[#232323] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#181818]">
              <tr>
                <th className="px-6 py-4 text-left text-[#FAFAFA] font-semibold">Poster</th>
                <th className="px-6 py-4 text-left text-[#FAFAFA] font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-[#FAFAFA] font-semibold">Year</th>
                <th className="px-6 py-4 text-left text-[#FAFAFA] font-semibold">Director</th>
                <th className="px-6 py-4 text-left text-[#FAFAFA] font-semibold">Country</th>
                <th className="px-6 py-4 text-left text-[#FAFAFA] font-semibold">Genres</th>
                <th className="px-6 py-4 text-right text-[#FAFAFA] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181818]">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-[#181818]/50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-[#FAFAFA] font-medium">{movie.title}</td>
                  <td className="px-6 py-4 text-[#FAFAFA]/80">{movie.year}</td>
                  <td className="px-6 py-4 text-[#FAFAFA]/80">{movie.director}</td>
                  <td className="px-6 py-4 text-[#FAFAFA]/80">{movie.country}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 bg-[#181818] text-[#FAFAFA]/80 text-xs rounded"
                        >
                          {genre}
                        </span>
                      ))}
                      {movie.genres.length > 2 && (
                        <span className="px-2 py-1 bg-[#181818] text-[#FAFAFA]/60 text-xs rounded">
                          +{movie.genres.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="p-2 hover:bg-[#181818] rounded-lg transition-colors text-[#FAFAFA]"
                        aria-label="Edit movie"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                        aria-label="Delete movie"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {movies.length === 0 && (
          <div className="text-center py-12 text-[#FAFAFA]/60">
            No movies found. Add your first movie to get started.
          </div>
        )}
      </div>

      {showForm && (
        <MovieForm
          movie={editingMovie}
          onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
