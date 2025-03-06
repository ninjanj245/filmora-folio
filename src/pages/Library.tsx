
import React, { useState, useEffect } from "react";
import { useFilms } from "@/context/FilmContext";
import FilmCard from "@/components/FilmCard";
import FilmModal from "@/components/FilmModal";
import AddFilmModal from "@/components/AddFilmModal";
import { Film, SortOption } from "@/lib/types";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { ChevronLeft, Filter, ArrowUpDown, List, Grid } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Library: React.FC = () => {
  const { films } = useFilms();
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Film[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListView, setIsListView] = useState(true);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("alphabetical");
  const navigate = useNavigate();
  
  const [filteredFilms, setFilteredFilms] = useState<Film[]>(films);
  
  // Update filtered films when the main films array changes
  useEffect(() => {
    setFilteredFilms(sortFilms(searchQuery ? searchResults : films, currentSort));
  }, [films, searchQuery, searchResults, currentSort]);
  
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
      default:
        return sorted;
    }
  };
  
  const handleSortChange = (option: SortOption) => {
    setCurrentSort(option);
    setShowSortMenu(false);
  };
  
  // Listen for the custom event to open the add film modal
  React.useEffect(() => {
    const handleOpenAddModal = () => setShowAddModal(true);
    window.addEventListener("openAddFilmModal", handleOpenAddModal);
    return () => window.removeEventListener("openAddFilmModal", handleOpenAddModal);
  }, []);
  
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
          <h1 className="text-2xl font-bold">Library</h1>
        </div>
        
        <div className="mb-4">
          <div className="relative rounded-full border-2 border-black overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-4 pr-12 outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") {
                  setSearchResults([]);
                } else {
                  const results = useFilms().searchFilms(e.target.value);
                  setSearchResults(results);
                }
              }}
            />
            <button className="absolute right-0 top-0 h-full aspect-square bg-black flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="w-full py-3 px-4 rounded-full border-2 border-black flex items-center justify-center"
            >
              <Filter size={16} className="mr-2" />
              <span>Advanced Filter</span>
            </button>
            
            {showFilterMenu && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                <div className="p-4">
                  <h3 className="font-bold mb-2">Filter by:</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowFilterMenu(false)}
                      >
                        All Films
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowFilterMenu(false)}
                      >
                        Genre: Action
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowFilterMenu(false)}
                      >
                        Genre: Drama
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowFilterMenu(false)}
                      >
                        Year: 2020-2023
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="w-full py-3 px-4 rounded-full border-2 border-black flex items-center justify-center"
            >
              <ArrowUpDown size={16} className="mr-2" />
              <span>Sort</span>
            </button>
            
            {showSortMenu && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                <div className="p-4">
                  <h3 className="font-bold mb-2">Sort by:</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        className={`w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md ${currentSort === "alphabetical" ? "font-bold" : ""}`}
                        onClick={() => handleSortChange("alphabetical")}
                      >
                        Title A-Z
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md ${currentSort === "director" ? "font-bold" : ""}`}
                        onClick={() => handleSortChange("director")}
                      >
                        Director
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md ${currentSort === "number" ? "font-bold" : ""}`}
                        onClick={() => handleSortChange("number")}
                      >
                        ID Number
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left py-2 px-4 hover:bg-gray-100 rounded-md ${currentSort === "year" ? "font-bold" : ""}`}
                        onClick={() => handleSortChange("year")}
                      >
                        Year
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsListView(!isListView)}
            className="py-3 px-4 rounded-full border-2 border-black flex items-center justify-center"
          >
            {isListView ? (
              <>
                <Grid size={16} className="mr-2" />
                <span>Grid View</span>
              </>
            ) : (
              <>
                <List size={16} className="mr-2" />
                <span>List View</span>
              </>
            )}
          </button>
        </div>
        
        {filteredFilms.length > 0 ? (
          <div className="space-y-4">
            {isListView ? (
              // List view
              <div className="rounded-lg overflow-hidden">
                {filteredFilms.map((film, index) => (
                  <div 
                    key={film.id} 
                    onClick={() => handleOpenFilm(film)}
                    className={`flex items-center justify-between p-4 bg-gray-300 cursor-pointer ${
                      index !== filteredFilms.length - 1 ? "border-b border-gray-400" : ""
                    }`}
                  >
                    <h3 className="font-medium">{film.title}</h3>
                    <p className="text-gray-700">Nr #{film.idNumber}</p>
                  </div>
                ))}
              </div>
            ) : (
              // Grid view
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFilms.map((film) => (
                  <FilmCard 
                    key={film.id} 
                    film={film} 
                    onClick={() => handleOpenFilm(film)} 
                  />
                ))}
              </div>
            )}
          </div>
        ) : !searchQuery ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
            <p className="text-gray-600 mb-6">Add your first film to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="film-button bg-black text-white hover:bg-opacity-90"
            >
              Add Your First Film
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600">Try adjusting your search or filter.</p>
          </div>
        )}
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
