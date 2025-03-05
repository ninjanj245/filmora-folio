
import React, { useState, useRef, useEffect } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { Film } from "@/lib/types";
import { useFilms } from "@/context/FilmContext";
import AddFilmModal from "./AddFilmModal";

interface FilmModalProps {
  film: Film;
  onClose: () => void;
  isOpen: boolean;
}

const FilmModal: React.FC<FilmModalProps> = ({ film, onClose, isOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteFilm } = useFilms();
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this film?")) {
      deleteFilm(film.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (isEditing) {
    return (
      <AddFilmModal 
        isOpen={true}
        onClose={() => setIsEditing(false)}
        editMode={true}
        initialData={film}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="film-modal max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-[220px] bg-gray-200">
            {film.image ? (
              <img 
                src={film.image} 
                alt={film.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 p-1 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{film.title}</h2>
            <div className="flex flex-wrap items-center gap-x-4 mt-1">
              <span className="text-gray-600">ID: {film.idNumber}</span>
              {film.year && <span className="text-gray-600">{film.year}</span>}
            </div>
          </div>
          
          <div className="film-grid mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Director</h3>
              <p className="text-gray-900">{film.director}</p>
            </div>
            
            {film.producer && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Producer</h3>
                <p className="text-gray-900">{film.producer}</p>
              </div>
            )}
            
            {film.actors && film.actors.length > 0 && (
              <div className="col-span-full mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Actors</h3>
                <p className="text-gray-900">{film.actors.join(", ")}</p>
              </div>
            )}
            
            {film.genre && film.genre.length > 0 && (
              <div className="col-span-full mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {film.genre.map((genre, index) => (
                    <span 
                      key={index} 
                      className="film-tag"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {film.tags && film.tags.length > 0 && (
              <div className="col-span-full mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {film.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="film-tag bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="col-span-full mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Added On</h3>
              <p className="text-gray-900">{film.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4 border-t">
            <button 
              onClick={() => setIsEditing(true)}
              className="film-button flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center"
            >
              <Edit size={18} className="mr-2" />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="film-button flex-1 bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmModal;
