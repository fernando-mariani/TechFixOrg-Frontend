import { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { apiUrl } from '../apiUrl';
import type { ConsultaPedidos, PaginaPedidos } from '../types/PedidoTypes';
import { useAuth } from './useAuth';
import { GerenteContext } from './useGerente';
import type { TecnicoDisponivel } from './useGerente';

export function GerenteProvider({ children }: PropsWithChildren) {
  const { token, user } = useAuth();
  const contexto = useMemo(() => {
    if (!token || user?.role !== 'GERENTE') return null;

    async function requisitar(caminho: string, opcoes: RequestInit = {}) {
      const headers = new Headers(opcoes.headers);
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      const resposta = await fetch(`${apiUrl}${caminho}`, { ...opcoes, headers });
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => null);
        throw new Error(typeof erro?.mensagem === 'string' ? erro.mensagem : `Falha na solicitação (HTTP ${resposta.status}).`);
      }
      return resposta;
    }

    return {
      nome: user.nome,
      async listarPedidos(consulta: ConsultaPedidos, signal: AbortSignal): Promise<PaginaPedidos> {
        const params = new URLSearchParams({
          pagina: String(consulta.pagina),
          tamanho: String(consulta.tamanho),
        });
        if (consulta.busca) params.set('busca', consulta.busca);
        if (consulta.tecnicoId) params.set('tecnicoId', consulta.tecnicoId);
        if (consulta.ordenarPreco) params.set('ordenarPreco', consulta.ordenarPreco);
        for (const categoria of consulta.categorias) params.append('categoria', categoria);
        const resposta = await requisitar(`/pedidos/busca?${params}`, { signal });
        return resposta.json();
      },
      async listarTecnicos(signal: AbortSignal): Promise<TecnicoDisponivel[]> {
        const resposta = await requisitar('/gerente/tecnicos', { signal });
        return resposta.json();
      },
      async reenviarEmail(id: string) {
        await requisitar(`/email/enviar/${encodeURIComponent(id)}`, { method: 'POST' });
      },
      async atribuirPedido(id: string, tecnicoId: string, preco: number) {
        await requisitar(`/gerente/pedido/atribuir/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tecnicoId, preco }),
        });
      },
    };
  }, [token, user]);

  if (!contexto) return <Navigate to="/login" replace />;
  return <GerenteContext.Provider value={contexto}>{children}</GerenteContext.Provider>;
}
