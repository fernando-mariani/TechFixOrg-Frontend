import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import '../Tecnico/Home/Home.css';
import './Admin.css';

const perfis = ['Gerente', 'Técnico'] as const;
type Perfil = typeof perfis[number];
type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil | null;
};

const usuariosExemplo: Usuario[] = [
  { id: 1, nome: 'Mariana Costa', email: 'mariana.costa@example.com', perfil: null },
  { id: 2, nome: 'Rafael Lima', email: 'rafael.lima@example.com', perfil: null },
  { id: 3, nome: 'Camila Santos', email: 'camila.santos@example.com', perfil: 'Gerente' },
  { id: 4, nome: 'Lucas Oliveira', email: 'lucas.oliveira@example.com', perfil: 'Técnico' },
];

export default function Admin() {
  const [usuarios, setUsuarios] = useState(usuariosExemplo);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<number | null>(null);
  const [confirmacao, setConfirmacao] = useState<{ usuario: Usuario; perfil: Perfil; } | null>(null);
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

  const ordenados = [...usuarios].sort((a, b) => Number(!!a.perfil) - Number(!!b.perfil));

  function revisarVerificacao(event: FormEvent<HTMLFormElement>, usuario: Usuario) {
    event.preventDefault();
    const valor = new FormData(event.currentTarget).get('perfil');
    const perfil = perfis.find((opcao) => opcao === valor);
    if (!perfil) return;

    setConfirmacao({ usuario, perfil });
  }

  function verificarUsuario() {
    if (!confirmacao) return;
    const { usuario, perfil } = confirmacao;
    dialogRef.current?.close();
    setUsuarios((atuais) => atuais.map((item) => item.id === usuario.id ? { ...item, perfil } : item));
    setUsuarioEmEdicao(null);
    setMensagem(`${usuario.nome} foi verificado com o perfil de ${perfil}.`);
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
          <p className="home-demo">Prévia com usuários fictícios. As alterações duram até sair da tela.</p>
        </section>

        <section className="home-orders" aria-labelledby="users-title">
          <div className="home-section-heading">
            <h2 id="users-title" ref={tituloRef} tabIndex={-1}>Usuários <span className="home-count">{usuarios.length}</span></h2>
            <p>As contas não verificadas aparecem primeiro.</p>
          </div>
          <div className="admin-feedback" role="status">{mensagem}</div>
          <ul className="admin-users">
            {ordenados.map((usuario) => (
              <li key={usuario.id} className="admin-user">
                <div className="admin-user-details">
                  <h3>{usuario.nome}</h3>
                  <p>{usuario.email}</p>
                  <span className={usuario.perfil ? 'admin-status is-verified' : 'admin-status'}>
                    {usuario.perfil ? `Verificado · ${usuario.perfil}` : 'Não verificado'}
                  </span>
                </div>
                {!usuario.perfil && (
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
                            {perfis.map((perfil) => <option key={perfil} value={perfil}>{perfil}</option>)}
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
        </section>
      </main>

      <dialog
        className="admin-dialog"
        ref={dialogRef}
        aria-labelledby="verify-title"
        aria-describedby="verify-description"
        onClose={() => setConfirmacao(null)}
      >
        <h2 id="verify-title">Confirmar verificação?</h2>
        <p id="verify-description">
          Deseja verificar <strong>{confirmacao?.usuario.nome}</strong> e atribuir o perfil de <strong>{confirmacao?.perfil}</strong>?
        </p>
        <div className="admin-dialog-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={() => dialogRef.current?.close()}>Cancelar</button>
          <button type="button" className="admin-button" onClick={verificarUsuario}>Confirmar verificação</button>
        </div>
      </dialog>
    </div>
  );
}
