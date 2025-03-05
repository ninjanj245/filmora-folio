
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-10 shadow-2xl p-8 max-w-sm w-full text-center animate-scale-in">
        <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        <p className="text-gray-600 mb-4">Redirecting in {countdown} seconds...</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(countdown / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
