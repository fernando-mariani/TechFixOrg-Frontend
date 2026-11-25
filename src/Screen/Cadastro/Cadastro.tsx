import AuthLayout from '../../components/AuthLayout';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/useAuth';
import '../Login/Login.css';
import './Cadastro.css';

function PasswordField({ id, label, placeholder, describedBy, invalid, onChange }: {
  id: string; label: string; placeholder: string; describedBy?: string; invalid?: boolean; onChange: () => void;
}) {
  const [visible, setVisible] = useState(false);
  return <div className="form-field">
    <label htmlFor={id}>{label}</label>
    <div className="password-field">
      <input id={id} name={id} type={visible ? 'text' : 'password'} autoComplete="new-password" placeholder={placeholder} minLength={8} required aria-describedby={describedBy} aria-invalid={invalid || undefined} onChange={onChange} />
      <button className="password-toggle" type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`} aria-pressed={visible}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </div>
  </div>;
}

export default function Cadastro() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { cadastrar } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Cadastro | TechFixOrg';
    return () => { document.title = previousTitle; };
  }, []);
  function clearFeedback() { setError(''); setMessage(''); }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nome = String(data.get('name') ?? '').trim();
    if (!nome) {
      setError('Informe seu nome completo.');
      formRef.current?.querySelector<HTMLInputElement>('#name')?.focus();
      return;
    }
    if (data.get('password') !== data.get('confirmation')) {
      setError('As senhas não coincidem. Confira a confirmação.');
      formRef.current?.querySelector<HTMLInputElement>('#confirmation')?.focus();
      return;
    }
    clearFeedback();
    setEnviando(true);
    try {
      await cadastrar({ nome, email: String(data.get('email')).trim(), senha: String(data.get('password')) });
      form.reset();
      setMessage('Cadastro realizado. Aguarde a verificação da sua conta pela administração.');
    } catch (erro) {
      setError(erro instanceof Error ? erro.message : 'Não foi possível realizar o cadastro.');
    } finally {
      setEnviando(false);
    }
  }
  return (
    <AuthLayout>
      <section className="login-card register-card" aria-labelledby="register-title">
        <span className="welcome-label">Cadastro de funcionários</span>
        <h1 id="register-title">Criar conta</h1>
        <p className="login-description">Preencha seus dados para criar seu acesso ao portal da equipe.</p>
        <form ref={formRef} onSubmit={handleSubmit} aria-labelledby="register-title">
          <div className="form-field">
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" type="text" autoComplete="name" placeholder="Como você se chama?" required maxLength={100} onChange={clearFeedback} aria-describedby={error && error.startsWith('Informe') ? 'register-error' : undefined} aria-invalid={error.startsWith('Informe') || undefined} />
          </div>
          <div className="form-field">
            <label htmlFor="register-email">E-mail de acesso</label>
            <input id="register-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="Seu e-mail de acesso" required onChange={clearFeedback} />
          </div>
          <PasswordField id="password" label="Senha" placeholder="Crie uma senha" describedBy="password-hint" onChange={clearFeedback} />
          <p className="password-hint" id="password-hint">Use pelo menos 8 caracteres.</p>
          <PasswordField id="confirmation" label="Confirmar senha" placeholder="Digite a senha novamente" invalid={error.startsWith('As senhas')} describedBy={error.startsWith('As senhas') ? 'register-error' : undefined} onChange={clearFeedback} />
          {error && <p className="register-error" id="register-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={enviando}>{enviando ? 'Cadastrando…' : 'Criar minha conta'} <span aria-hidden="true">→</span></button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>
        <p className="signup-prompt">Já tem uma conta? <Link to="/login">Entre aqui</Link></p>
      </section>
    </AuthLayout>
  );
}
