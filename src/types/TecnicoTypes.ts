import type { ConsultaPedidos, PaginaPedidos } from './PedidoTypes';

export type Categoria = 'HARDWARE' | 'SOFTWARE' | 'REDE' | 'OUTROS';

export type Tecnico = {
  nome: string;
  email: string;
  categorias: Categoria[];
};

export type EstadoPerfilTecnico =
  | { status: 'carregando'; }
  | { status: 'pronto'; tecnico: Tecnico; }
  | { status: 'erro'; mensagem: string; };
export type TecnicoContextValue = EstadoPerfilTecnico & {
  listarPedidos: (consulta: ConsultaPedidos, signal: AbortSignal) => Promise<PaginaPedidos>;
};
