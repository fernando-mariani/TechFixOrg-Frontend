export type PerfilAdmin = 'GERENTE' | 'TECNICO';

export type UsuarioAdmin = {
  id: string;
  nome: string;
  email: string;
  role: string | null;
  verificado: boolean;
  dataCriacao: string;
};

export type AdminContextValue = {
  temSessao: boolean;
  pagina: number;
  resultado: {
    usuarios: UsuarioAdmin[];
    totalUsuarios: number;
    totalPaginas?: number;
    temProxima: boolean;
  } | null;
  erroBusca: boolean;
  salvando: boolean;
  erroVerificacao: string;
  buscarUsuarios: (busca: string) => void;
  mudarPagina: (pagina: number) => void;
  recarregarUsuarios: () => void;
  limparErroVerificacao: () => void;
  verificarUsuario: (id: string, role: PerfilAdmin) => Promise<boolean>;
};
