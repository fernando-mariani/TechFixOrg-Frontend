import { createContext, useContext } from 'react';
import type { TecnicoContextValue } from '../types/TecnicoTypes';

export const TecnicoContext = createContext<TecnicoContextValue | null>(null);

export function useTecnico() {
  const contexto = useContext(TecnicoContext);
  if (!contexto) throw new Error('useTecnico deve ser usado dentro de TecnicoProvider.');
  return contexto;
}
