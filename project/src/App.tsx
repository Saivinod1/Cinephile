import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar, SortOption, FilterOption } from './components/FilterBar';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { MoviesManager } from './components/admin/MoviesManager';
import { useMovies } from './hooks/useMovies';
import { supabase } from './lib/supabase';
import { Movie } from './types';

type View = 'client' | 'admin';
type AdminTab = 'dashboard' | 'movies';

function App() {
  const { movies, loading, error, toggleWatched, toggleFavorite, refetch } = useMovies();
  const [currentView, setCurrentView] = useState<View>('client');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('year-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (movies.length > 0) {
      fetchReviewCounts();
    }
  }, [movies]);

  async function fetchReviewCounts() {
    const counts: Record<string, number> = {};
    for (const movie of movies) {
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('movie_id', movie.id);
      counts[movie.id] = count || 0;
    }
    setReviewCounts(counts);
  }

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...movies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.genres.some((g) => g.toLowerCase().includes(query)) ||
          movie.language.toLowerCase().includes(query) ||
          movie.country.toLowerCase().includes(query)
      );
    }

    if (filterBy === 'watched') {
      filtered = filtered.filter((m) => m.watched);
    } else if (filterBy === 'unwatched') {
      filtered = filtered.filter((m) => !m.watched);
    } else if (filterBy === 'favorites') {
      filtered = filtered.filter((m) => m.favorite);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        case 'favorites':
          if (a.favorite === b.favorite) return b.year - a.year;
          return a.favorite ? -1 : 1;
        case 'watched':
          if (a.watched === b.watched) return b.year - a.year;
          return a.watched ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [movies, searchQuery, sortBy, filterBy]);

  async function getReviewSnippet(movieId: string): Promise<string | undefined> {
    const { data } = await supabase
      .from('reviews')
      .select('text')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.text;
  }

  const [reviewSnippets, setReviewSnippets] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSnippets() {
      const snippets: Record<string, string> = {};
      for (const movie of movies) {
        if (reviewCounts[movie.id] > 0) {
          const snippet = await getReviewSnippet(movie.id);
          if (snippet) {
            snippets[movie.id] = snippet;
          }
        }
      }
      setReviewSnippets(snippets);
    }
    if (movies.length > 0) {
      loadSnippets();
    }
  }, [movies, reviewCounts]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-2">Error loading movies</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminLayout
        activeTab={adminTab}
        onTabChange={setAdminTab}
        onBackToClient={() => setCurrentView('client')}
      >
        {adminTab === 'dashboard' ? (
          <Dashboard movies={movies} />
        ) : (
          <MoviesManager movies={movies} onRefresh={refetch} />
        )}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818]">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminClick={() => setCurrentView('admin')}
      />
      <FilterBar
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#FAFAFA]/60 text-lg">Loading movies...</div>
          </div>
        ) : filteredAndSortedMovies.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#FAFAFA]/60 text-lg text-center">
              {searchQuery || filterBy !== 'all'
                ? 'No movies found matching your criteria'
                : 'No movies available'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                reviewCount={reviewCounts[movie.id] || 0}
                reviewSnippet={reviewSnippets[movie.id]}
                onToggleWatched={toggleWatched}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleWatched={toggleWatched}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

export default App;
