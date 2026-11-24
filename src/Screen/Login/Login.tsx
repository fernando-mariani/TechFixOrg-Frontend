import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/useAuth';
import './Login.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando) return;
    const dados = new FormData(event.currentTarget);
    setMessage('');
    setError('');
    setEnviando(true);

    try {
      const user = await login({
        email: String(dados.get('email')).trim(),
        senha: String(dados.get('password')),
      }, dados.has('remember'));

      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'TECNICO') navigate('/tecnico/home', { replace: true });
      else setMessage(`Bem-vindo ao portal, ${user.nome}.`);
    } catch (erro) {
      setError(erro instanceof Error ? erro.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-page">
      <header className="brand">
        <span className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z" />
          </svg>
        </span>
        <h1>TechFix<span>Org</span></h1>
      </header>
      <div className="login-layout">
      <aside className="login-story" aria-labelledby="story-title">
        <p className="story-eyebrow">PORTAL DA EQUIPE · ASSISTÊNCIA TÉCNICA</p>
        <h2 id="story-title">Cada aparelho,<br />um novo <em>começo.</em></h2>
        <p className="story-description">Consulte as solicitações de suporte e acompanhe os aparelhos que precisam do cuidado da nossa equipe.</p>
        <div className="connection-art" aria-hidden="true">
          <svg viewBox="0 0 520 280" fill="none">
            <path d="M28 221C83 252 123 217 128 174S192 118 213 173s65 61 98 30 91-34 166 12" stroke="#35483b" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round" />
            <g transform="rotate(-9 133 128)" stroke="#4ade80" strokeWidth="3">
              <rect x="87" y="43" width="92" height="163" rx="17" fill="#202923" />
              <rect x="97" y="57" width="72" height="127" rx="8" fill="#171c19" stroke="#3a5141" strokeWidth="1.5" />
              <path d="M119 51h27M126 195h14" strokeLinecap="round" />
              <path d="m127 103-11 20 18 8-8 22 24-29-19-8 10-18" stroke="#edaa76" strokeWidth="2" strokeLinejoin="round" />
            </g>
            <g transform="rotate(5 337 138)" stroke="#4ade80" strokeWidth="3" strokeLinejoin="round">
              <rect x="237" y="66" width="191" height="124" rx="9" fill="#202923" />
              <rect x="248" y="77" width="169" height="101" rx="3" fill="#171c19" stroke="#3a5141" strokeWidth="1.5" />
              <path d="m237 190-21 19q-2 5 6 5h222q8 0 6-5l-22-19M309 198h47" />
              <path d="m307 126 17 17 32-34" stroke="#edaa76" strokeLinecap="round" />
            </g>
            <path stroke="#edaa76" strokeWidth="3" strokeLinecap="round" d="m211 52 3-15m11 25 12-9m-40 8-10-8" />
            <circle cx="465" cy="119" r="5" fill="#edaa76" />
          </svg>
          <span className="art-caption">do diagnóstico ao reparo.</span>
        </div>
        <p className="story-signature"><span aria-hidden="true">✳</span> Celulares, computadores e outros eletrônicos.</p>
      </aside>
      <section className="login-card" aria-labelledby="login-title">
        <span className="welcome-label"><span aria-hidden="true" /> ACESSO DOS FUNCIONÁRIOS</span>
        <h2 id="login-title">Vamos cuidar<span> dos próximos reparos?</span></h2>
        <p className="login-description">Entre com sua conta de funcionário para consultar as solicitações de assistência técnica.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">E-mail de acesso</label>
            <input id="email" name="email" type="email" autoComplete="username" placeholder="Seu e-mail cadastrado" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Senha</label>
            <div className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" required />
              <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && <path d="m3 3 18 18" />}
                </svg>
              </button>
            </div>
          </div>
          <label className="remember-me"><input type="checkbox" name="remember" /> Lembrar de mim</label>
          <button className="login-submit" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Acessar portal da equipe'} <span aria-hidden="true">→</span></button>
          {error && <p className="login-message" role="alert">{error}</p>}
          {message && <p className="login-message" role="status">{message}</p>}
        </form>
        <p className="signup-prompt">Não tem uma conta? <Link to="/cadastro">Crie aqui</Link></p>
        <div className="login-note"><span aria-hidden="true">✦</span> Área interna da equipe TechFixOrg.</div>
      </section>
      </div>
      <footer className="login-footer">TechFixOrg <span aria-hidden="true">·</span> Assistência técnica para quem precisa voltar a se conectar.</footer>
    </main>
  );
}

