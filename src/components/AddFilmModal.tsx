
import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Tag } from "lucide-react";
import { Film } from "@/lib/types";
import { useFilms } from "@/context/FilmContext";
import ImageUpload from "./ImageUpload";
import SuccessMessage from "./SuccessMessage";

interface AddFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
  initialData?: Film;
}

const AddFilmModal: React.FC<AddFilmModalProps> = ({ 
  isOpen, 
  onClose, 
  editMode = false, 
  initialData 
}) => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [year, setYear] = useState("");
  const [producer, setProducer] = useState("");
  const [image, setImage] = useState("");
  const [actorInput, setActorInput] = useState("");
  const [actors, setActors] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { addFilm, updateFilm } = useFilms();
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
  
  useEffect(() => {
    if (editMode && initialData) {
      setTitle(initialData.title);
      setDirector(initialData.director);
      setIdNumber(initialData.idNumber);
      setYear(initialData.year || "");
      setProducer(initialData.producer || "");
      setImage(initialData.image || "");
      setActors(initialData.actors || []);
      setGenres(initialData.genre || []);
      setTags(initialData.tags || []);
    }
  }, [editMode, initialData]);
  
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  const addActor = () => {
    if (actorInput.trim() && !actors.includes(actorInput.trim())) {
      setActors([...actors, actorInput.trim()]);
      setActorInput("");
    }
  };
  
  const removeActor = (index: number) => {
    setActors(actors.filter((_, i) => i !== index));
  };
  
  const addGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput("");
    }
  };
  
  const removeGenre = (index: number) => {
    setGenres(genres.filter((_, i) => i !== index));
  };
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filmData = {
      title,
      director,
      idNumber,
      year: year || undefined,
      producer: producer || undefined,
      actors: actors.length > 0 ? actors : undefined,
      genre: genres.length > 0 ? genres : undefined,
      tags: tags.length > 0 ? tags : undefined,
      image: image || undefined,
    };
    
    if (editMode && initialData) {
      updateFilm(initialData.id, filmData);
      onClose();
    } else {
      addFilm(filmData);
      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        
        // Additional timeout to allow for closing animation
        setTimeout(() => {
          setTitle("");
          setDirector("");
          setIdNumber("");
          setYear("");
          setProducer("");
          setImage("");
          setActors([]);
          setGenres([]);
          setTags([]);
        }, 300);
      }, 5000);
    }
  };
  
  if (!isOpen) return null;
  
  if (showSuccess) {
    return <SuccessMessage message="Film added successfully!" />;
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
        <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{editMode ? "Edit Film" : "Add"}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="film-grid">
            <div className="col-span-full mb-4">
              <ImageUpload onImageSelected={setImage} initialImage={image} />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="film-input"
                required
                placeholder="Film title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="film-input"
                required
                placeholder="Unique ID"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Director *</label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="film-input"
                required
                placeholder="Director's name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="film-input"
                placeholder="Release year"
              />
            </div>
            
            <div className="col-span-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Producer</label>
              <input
                type="text"
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
                className="film-input"
                placeholder="Producer's name"
              />
            </div>
            
            <div className="col-span-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Actors</label>
              <div className="flex">
                <input
                  type="text"
                  value={actorInput}
                  onChange={(e) => setActorInput(e.target.value)}
                  className="film-input flex-1"
                  placeholder="Add actor"
                />
                <button
                  type="button"
                  onClick={addActor}
                  className="ml-2 film-button bg-gray-200 hover:bg-gray-300"
                >
                  <Plus size={18} />
                </button>
              </div>
              {actors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {actors.map((actor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {actor}
                      <button
                        type="button"
                        onClick={() => removeActor(index)}
                        className="ml-1 text-blue-400 hover:text-blue-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="col-span-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Genres</label>
              <div className="flex">
                <input
                  type="text"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  className="film-input flex-1"
                  placeholder="Add genre"
                />
                <button
                  type="button"
                  onClick={addGenre}
                  className="ml-2 film-button bg-gray-200 hover:bg-gray-300"
                >
                  <Plus size={18} />
                </button>
              </div>
              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {genres.map((genre, index) => (
                    <span
                      key={index}
                      className="film-tag"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeGenre(index)}
                        className="ml-1 text-blue-400 hover:text-blue-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="col-span-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="film-input flex-1"
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="ml-2 film-button bg-gray-200 hover:bg-gray-300"
                >
                  <Tag size={18} />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="film-tag bg-gray-100 text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="film-button flex-1 bg-coral text-white hover:bg-opacity-90"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="film-button flex-1 bg-limegreen text-white hover:bg-opacity-90"
            >
              {editMode ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFilmModal;
