import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'admin' | 'employee' | null;

interface AuthContextType {
  role: UserRole;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole as UserRole);
    }
  }, []);

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setRole('admin');
      localStorage.setItem('userRole', 'admin');
      return true;
    } else if (username === 'nayra' && password === 'nayra123') {
      setRole('employee');
      localStorage.setItem('userRole', 'employee');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};