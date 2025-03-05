
import React, { useState } from "react";
import { Search } from "lucide-react";
import { SortOption } from "@/lib/types";
import { useFilms } from "@/context/FilmContext";

interface SearchBarProps {
  onSearch: (results: any[], query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SortOption>("alphabetical");
  const { searchFilms, addRecentSearch } = useFilms();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const results = searchFilms(query, filter);
      onSearch(results, query);
      addRecentSearch(query);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search films..."
          className="film-input pr-12 pl-10"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 rounded-r-10"
        >
          Search
        </button>
      </form>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Filter:</span>
        {["alphabetical", "director", "actor", "producer", "number", "genre", "year", "tags"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option as SortOption)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === option
                ? "bg-coral text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
