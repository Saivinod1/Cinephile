import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Movie, Review } from '../types';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }

  async function toggleWatched(id: string, watched: boolean) {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ watched })
        .eq('id', id);

      if (error) throw error;

      setMovies(prev =>
        prev.map(m => m.id === id ? { ...m, watched } : m)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update movie');
    }
  }

  async function toggleFavorite(id: string, favorite: boolean) {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ favorite })
        .eq('id', id);

      if (error) throw error;

      setMovies(prev =>
        prev.map(m => m.id === id ? { ...m, favorite } : m)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update movie');
    }
  }

  return {
    movies,
    loading,
    error,
    toggleWatched,
    toggleFavorite,
    refetch: fetchMovies
  };
}

export function useReviews(movieId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  async function fetchReviews() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addReview(text: string, spoiler: boolean) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({ movie_id: movieId, text, spoiler })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setReviews(prev => [data, ...prev]);
      }
    } catch (err) {
      throw err;
    }
  }

  return {
    reviews,
    loading,
    addReview,
    refetch: fetchReviews
  };
}
