import AuthLayout from '../../components/AuthLayout';
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
      else if (user.role === 'GERENTE') navigate('/gerente/home', { replace: true });
      else setMessage(`Bem-vindo ao portal, ${user.nome}.`);
    } catch (erro) {
      setError(erro instanceof Error ? erro.message : 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout>
      <section className="login-card" aria-labelledby="login-title">
        <span className="welcome-label">Portal da equipe</span>
        <h1 id="login-title">Entrar no portal</h1>
        <p className="login-description">Use seu e-mail de funcionário para acessar a bancada.</p>
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
          <button className="login-submit" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Acessar portal'} <span aria-hidden="true">→</span></button>
          {error && <p className="login-message" role="alert">{error}</p>}
          {message && <p className="login-message" role="status">{message}</p>}
        </form>
        <p className="signup-prompt">Não tem uma conta? <Link to="/cadastro">Crie aqui</Link></p>
      </section>
    </AuthLayout>
  );
}
