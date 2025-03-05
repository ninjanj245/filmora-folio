
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film } from "@/lib/types";
import { useFilms } from "@/context/FilmContext";
import { useAuth } from "@/context/AuthContext";
import FilmCard from "@/components/FilmCard";
import FilmModal from "@/components/FilmModal";
import AddFilmModal from "@/components/AddFilmModal";
import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { LogOut, FilmIcon, Search, Plus } from "lucide-react";

const Index = () => {
  const { recentFilms, recentSearches, films, searchFilms, addRecentSearch } = useFilms();
  const { user, logout, isAuthenticated } = useAuth();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Listen for the custom event to open the add film modal
  useEffect(() => {
    const handleOpenAddModal = () => setShowAddModal(true);
    window.addEventListener("openAddFilmModal", handleOpenAddModal);
    return () => window.removeEventListener("openAddFilmModal", handleOpenAddModal);
  }, []);
  
  const handleOpenFilm = (film: Film) => {
    setSelectedFilm(film);
  };
  
  const handleCloseFilm = () => {
    setSelectedFilm(null);
  };
  
  const handleSearch = (results: Film[], query: string) => {
    setSearchResults(results);
  };
  
  const handleRecentSearchClick = (query: string) => {
    const results = searchFilms(query);
    setSearchResults(results);
    addRecentSearch(query);
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen pb-20">
      <div className="film-container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Film Library</h1>
          
          {user && (
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="film-button flex-1 bg-coral text-white hover:bg-opacity-90 flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            Add Film
          </button>
          <button
            onClick={() => navigate("/library")}
            className="film-button flex-1 bg-gray-800 text-white hover:bg-opacity-90 flex items-center justify-center"
          >
            <FilmIcon size={18} className="mr-2" />
            View Library
          </button>
        </div>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} className="mb-4" />
          
          {searchResults.length > 0 && (
            <div className="mt-4 mb-8">
              <h2 className="text-lg font-semibold mb-4">Search Results</h2>
              <div className="film-horizontal-scroll">
                {searchResults.map((film) => (
                  <FilmCard 
                    key={film.id} 
                    film={film} 
                    onClick={() => handleOpenFilm(film)} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {recentSearches.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="film-tag bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer flex items-center"
                  >
                    <Search size={12} className="mr-1" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {recentFilms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Recently Added Films</h2>
            <div className="film-horizontal-scroll">
              {recentFilms.map((film) => (
                <FilmCard 
                  key={film.id} 
                  film={film} 
                  onClick={() => handleOpenFilm(film)} 
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Library Statistics</h2>
          <div className="film-grid">
            <div className="p-6 bg-blue-50 rounded-10">
              <h3 className="text-sm font-medium text-blue-700 mb-1">Total Films</h3>
              <p className="text-3xl font-bold text-blue-900">{films.length}</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-10">
              <h3 className="text-sm font-medium text-purple-700 mb-1">Storage Used</h3>
              <p className="text-3xl font-bold text-purple-900">
                {Math.min(Math.round((films.length / 10000) * 100), 100)}%
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {films.length} of 10,000 slots
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {selectedFilm && (
        <FilmModal 
          film={selectedFilm} 
          onClose={handleCloseFilm} 
          isOpen={!!selectedFilm} 
        />
      )}
      
      <AddFilmModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <Navbar />
    </div>
  );
};

export default Index;
