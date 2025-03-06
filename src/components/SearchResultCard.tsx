
import React, { useState } from "react";
import { Film } from "@/lib/types";

interface SearchResultCardProps {
  film: Film;
  onClick: () => void;
  isListView?: boolean;
  bgColor?: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ 
  film, 
  onClick, 
  isListView = false,
  bgColor = "bg-pink-100"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageSrc = film.image || "/placeholder.svg";
  
  return (
    <div 
      onClick={onClick}
      className={`search-result-card cursor-pointer overflow-hidden ${bgColor} ${isListView ? "flex" : ""}`}
    >
      <div 
        className={`${isListView ? "w-24 h-24" : "w-full aspect-square"} bg-black overflow-hidden rounded-3xl ${imageLoaded ? "loaded" : ""}`}
      >
        <img
          src={imageSrc}
          alt={film.title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      
      <div className={`p-4 ${isListView ? "flex-1" : ""}`}>
        <h3 className="font-medium text-lg truncate">{film.title}</h3>
        {isListView && <p className="text-gray-600 text-right">ID: {film.idNumber}</p>}
      </div>
    </div>
  );
};

export default SearchResultCard;
