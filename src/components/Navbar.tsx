
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Film, Home } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black px-2 py-1 z-50 animate-slide-up">
      <div className="max-w-lg mx-auto">
        <nav className="flex justify-around">
          <Link 
            to="/" 
            className={`film-nav-item ${isActive('/') ? 'film-nav-active' : 'text-white'}`}
          >
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link 
            to="/search" 
            className={`film-nav-item ${isActive('/search') ? 'film-nav-active' : 'text-white'}`}
          >
            <Search size={24} />
            <span>Search</span>
          </Link>
          <Link 
            to="/library" 
            className={`film-nav-item ${isActive('/library') ? 'film-nav-active' : 'text-white'}`}
          >
            <Film size={24} />
            <span>Library</span>
          </Link>
          <button 
            className="film-nav-item text-white" 
            onClick={() => window.dispatchEvent(new CustomEvent('openAddFilmModal'))}
          >
            <Plus size={24} className="text-coral" />
            <span>Add Film</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
