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

const Index = () => {
  const { recentFilms, recentSearches, films, searchFilms, addRecentSearch } = useFilms();
  const { user, logout, isAuthenticated } = useAuth();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
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
    <div className="min-h-screen pb-20 px-6">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name || 'User'}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="p-6 bg-black text-white rounded-3xl text-xl font-medium hover:opacity-90 transition-opacity"
          >
            Add film
          </button>
          <button
            onClick={() => navigate("/library")}
            className="p-6 bg-white text-black border-2 border-black rounded-3xl text-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View Library
          </button>
        </div>

        <SearchBar onSearch={handleSearch} className="mb-12" />

        {recentSearches.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Last 5 searches</h2>
            <div className="grid grid-cols-2 gap-4">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="recent-search-card p-6 text-left"
                >
                  <span className="text-xl font-medium">Search #{index + 1}</span>
                  <p className="text-gray-600 mt-1">{search}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {recentFilms.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Last 5 added</h2>
            <div className="grid grid-cols-2 gap-4">
              {recentFilms.map((film) => (
                <FilmCard key={film.id} film={film} onClick={() => handleOpenFilm(film)} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-3xl p-6">
              <h3 className="text-gray-600 mb-2">Films in storage</h3>
              <p className="text-4xl font-bold">{films.length}</p>
            </div>
            <div className="bg-gray-100 rounded-3xl p-6">
              <h3 className="text-gray-600 mb-2">Days since last added</h3>
              <p className="text-4xl font-bold">
                {recentFilms.length > 0
                  ? Math.floor((Date.now() - recentFilms[0].createdAt.getTime()) / (1000 * 60 * 60 * 24))
                  : 0}
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
    </div>
  );
};

export default Index;
