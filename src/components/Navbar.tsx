
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Film, Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black px-2 py-1 z-50 animate-slide-up">
      <div className="max-w-lg mx-auto">
        <nav className="flex justify-around">
          <Link 
            to="/" 
            className={`film-nav-item ${isActive('/') ? 'film-nav-active' : 'text-gray-400'}`}
            aria-label="Home"
          >
            <Home size={24} />
          </Link>
          <Link 
            to="/search" 
            className={`film-nav-item ${isActive('/search') ? 'film-nav-active' : 'text-gray-400'}`}
            aria-label="Search"
          >
            <Search size={24} />
          </Link>
          <button 
            className="film-nav-item text-white bg-transparent border-0 -mt-5 relative"
            onClick={() => window.dispatchEvent(new CustomEvent('openAddFilmModal'))}
            aria-label="Add Film"
          >
            <div className="rounded-full border-4 border-black bg-white p-3">
              <Plus size={24} className="text-black" />
            </div>
          </button>
          <Link 
            to="/library" 
            className={`film-nav-item ${isActive('/library') ? 'film-nav-active' : 'text-gray-400'}`}
            aria-label="Library"
          >
            <Film size={24} />
          </Link>
          <button 
            className="film-nav-item text-gray-400 hover:text-white" 
            onClick={logout}
            aria-label="Logout"
          >
            <LogOut size={24} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
