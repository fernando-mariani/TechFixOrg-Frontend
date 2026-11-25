import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { apiUrl } from '../apiUrl';
import type { AdminContextValue, PerfilAdmin, UsuarioAdmin } from '../types/AdminTypes';
import { AdminContext } from './useAdmin';
import { useAuth } from './useAuth';

type MetadadosPagina = { totalPages?: number; totalElements?: number };
type PaginaUsuarios = UsuarioAdmin[] | (MetadadosPagina & {
  content: UsuarioAdmin[];
  page?: MetadadosPagina;
});

const tamanho = 10;
const caminhoUsuarios = '/admin/usuarios';

export function AdminProvider({ children }: PropsWithChildren) {
  const { token } = useAuth();
  const [consulta, setConsulta] = useState({ busca: '', pagina: 0 });
  const [resultado, setResultado] = useState<AdminContextValue['resultado']>(null);
  const [erroBusca, setErroBusca] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroVerificacao, setErroVerificacao] = useState('');

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ pagina: String(consulta.pagina), tamanho: String(tamanho) });
    if (consulta.busca) params.set('busca', consulta.busca);

    async function listarUsuarios() {
      try {
        const resposta = await fetch(`${apiUrl}${caminhoUsuarios}?${params}`, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!resposta.ok) throw new Error();
        const dados: PaginaUsuarios = await resposta.json();
        if (controller.signal.aborted) return;

        const usuarios = Array.isArray(dados) ? dados : dados.content;
        const metadados = Array.isArray(dados) ? undefined : dados.page ?? dados;
        const totalPaginas = metadados?.totalPages;
        setResultado({
          usuarios,
          totalUsuarios: metadados?.totalElements ?? usuarios.length,
          totalPaginas,
          temProxima: totalPaginas === undefined ? usuarios.length === tamanho : consulta.pagina + 1 < totalPaginas,
        });
      } catch {
        if (!controller.signal.aborted) setErroBusca(true);
      }
    }

    void listarUsuarios();
    return () => controller.abort();
  }, [consulta, token]);

  function consultar(busca: string, pagina: number) {
    setResultado(null);
    setErroBusca(false);
    setConsulta({ busca, pagina });
  }

  function recarregarUsuarios() {
    consultar(consulta.busca, consulta.pagina);
  }

  async function verificarUsuario(id: string, role: PerfilAdmin) {
    if (!token || salvando) return false;
    setSalvando(true);
    setErroVerificacao('');
    try {
      const resposta = await fetch(`${apiUrl}${caminhoUsuarios}/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => null);
        setErroVerificacao(typeof erro?.mensagem === 'string' && erro.mensagem
          ? erro.mensagem
          : 'Não foi possível verificar o usuário. Tente novamente.');
        return false;
      }
      recarregarUsuarios();
      return true;
    } catch {
      setErroVerificacao('Não foi possível verificar o usuário. Tente novamente.');
      return false;
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AdminContext.Provider value={{
      temSessao: Boolean(token),
      pagina: consulta.pagina,
      resultado: token ? resultado : null,
      erroBusca: Boolean(token) && erroBusca,
      salvando,
      erroVerificacao,
      buscarUsuarios: (busca) => consultar(busca.trim(), 0),
      mudarPagina: (pagina) => consultar(consulta.busca, pagina),
      recarregarUsuarios,
      limparErroVerificacao: () => setErroVerificacao(''),
      verificarUsuario,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
