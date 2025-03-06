
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search as SearchIcon, Filter, ArrowUpDown, Grid, List } from "lucide-react";
import { useFilms } from "@/context/FilmContext";
import Navbar from "@/components/Navbar";
import FilmCard from "@/components/FilmCard";
import SearchResultCard from "@/components/SearchResultCard";
import { Film, SortOption } from "@/lib/types";

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { searchFilms } = useFilms();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Film[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchResults = searchFilms(query, sortOption);
      setResults(searchResults);
    }
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  
  const handleOpenFilm = (film: Film) => {
    // Logic to open film details
    console.log("Opening film:", film);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="film-container py-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate("/")}
            className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Search</h1>
        </div>
        
        <div className="mb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full p-4 pr-12 text-xl rounded-full border-2 border-black focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black rounded-full text-white"
              aria-label="Search"
            >
              <SearchIcon size={24} />
            </button>
          </form>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button className="p-3 rounded-full border-2 border-black flex justify-center items-center">
            <Filter size={18} className="mr-2" />
            <span>Advanced Filter</span>
          </button>
          <button className="p-3 rounded-full border-2 border-black flex justify-center items-center">
            <ArrowUpDown size={18} className="mr-2" />
            <span>Sort</span>
          </button>
          <button 
            onClick={toggleView}
            className="p-3 rounded-full border-2 border-black flex justify-center items-center"
          >
            {isGridView ? (
              <>
                <List size={18} className="mr-2" />
                <span>List View</span>
              </>
            ) : (
              <>
                <Grid size={18} className="mr-2" />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            
            {isGridView ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((film) => (
                  <SearchResultCard
                    key={film.id}
                    film={film}
                    onClick={() => handleOpenFilm(film)}
                    bgColor="bg-pink-100"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((film) => (
                  <SearchResultCard
                    key={film.id}
                    film={film}
                    onClick={() => handleOpenFilm(film)}
                    isListView={true}
                    bgColor="bg-green-100"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {query && results.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600">Try adjusting your search query or filters</p>
          </div>
        )}
      </div>
      
      <Navbar />
    </div>
  );
};

export default Search;
