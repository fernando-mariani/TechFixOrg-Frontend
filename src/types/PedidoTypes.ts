import type { Categoria } from './TecnicoTypes';

export type StatusPedido = 'AGUARDANDO_VERIFICACAO' | 'AGUARDANDO_CONFIRMACAO' | 'PENDENTE' | 'PRONTO';

export type Pedido = {
  id: string;
  titulo: string;
  descricao: string;
  nomeCliente: string;
  dataCriacao: string;
  preco: number | null;
  categoria: Categoria;
  status: StatusPedido;
};

export type OrdemPreco = 'ASC' | 'DESC';

export type ConsultaPedidos = {
  busca: string;
  categorias: Categoria[];
  ordenarPreco: OrdemPreco | '';
  pagina: number;
  tamanho: number;
  tecnicoId?: string;
};

export type PaginaPedidos = {
  content: Pedido[];
  page: { number: number; size: number; totalElements: number; totalPages: number; };
};
