
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Search, Film as FilmIcon, Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black px-2 py-1 z-50">
      <div className="max-w-lg mx-auto">
        <nav className="flex justify-around items-center">
          <Link 
            to="/" 
            className={`p-4 transition-colors duration-200 hover:text-[#32CD32] ${
              isActive('/') ? 'text-[#FF6F61]' : 'text-white'
            }`}
            aria-label="Home"
          >
            <Home size={24} />
          </Link>
          
          <Link 
            to="/search" 
            className={`p-4 transition-colors duration-200 hover:text-[#32CD32] ${
              isActive('/search') ? 'text-[#FF6F61]' : 'text-white'
            }`}
            aria-label="Search"
          >
            <Search size={24} />
          </Link>
          
          <button 
            className="p-4 -mt-8 relative bg-black rounded-full border-4 border-black transition-colors duration-200 hover:text-[#32CD32] text-white"
            onClick={() => window.dispatchEvent(new CustomEvent('openAddFilmModal'))}
            aria-label="Add Film"
          >
            <Plus size={28} />
          </button>
          
          <Link 
            to="/library" 
            className={`p-4 transition-colors duration-200 hover:text-[#32CD32] ${
              isActive('/library') ? 'text-[#FF6F61]' : 'text-white'
            }`}
            aria-label="Library"
          >
            <FilmIcon size={24} />
          </Link>
          
          <button 
            onClick={logout}
            className="p-4 transition-colors duration-200 hover:text-[#32CD32] text-white"
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
