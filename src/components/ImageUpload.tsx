
import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  initialImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, initialImage }) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file.');
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        setImage(imageData);
        onImageSelected(imageData);
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      setImage(imageUrl);
      onImageSelected(imageUrl);
      setShowUrlInput(false);
      setImageUrl("");
    }
  };
  
  const removeImage = () => {
    setImage(null);
    onImageSelected("");
  };
  
  return (
    <div className="mb-4">
      {!image ? (
        <>
          <div
            className="border-2 border-dashed border-gray-300 rounded-10 p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload size={36} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 mb-1">Drag & drop an image here</p>
            <p className="text-gray-400 text-sm mb-3">or click to browse</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden"
              accept="image/*"
            />
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-coral h-2 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUrlInput(!showUrlInput);
                }}
              >
                <LinkIcon size={14} className="mr-1" />
                {showUrlInput ? "Cancel" : "Or use image URL"}
              </button>
            </div>
          </div>
          
          {showUrlInput && (
            <div className="mt-3 p-3 border rounded-10">
              <form onSubmit={handleUrlSubmit} className="flex">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL here"
                  className="film-input flex-1"
                  required
                />
                <button
                  type="submit"
                  className="ml-2 film-button bg-blue-500 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="relative">
          <img
            src={image}
            alt="Selected"
            className="w-full h-48 object-cover rounded-10"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
