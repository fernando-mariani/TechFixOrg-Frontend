import { useCallback, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { apiUrl } from '../apiUrl';
import type { ConsultaPedidos, PaginaPedidos } from '../types/PedidoTypes';
import type { EstadoPerfilTecnico, Tecnico } from '../types/TecnicoTypes';
import { useAuth } from './useAuth';
import { TecnicoContext } from './useTecnico';

async function consultar<T>(caminho: string, token: string, signal: AbortSignal): Promise<T> {
  const resposta = await fetch(`${apiUrl}${caminho}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    signal,
  });

  if (!resposta.ok) {
    throw new Error(`Falha na consulta (HTTP ${resposta.status}).`);
  }

  return resposta.json();
}

function PerfilTecnico({ token, children }: PropsWithChildren<{ token: string }>) {
  const [perfil, setPerfil] = useState<EstadoPerfilTecnico>({ status: 'carregando' });

  const listarPedidos = useCallback((consulta: ConsultaPedidos, signal: AbortSignal) => {
    const params = new URLSearchParams({ pagina: String(consulta.pagina), tamanho: String(consulta.tamanho) });
    if (consulta.busca) params.set('busca', consulta.busca);
    for (const categoria of consulta.categorias) params.append('categoria', categoria);
    if (consulta.ordenarPreco) params.set('ordenarPreco', consulta.ordenarPreco);

    return consultar<PaginaPedidos>(`/pedidos/meus?${params}`, token, signal);
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    consultar<Tecnico>('/tecnico/me', token, controller.signal).then(
      (tecnico) => {
        if (!controller.signal.aborted) setPerfil({ status: 'pronto', tecnico });
      },
      () => {
        if (!controller.signal.aborted) {
          setPerfil({ status: 'erro', mensagem: 'Não foi possível carregar o perfil do técnico.' });
        }
      },
    );

    return () => controller.abort();
  }, [token]);

  return <TecnicoContext.Provider value={{ ...perfil, listarPedidos }}>{children}</TecnicoContext.Provider>;
}

export function TecnicoProvider({ children }: PropsWithChildren) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;

  return <PerfilTecnico key={token} token={token}>{children}</PerfilTecnico>;
}
