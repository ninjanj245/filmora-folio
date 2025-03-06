
import React, { useState } from "react";
import { Film } from "@/lib/types";

interface FilmCardProps {
  film: Film;
  onClick: () => void;
}

const FilmCard: React.FC<FilmCardProps> = ({ film, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageSrc = film.image || "/placeholder.svg";
  
  return (
    <div 
      onClick={onClick}
      className="recent-film-card cursor-pointer overflow-hidden"
    >
      <div 
        className={`w-full aspect-square bg-black ${imageLoaded ? "loaded" : ""}`}
      >
        <img
          src={imageSrc}
          alt={film.title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{film.title}</h3>
        <p className="text-gray-600">ID: {film.idNumber}</p>
      </div>
    </div>
  );
};

export default FilmCard;
