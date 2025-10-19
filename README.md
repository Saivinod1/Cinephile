 Cinephile

A modern web application for movie enthusiasts to discover, track, and review films with a sleek, user-friendly experience.

Features

Movie Discovery
- Browse trending, popular, and top-rated movies
- Search movies by title, genre, or year
- View detailed movie information, ratings, and trailers

User Reviews & Ratings
- Submit personal reviews and ratings for any movie
- See community reviews and top fan ratings
- Edit or delete your own reviews

Personalized Lists & Tracking
- Create and manage watchlists (e.g., “Want to Watch”, “Watched”)
- Mark movies as favorites
- Track your viewing history and stats

Social & Sharing
- Share movie recommendations with friends
- Public movie pages with user discussions
- Like and comment on other users’ reviews

Modern UX
- Responsive design (works on desktop and mobile)
- Fast Vite-powered build, smooth transitions
- Dark mode and theme support

Tech Stack

- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS, Lucide React for icons
- Backend: Supabase (Database, Auth, RLS)
- Database: PostgreSQL with Row Level Security
- Deployment: Netlify ([Live Demo](https://cinephile05.netlify.app/))

Getting Started

Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

Installation

1. Clone the repository
    ```
    git clone https://github.com/Saivinod1/Cinephile.git
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Set up environment variables in `.env`:
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4. Run the development server:
    ```
    npm run dev
    ```
5. Build for production:
    ```
    npm run build
    ```

Project Structure

```
src/
├── components/
│   ├── MovieList.tsx          # Gallery of movies
│   ├── MovieDetails.tsx       # Individual movie details and reviews
│   ├── ReviewForm.tsx         # Submit/edit a review
│   ├── Reviews.tsx            # List and display reviews
│   ├── Watchlist.tsx          # User’s watchlist management
│   ├── Navbar.tsx             # Navigation bar
│   └── ErrorBoundary.tsx      # Error handling
├── contexts/
│   └── AuthContext.tsx        # Authentication state management
├── lib/
│   └── supabase.ts            # Supabase client configuration
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point
```

Database Schema

Users Table

- Managed by Supabase Auth

Profiles Table

- `id`: User ID (references auth.users)
- `username`, `avatar_url`: Profile info
- `created_at`: Signup timestamp

Movies Table

- `id`: Unique movie identifier
- `title`, `year`, `genre`, `poster_url`, etc.
- `tmdb_id`: External movie database reference

Reviews Table

- `id`: Unique review identifier
- `user_id`: Reviewer
- `movie_id`: Reviewed movie
- `rating`: User’s movie rating (out of 10)
- `text`: Review body
- `created_at`: Timestamp

Watchlist Table

- `id`: Unique list entry
- `user_id`: List owner
- `movie_id`: Movie
- `status`: “Want to Watch” / “Watched” / “Favorite”
- `added_at`: Timestamp

Security

- Row Level Security on all tables
- Users can only modify their own reviews and watchlists
- Secure auth and session handling

Future Enhancements

- Social feeds (following, recommendations)
- Movie suggestion AI
- More detailed stat dashboards
- Mobile app support
- Advanced filtering and analytics

Development

Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview build locally
- `npm run lint` – Lint code
- `npm run typecheck` – TypeScript check

Contributing

- Code style and conventions should be followed
- Types should be strongly defined
- Comprehensive testing appreciated

License

This project is open source and available for personal or commercial use.

