import { createContext, useContext } from 'react';
import type { AuthContextValue } from '../types/AuthTypes';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return auth;
}


