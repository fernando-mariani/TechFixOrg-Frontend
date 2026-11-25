import { createContext, useContext } from 'react';
import type { ConsultaPedidos, PaginaPedidos } from '../types/PedidoTypes';
import type { Categoria } from '../types/TecnicoTypes';

export type TecnicoDisponivel = { id: string; nome: string; email: string; categorias: Categoria[] };

export const GerenteContext = createContext<{
  nome: string;
  listarPedidos: (consulta: ConsultaPedidos, signal: AbortSignal) => Promise<PaginaPedidos>;
  listarTecnicos: (signal: AbortSignal) => Promise<TecnicoDisponivel[]>;
  atribuirPedido: (id: string, tecnicoId: string, preco: number) => Promise<void>;
  reenviarEmail: (id: string) => Promise<void>;
} | null>(null);

export function useGerente() {
  const contexto = useContext(GerenteContext);
  if (!contexto) throw new Error('useGerente deve ser usado dentro de GerenteProvider.');
  return contexto;
}
