
import React, { useState } from "react";
import { Film } from "@/lib/types";

interface FilmCardProps {
  film: Film;
  onClick: () => void;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Placeholder image if none provided
  const imageSrc = film.image || "/placeholder.svg";
  
  return (
    <div 
      className="film-card cursor-pointer snap-start min-w-[220px] max-w-[220px] animate-scale-in"
      onClick={onClick}
    >
      <div 
        className={`blur-load w-full h-[140px] bg-gray-200 ${imageLoaded ? "loaded" : ""}`}
        style={{ backgroundImage: "url(/placeholder.svg)" }}
      >
        <img
          src={imageSrc}
          alt={film.title}
          className="w-full h-[140px] object-cover transition-all duration-300"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{film.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-500">ID: {film.idNumber}</span>
          <span className="text-xs text-gray-400">{film.year || "No Year"}</span>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
