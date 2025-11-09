import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  userId?: string;
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getTokenExpirationDate = (token: string): Date | null => {
  if (!token) return null;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  if (!token) return null;

  try {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    // Tenta diferentes campos que podem conter o ID
    return decoded.userId || decoded.sub || decoded.id || null;
  } catch (error) {
    return null;
  }
};

export const getTokenTimeRemaining = (token: string): number => {
  if (!token) return 0;

  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;

    const currentTime = Date.now() / 1000;
    const timeRemaining = decoded.exp - currentTime;
    return Math.max(0, timeRemaining);
  } catch (error) {
    return 0;
  }
};
