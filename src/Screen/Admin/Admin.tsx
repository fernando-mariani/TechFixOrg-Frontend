import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useAdmin } from '../../context/useAdmin';
import type { PerfilAdmin, UsuarioAdmin } from '../../types/AdminTypes';
import '../Tecnico/Home/Home.css';
import './Admin.css';

const perfis = { GERENTE: 'Gerente', TECNICO: 'Técnico' } satisfies Record<PerfilAdmin, string>;

function nomePerfil(role: string) {
  return role === 'GERENTE' || role === 'TECNICO' ? perfis[role] : role;
}

export default function Admin() {
  const {
    temSessao, pagina, resultado, erroBusca, salvando, erroVerificacao,
    buscarUsuarios, mudarPagina, recarregarUsuarios, limparErroVerificacao, verificarUsuario,
  } = useAdmin();
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<string | null>(null);
  const [confirmacao, setConfirmacao] = useState<{ usuario: UsuarioAdmin; perfil: PerfilAdmin; } | null>(null);
  const [mensagem, setMensagem] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const selecaoRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = 'Administração | TechFixOrg';
    return () => { document.title = tituloAnterior; };
  }, []);

  useEffect(() => {
    if (usuarioEmEdicao !== null) selecaoRef.current?.focus();
  }, [usuarioEmEdicao]);

  useEffect(() => {
    if (confirmacao) dialogRef.current?.showModal();
  }, [confirmacao]);

  const usuarios = resultado?.usuarios ?? [];
  const ordenados = [...usuarios].sort((a, b) => Number(a.verificado) - Number(b.verificado));

  function limparSelecao() {
    setUsuarioEmEdicao(null);
    setMensagem('');
  }

  function revisarVerificacao(event: FormEvent<HTMLFormElement>, usuario: UsuarioAdmin) {
    event.preventDefault();
    const valor = new FormData(event.currentTarget).get('perfil');
    if (valor !== 'GERENTE' && valor !== 'TECNICO') return;

    limparErroVerificacao();
    setConfirmacao({ usuario, perfil: valor });
  }

  async function confirmarVerificacao() {
    if (!confirmacao) return;
    const { usuario, perfil } = confirmacao;
    if (!await verificarUsuario(usuario.id, perfil)) return;

    setUsuarioEmEdicao(null);
    setMensagem(`${usuario.nome} foi verificado com o perfil de ${perfis[perfil]}.`);
    dialogRef.current?.close();
    tituloRef.current?.focus();
  }

  return (
    <div className="admin-page">
      <a className="home-skip" href="#admin-content">Ir para o conteúdo</a>
      <header className="home-header">
        <Link className="home-brand" to="/admin" aria-label="TechFixOrg, administração">
          <span className="home-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z" />
            </svg>
          </span>
          <span>TechFix<span className="home-brand-org">Org</span></span>
        </Link>
        <span className="home-account">Área administrativa</span>
      </header>

      <main id="admin-content" className="home-content" tabIndex={-1}>
        <section className="home-welcome" aria-labelledby="admin-title">
          <h1 id="admin-title">Gerencie os <em>usuários.</em></h1>
          <p>Verifique as contas da equipe e atribua um perfil de acesso.</p>
        </section>

        <section className="home-orders" aria-labelledby="users-title">
          <div className="home-section-heading">
            <h2 id="users-title" ref={tituloRef} tabIndex={-1}>Usuários {resultado && <span className="home-count">{resultado.totalUsuarios}</span>}</h2>
            <p>As contas não verificadas aparecem primeiro em cada página.</p>
          </div>
          <form className="admin-search" role="search" onSubmit={(event) => {
            event.preventDefault();
            const busca = String(new FormData(event.currentTarget).get('busca') ?? '');
            limparSelecao();
            buscarUsuarios(busca);
          }}>
            <label htmlFor="admin-busca">Buscar usuários</label>
            <input id="admin-busca" name="busca" type="search" placeholder="Nome ou e-mail" />
            <button type="submit" className="admin-button" disabled={!temSessao}>Buscar</button>
          </form>
          <div className="admin-feedback" role="status">{mensagem}</div>
          {!temSessao && <p role="alert">Entre na sua conta para consultar os usuários.</p>}
          {temSessao && !resultado && !erroBusca && <p role="status">Carregando usuários…</p>}
          {erroBusca && (
            <div className="admin-feedback" role="alert">
              <p>Não foi possível carregar os usuários.</p>
              <button type="button" className="admin-button" onClick={recarregarUsuarios}>Tentar novamente</button>
            </div>
          )}
          {resultado && usuarios.length === 0 && <p role="status">Nenhum usuário encontrado nesta página.</p>}
          <ul className="admin-users">
            {ordenados.map((usuario) => (
              <li key={usuario.id} className="admin-user">
                <div className="admin-user-details">
                  <h3>{usuario.nome}</h3>
                  <p>{usuario.email}</p>
                  <span className={usuario.verificado ? 'admin-status is-verified' : 'admin-status'}>
                    {usuario.verificado ? 'Verificado' : 'Não verificado'}
                    {usuario.role && ` · ${nomePerfil(usuario.role)}`}
                  </span>
                </div>
                {!usuario.verificado && (
                  <div className="admin-user-action">
                    <button
                      type="button"
                      className="admin-button"
                      aria-label={`Verificar ${usuario.nome}`}
                      aria-expanded={usuarioEmEdicao === usuario.id}
                      aria-controls={`verificar-${usuario.id}`}
                      onClick={() => setUsuarioEmEdicao(usuarioEmEdicao === usuario.id ? null : usuario.id)}
                    >
                      Verificar
                    </button>
                    <div id={`verificar-${usuario.id}`}>
                      {usuarioEmEdicao === usuario.id && (
                        <form className="admin-role-form" onSubmit={(event) => revisarVerificacao(event, usuario)}>
                          <label htmlFor={`perfil-${usuario.id}`}>Perfil de acesso</label>
                          <select id={`perfil-${usuario.id}`} name="perfil" defaultValue="" ref={selecaoRef} required>
                            <option value="" disabled>Selecione um perfil</option>
                            {Object.entries(perfis).map(([perfil, nome]) => <option key={perfil} value={perfil}>{nome}</option>)}
                          </select>
                          <button type="submit" className="admin-button">Continuar</button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {resultado && (pagina > 0 || resultado.temProxima) && (
            <nav className="admin-pagination" aria-label="Paginação de usuários">
              <button type="button" className="admin-button" disabled={pagina === 0} onClick={() => { limparSelecao(); mudarPagina(pagina - 1); }}>Anterior</button>
              <span>Página {pagina + 1}{resultado.totalPaginas ? ` de ${resultado.totalPaginas}` : ''}</span>
              <button type="button" className="admin-button" disabled={!resultado.temProxima} onClick={() => { limparSelecao(); mudarPagina(pagina + 1); }}>Próxima</button>
            </nav>
          )}
        </section>
      </main>

      <dialog
        className="admin-dialog"
        ref={dialogRef}
        aria-labelledby="verify-title"
        aria-describedby="verify-description"
        onClose={() => setConfirmacao(null)}
        onCancel={(event) => { if (salvando) event.preventDefault(); }}
      >
        <h2 id="verify-title">Confirmar verificação?</h2>
        <p id="verify-description">
          Deseja verificar <strong>{confirmacao?.usuario.nome}</strong> e atribuir o perfil de <strong>{confirmacao && perfis[confirmacao.perfil]}</strong>?
        </p>
        {erroVerificacao && <p role="alert">{erroVerificacao}</p>}
        <div className="admin-dialog-actions">
          <button type="button" className="admin-button admin-button-secondary" disabled={salvando} onClick={() => dialogRef.current?.close()}>Cancelar</button>
          <button type="button" className="admin-button" disabled={salvando} onClick={confirmarVerificacao}>{salvando ? 'Verificando…' : 'Confirmar verificação'}</button>
        </div>
      </dialog>
    </div>
  );
}
