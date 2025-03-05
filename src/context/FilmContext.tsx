import React, { createContext, useState, useContext, useEffect } from "react";
import { Film, FilmContextType, SortOption } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const FilmContext = createContext<FilmContextType | undefined>(undefined);

export const useFilms = () => {
  const context = useContext(FilmContext);
  if (context === undefined) {
    throw new Error("useFilms must be used within a FilmProvider");
  }
  return context;
};

export const FilmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [films, setFilms] = useState<Film[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  // Load films from localStorage on component mount
  useEffect(() => {
    const storedFilms = localStorage.getItem("films");
    const storedSearches = localStorage.getItem("recentSearches");
    
    if (storedFilms) {
      try {
        const parsedFilms = JSON.parse(storedFilms);
        setFilms(parsedFilms.map((film: any) => ({
          ...film,
          createdAt: new Date(film.createdAt)
        })));
      } catch (error) {
        console.error("Failed to parse stored films", error);
      }
    }
    
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (error) {
        console.error("Failed to parse stored searches", error);
      }
    }
  }, []);

  // Save films to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("films", JSON.stringify(films));
  }, [films]);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addFilm = (filmData: Omit<Film, "id" | "createdAt">) => {
    const newFilm: Film = {
      ...filmData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setFilms(prevFilms => [newFilm, ...prevFilms]);
    toast({
      title: "Film Added",
      description: `"${filmData.title}" has been added to your library.`,
    });
  };

  const updateFilm = (id: string, filmData: Partial<Film>) => {
    setFilms(prevFilms => 
      prevFilms.map(film => 
        film.id === id ? { ...film, ...filmData } : film
      )
    );
    toast({
      title: "Film Updated",
      description: "The film has been updated successfully.",
    });
  };

  const deleteFilm = (id: string) => {
    const filmToDelete = films.find(film => film.id === id);
    setFilms(prevFilms => prevFilms.filter(film => film.id !== id));
    
    if (filmToDelete) {
      toast({
        title: "Film Deleted",
        description: `"${filmToDelete.title}" has been removed from your library.`,
      });
    }
  };

  const searchFilms = (query: string, filter?: SortOption): Film[] => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    
    let results = films.filter(film => {
      const matchesTitle = film.title.toLowerCase().includes(normalizedQuery);
      const matchesDirector = film.director.toLowerCase().includes(normalizedQuery);
      const matchesIdNumber = film.idNumber.toLowerCase().includes(normalizedQuery);
      const matchesYear = film.year?.toLowerCase().includes(normalizedQuery);
      const matchesGenre = film.genre?.some(g => g.toLowerCase().includes(normalizedQuery));
      const matchesActors = film.actors?.some(a => a.toLowerCase().includes(normalizedQuery));
      const matchesProducer = film.producer?.toLowerCase().includes(normalizedQuery);
      const matchesTags = film.tags?.some(t => t.toLowerCase().includes(normalizedQuery));
      
      return matchesTitle || matchesDirector || matchesIdNumber || matchesYear || 
             matchesGenre || matchesActors || matchesProducer || matchesTags;
    });
    
    // Sort results based on filter
    if (filter) {
      results = sortFilms(results, filter);
    }
    
    return results;
  };

  const sortFilms = (filmsToSort: Film[], sortOption: SortOption): Film[] => {
    const sorted = [...filmsToSort];
    
    switch (sortOption) {
      case "alphabetical":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "director":
        return sorted.sort((a, b) => a.director.localeCompare(b.director));
      case "number":
        return sorted.sort((a, b) => a.idNumber.localeCompare(b.idNumber));
      case "year":
        return sorted.sort((a, b) => {
          if (!a.year) return 1;
          if (!b.year) return -1;
          return a.year.localeCompare(b.year);
        });
      case "actor":
        return sorted.sort((a, b) => {
          const actorA = a.actors?.[0] || "";
          const actorB = b.actors?.[0] || "";
          return actorA.localeCompare(actorB);
        });
      case "producer":
        return sorted.sort((a, b) => {
          const producerA = a.producer || "";
          const producerB = b.producer || "";
          return producerA.localeCompare(producerB);
        });
      case "genre":
        return sorted.sort((a, b) => {
          const genreA = a.genre?.[0] || "";
          const genreB = b.genre?.[0] || "";
          return genreA.localeCompare(genreB);
        });
      case "tags":
        return sorted.sort((a, b) => {
          const tagA = a.tags?.[0] || "";
          const tagB = b.tags?.[0] || "";
          return tagA.localeCompare(tagB);
        });
      default:
        return sorted;
    }
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      // Remove the query if it already exists
      const filtered = prev.filter(s => s !== query);
      // Add it to the beginning and keep only 5 items
      return [query, ...filtered].slice(0, 5);
    });
  };

  const recentFilms = films.slice(0, 5);

  const value: FilmContextType = {
    films,
    recentFilms,
    recentSearches,
    addFilm,
    updateFilm,
    deleteFilm,
    searchFilms,
    addRecentSearch,
  };

  return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
};
