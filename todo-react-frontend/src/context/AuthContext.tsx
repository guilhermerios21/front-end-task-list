import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, clearAuth, getUser, setUser as saveUser } from '../utils/storage';
import { decodeToken, isTokenValid, getTokenTimeRemaining } from '../utils/jwt';
import type { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifica autenticação
  const checkAuth = useCallback((): boolean => {
    const storedToken = getToken();
    
    if (!storedToken || !isTokenValid(storedToken)) {
      clearAuth();
      setTokenState(null);
      setUserState(null);
      setIsAuthenticated(false);
      return false;
    }

    return true;
  }, []);

  // Inicializa auth ao montar
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && isTokenValid(storedToken)) {
      setTokenState(storedToken);
      
      if (storedUser) {
        setUserState(storedUser);
      } else {
        // Tenta extrair info do token
        const decoded = decodeToken(storedToken);
        if (decoded) {
          const userFromToken: User = {
            _id: decoded.userId || decoded.sub || decoded.id,
            username: decoded.username || 'Usuário',
            email: decoded.email || '',
          };
          setUserState(userFromToken);
          saveUser(userFromToken);
        }
      }
      
      setIsAuthenticated(true);
    } else {
      clearAuth();
    }

    setIsLoading(false);
  }, []);

  // Monitora expiração do token
  useEffect(() => {
    if (!token) return;

    const checkInterval = setInterval(() => {
      if (!isTokenValid(token)) {
        console.log('Token expirado, fazendo logout...');
        logout();
      } else {
        const timeRemaining = getTokenTimeRemaining(token);
        if (timeRemaining < 60) { // Menos de 1 minuto
          console.warn(`Token expira em ${Math.floor(timeRemaining)} segundos`);
        }
      }
    }, 10000); // Verifica a cada 10 segundos

    return () => clearInterval(checkInterval);
  }, [token]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);

    // Extrai informações do usuário do token
    const decoded = decodeToken(newToken);
    if (decoded) {
      const userFromToken: User = {
        _id: decoded.userId || decoded.sub || decoded.id,
        username: decoded.username || 'Usuário',
        email: decoded.email || '',
      };
      setUserState(userFromToken);
      saveUser(userFromToken);
    }

    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    checkAuth,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
