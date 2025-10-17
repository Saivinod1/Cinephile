/*
  # Movie Discovery Application Schema

  1. New Tables
    - `movies`
      - `id` (uuid, primary key)
      - `title` (text, movie title)
      - `year` (integer, release year)
      - `poster` (text, poster image URL)
      - `genres` (text[], array of genre tags)
      - `director` (text, director name)
      - `cast_members` (text[], array of cast members)
      - `country` (text, country of origin)
      - `language` (text, primary language)
      - `synopsis` (text, full movie description)
      - `watched` (boolean, watched status)
      - `favorite` (boolean, favorite status)
      - `created_at` (timestamptz, record creation time)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `movie_id` (uuid, foreign key to movies)
      - `text` (text, review content)
      - `spoiler` (boolean, spoiler flag)
      - `created_at` (timestamptz, review timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow public read access for movies
    - Allow public read/write access for reviews (for demo purposes)
    
  3. Indexes
    - Add index on movie_id for reviews table for faster lookups
    - Add index on watched and favorite columns for filtering
*/

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  year integer NOT NULL,
  poster text NOT NULL,
  genres text[] NOT NULL DEFAULT '{}',
  director text NOT NULL,
  cast_members text[] NOT NULL DEFAULT '{}',
  country text NOT NULL,
  language text NOT NULL,
  synopsis text NOT NULL,
  watched boolean DEFAULT false,
  favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  text text NOT NULL,
  spoiler boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_movies_watched ON movies(watched);
CREATE INDEX IF NOT EXISTS idx_movies_favorite ON movies(favorite);

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Movies policies (public read/write for demo)
CREATE POLICY "Anyone can view movies"
  ON movies FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert movies"
  ON movies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update movies"
  ON movies FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Reviews policies (public read/write for demo)
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete reviews"
  ON reviews FOR DELETE
  USING (true);