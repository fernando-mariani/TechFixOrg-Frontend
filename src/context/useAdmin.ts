import { createContext, useContext } from 'react';
import type { AdminContextValue } from '../types/AdminTypes';

export const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const contexto = useContext(AdminContext);
  if (!contexto) throw new Error('useAdmin deve ser usado dentro de AdminProvider.');
  return contexto;
}
