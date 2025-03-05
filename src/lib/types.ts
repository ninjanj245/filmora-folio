
export interface Film {
  id: string;
  title: string;
  director: string;
  idNumber: string;
  year?: string;
  genre?: string[];
  actors?: string[];
  producer?: string;
  image?: string;
  tags?: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type SortOption = 
  | "alphabetical" 
  | "director" 
  | "actor" 
  | "producer" 
  | "number" 
  | "genre" 
  | "year" 
  | "tags";

export interface FilmContextType {
  films: Film[];
  recentFilms: Film[];
  recentSearches: string[];
  addFilm: (film: Omit<Film, "id" | "createdAt">) => void;
  updateFilm: (id: string, film: Partial<Film>) => void;
  deleteFilm: (id: string) => void;
  searchFilms: (query: string, filter?: SortOption) => Film[];
  addRecentSearch: (query: string) => void;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
