
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Film, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-10 shadow-md animate-fade-in">
        <div className="inline-block p-4 bg-red-50 rounded-full mb-6">
          <Film size={48} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! This scene doesn't exist in our film library.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="film-button bg-coral text-white hover:bg-opacity-90 inline-flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
