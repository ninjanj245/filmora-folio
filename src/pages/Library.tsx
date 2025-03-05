
import React, { useState } from "react";
import { useFilms } from "@/context/FilmContext";
import FilmCard from "@/components/FilmCard";
import FilmModal from "@/components/FilmModal";
import AddFilmModal from "@/components/AddFilmModal";
import { Film } from "@/lib/types";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Library: React.FC = () => {
  const { films } = useFilms();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleOpenFilm = (film: Film) => {
    setSelectedFilm(film);
  };
  
  const handleCloseFilm = () => {
    setSelectedFilm(null);
  };
  
  const handleSearch = (results: Film[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
  };
  
  // Listen for the custom event to open the add film modal
  React.useEffect(() => {
    const handleOpenAddModal = () => setShowAddModal(true);
    window.addEventListener("openAddFilmModal", handleOpenAddModal);
    return () => window.removeEventListener("openAddFilmModal", handleOpenAddModal);
  }, []);
  
  // Display content based on search state
  const displayFilms = searchQuery ? searchResults : films;
  
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
          <h1 className="text-2xl font-bold">Film Library</h1>
        </div>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              {searchResults.length === 0 
                ? `No results for "${searchQuery}"` 
                : `Search results for "${searchQuery}" (${searchResults.length})`}
            </h2>
            {searchResults.length === 0 && (
              <p className="text-gray-500">Try adjusting your search or filter.</p>
            )}
          </div>
        )}
        
        {displayFilms.length > 0 ? (
          <div className="space-y-6">
            <div className="film-grid">
              {displayFilms.map((film) => (
                <FilmCard 
                  key={film.id} 
                  film={film} 
                  onClick={() => handleOpenFilm(film)} 
                />
              ))}
            </div>
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
            <p className="text-gray-600 mb-6">Add your first film to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="film-button bg-coral text-white hover:bg-opacity-90"
            >
              Add Your First Film
            </button>
          </div>
        ) : null}
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

export default Library;
