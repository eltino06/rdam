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
  login: (email: string, password: string) => Promise<User>;
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
    console.log('AuthProvider - Inicializando...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('AuthProvider - Token en localStorage:', storedToken ? 'Existe' : 'No existe');
    console.log('AuthProvider - User en localStorage:', storedUser ? 'Existe' : 'No existe');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log('AuthProvider - Usuario cargado:', parsedUser);
      } catch (error) {
        console.error('AuthProvider - Error parseando usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
    console.log('AuthProvider - Inicialización completa');
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    console.log('AuthContext - Iniciando login');
    const response = await authApi.login(email, password);
    const { access_token, user: userData } = response.data;

    setToken(access_token);
    setUser(userData);

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));

    console.log('AuthContext - Login exitoso, usuario guardado:', userData);

    return userData;
  };

  const logout = () => {
    console.log('AuthContext - Logout');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const contextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  console.log('AuthProvider - Render, isAuthenticated:', contextValue.isAuthenticated, 'isLoading:', isLoading);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
