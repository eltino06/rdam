import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth.api';

interface User {
  id: string;
  nombreCompleto: string;
  email: string;
  tipo: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, token?: string, userData?: User) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, accessToken?: string, userData?: User): Promise<User> => {
    // Si ya viene el token y usuario (desde verificar-codigo), los usamos directamente
    if (accessToken && userData) {
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }

    // Login normal (sin 2FA)
    const response = await authApi.login(email, password);
    const { access_token, user: userDataResponse } = response.data;
    setToken(access_token);
    setUser(userDataResponse);
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userDataResponse));
    return userDataResponse;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token && !!user,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};