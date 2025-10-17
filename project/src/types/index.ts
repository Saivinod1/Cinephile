export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
  genres: string[];
  director: string;
  cast_members: string[];
  country: string;
  language: string;
  synopsis: string;
  watched: boolean;
  favorite: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  movie_id: string;
  text: string;
  spoiler: boolean;
  created_at: string;
}

export type View = 'client' | 'admin';
