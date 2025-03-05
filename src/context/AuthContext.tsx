
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContextType, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for user in localStorage (in a real app, verify token with backend)
    const storedUser = localStorage.getItem("filmUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("filmUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials with a backend
      // This is just a mock implementation
      const mockUser: User = {
        id: "user-" + Date.now().toString(),
        email,
        name: email.split("@")[0],
      };
      
      setUser(mockUser);
      localStorage.setItem("filmUser", JSON.stringify(mockUser));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would register the user with a backend
      // This is just a mock implementation
      const mockUser: User = {
        id: "user-" + Date.now().toString(),
        email,
        name: name || email.split("@")[0],
      };
      
      setUser(mockUser);
      localStorage.setItem("filmUser", JSON.stringify(mockUser));
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("filmUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
