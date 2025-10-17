import { useEffect, useState } from 'react';
import { Film, MessageSquare, Eye, Heart, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Movie } from '../../types';

interface DashboardProps {
  movies: Movie[];
}

interface Stats {
  totalMovies: number;
  totalReviews: number;
  watchedMovies: number;
  favoriteMovies: number;
  topRatedMovies: Array<{ title: string; reviewCount: number }>;
  recentReviews: Array<{ movieTitle: string; text: string; date: string }>;
}

export function Dashboard({ movies }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalMovies: 0,
    totalReviews: 0,
    watchedMovies: 0,
    favoriteMovies: 0,
    topRatedMovies: [],
    recentReviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [movies]);

  async function loadStats() {
    try {
      setLoading(true);

      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      const reviewsByMovie = await Promise.all(
        movies.map(async (movie) => {
          const { count } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('movie_id', movie.id);
          return { title: movie.title, reviewCount: count || 0 };
        })
      );

      const topRated = reviewsByMovie
        .filter(m => m.reviewCount > 0)
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 5);

      const { data: recentReviewsData } = await supabase
        .from('reviews')
        .select('movie_id, text, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentReviews = await Promise.all(
        (recentReviewsData || []).map(async (review) => {
          const movie = movies.find(m => m.id === review.movie_id);
          return {
            movieTitle: movie?.title || 'Unknown',
            text: review.text,
            date: new Date(review.created_at).toLocaleDateString()
          };
        })
      );

      setStats({
        totalMovies: movies.length,
        totalReviews: reviewCount || 0,
        watchedMovies: movies.filter(m => m.watched).length,
        favoriteMovies: movies.filter(m => m.favorite).length,
        topRatedMovies: topRated,
        recentReviews
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-[#FAFAFA]/60 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#FAFAFA] mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Film size={24} />}
          label="Total Movies"
          value={stats.totalMovies}
          color="text-blue-500"
        />
        <StatCard
          icon={<MessageSquare size={24} />}
          label="Total Reviews"
          value={stats.totalReviews}
          color="text-green-500"
        />
        <StatCard
          icon={<Eye size={24} />}
          label="Watched Movies"
          value={stats.watchedMovies}
          color="text-yellow-500"
        />
        <StatCard
          icon={<Heart size={24} />}
          label="Favorite Movies"
          value={stats.favoriteMovies}
          color="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#232323] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-[#FAFAFA]" size={20} />
            <h2 className="text-xl font-semibold text-[#FAFAFA]">Most Reviewed Movies</h2>
          </div>
          {stats.topRatedMovies.length > 0 ? (
            <div className="space-y-3">
              {stats.topRatedMovies.map((movie, index) => (
                <div
                  key={movie.title}
                  className="flex items-center justify-between p-3 bg-[#181818] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAFAFA] text-[#181818] flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="text-[#FAFAFA] font-medium">{movie.title}</span>
                  </div>
                  <span className="text-[#FAFAFA]/60">
                    {movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#FAFAFA]/60 text-center py-8">No reviews yet</p>
          )}
        </div>

        <div className="bg-[#232323] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="text-[#FAFAFA]" size={20} />
            <h2 className="text-xl font-semibold text-[#FAFAFA]">Recent Reviews</h2>
          </div>
          {stats.recentReviews.length > 0 ? (
            <div className="space-y-3">
              {stats.recentReviews.map((review, index) => (
                <div key={index} className="p-3 bg-[#181818] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#FAFAFA] font-medium text-sm">
                      {review.movieTitle}
                    </span>
                    <span className="text-[#FAFAFA]/40 text-xs">{review.date}</span>
                  </div>
                  <p className="text-[#FAFAFA]/70 text-sm line-clamp-2">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#FAFAFA]/60 text-center py-8">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-[#232323] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={color}>{icon}</div>
        <span className="text-3xl font-bold text-[#FAFAFA]">{value}</span>
      </div>
      <p className="text-[#FAFAFA]/60 font-medium">{label}</p>
    </div>
  );
}
