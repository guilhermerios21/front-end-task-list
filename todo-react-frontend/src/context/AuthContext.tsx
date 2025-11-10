import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getToken, setToken, clearAuth, getUser, setUser as saveUser } from '../utils/storage';
import { decodeToken, isTokenValid, getTokenTimeRemaining } from '../utils/jwt';
import type { User } from '../types';
import { toast } from 'react-toastify';

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
  const logoutTimerRef = useRef<number | null>(null);
  const warnTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (warnTimerRef.current) {
      window.clearTimeout(warnTimerRef.current);
      warnTimerRef.current = null;
    }
  };

  // Agenda logout automático e aviso próximo da expiração
  const scheduleExpirationHandlers = useCallback((jwt: string) => {
    clearTimers();
    try {
      const decoded = decodeToken(jwt);
      if (!decoded || !decoded.exp) return;

      const expiresAt = decoded.exp * 1000; // ms
      const now = Date.now();
      const msUntilExpire = Math.max(0, expiresAt - now);

      // Aviso 60s antes de expirar (se houver tempo suficiente)
      const msUntilWarn = msUntilExpire - 60_000;
      if (msUntilWarn > 0) {
        warnTimerRef.current = window.setTimeout(() => {
          toast.warning('Sua sessão vai expirar em 1 minuto. Salve seu trabalho.');
        }, msUntilWarn);
      }

      // Logout exatamente na expiração
      logoutTimerRef.current = window.setTimeout(() => {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      }, msUntilExpire + 250); // pequeno buffer para garantir expiração
    } catch {
      // silencioso
    }
  }, []);

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
      scheduleExpirationHandlers(storedToken);
      
      if (storedUser) {
        setUserState(storedUser);
      } else {
        // Tenta extrair info do token
        const decoded = decodeToken(storedToken);
        if (decoded) {
          const userFromToken: User = {
            _id: decoded.userId || decoded.sub || decoded.id,
            name: decoded.name || decoded.username || 'Usuário',
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

  // Monitora expiração do token periodicamente (fallback) e em eventos de foco/visibilidade
  useEffect(() => {
    if (!token) return;

    const check = () => {
      if (!token) return;
      if (!isTokenValid(token)) {
        toast.error('Sessão expirada. Faça login novamente.');
        logout();
      }
    };

    // schedule precise timers
    scheduleExpirationHandlers(token);

    const interval = window.setInterval(() => {
      const remaining = getTokenTimeRemaining(token);
      if (remaining <= 0) {
        check();
      }
    }, 10_000);

    // Revalida quando volta ao app
    const onFocus = () => check();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimers();
    };
  // 'logout' é definido abaixo, então removemos da lista até mover logout para cima
  }, [token, scheduleExpirationHandlers]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
    scheduleExpirationHandlers(newToken);

    // Extrai informações do usuário do token
    const decoded = decodeToken(newToken);
    if (decoded) {
      const userFromToken: User = {
        _id: decoded.userId || decoded.sub || decoded.id,
        name: decoded.name || decoded.username || 'Usuário',
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
    clearTimers();
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
