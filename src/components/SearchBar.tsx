
import React, { useState } from "react";
import { Search } from "lucide-react";
import { SortOption } from "@/lib/types";
import { useFilms } from "@/context/FilmContext";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (results: any[], query: string) => void;
  className?: string;
  simplified?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  className = "",
  simplified = false
}) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SortOption>("alphabetical");
  const { searchFilms, addRecentSearch } = useFilms();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query);
      
      if (simplified) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      } else if (onSearch) {
        const results = searchFilms(query, filter);
        onSearch(results, query);
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
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
          <Search size={24} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
