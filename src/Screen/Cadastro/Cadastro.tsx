import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import '../Login/Login.css'
import './Cadastro.css'

function PasswordField({ id, label, placeholder, describedBy, invalid, onChange }: {
  id: string; label: string; placeholder: string; describedBy?: string; invalid?: boolean; onChange: () => void
}) {
  const [visible, setVisible] = useState(false)
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
  </div>
}

export default function Cadastro() {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Cadastro | TechFixOrg'
    return () => { document.title = previousTitle }
  }, [])
  function clearFeedback() { setError(''); setMessage('') }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!String(data.get('name') ?? '').trim()) {
      setError('Informe seu nome completo.')
      formRef.current?.querySelector<HTMLInputElement>('#name')?.focus()
      return
    }
    if (data.get('password') !== data.get('confirmation')) {
      setError('As senhas não coincidem. Confira a confirmação.')
      formRef.current?.querySelector<HTMLInputElement>('#confirmation')?.focus()
      return
    }
    setError('')
    setMessage('O cadastro estará disponível após a integração com o sistema de autenticação. Nenhuma conta foi criada.')
  }
  return (
    <main className="login-page register-page">
      <header className="brand">
        <span className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z" />
          </svg>
        </span>
        <h1>TechFix<span>Org</span></h1>
      </header>
      <div className="login-layout">
      <aside className="login-story" aria-labelledby="register-story-title">
        <p className="story-eyebrow">PORTAL DA EQUIPE · ASSISTÊNCIA TÉCNICA</p>
        <h2 id="register-story-title">O próximo reparo<br />começa com <em>você.</em></h2>
        <p className="story-description">Crie seu acesso ao portal e faça parte do cuidado com cada aparelho que chega à nossa bancada.</p>
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
      <section className="login-card register-card" aria-labelledby="register-title">
        <span className="welcome-label"><span aria-hidden="true" /> CADASTRO DE FUNCIONÁRIOS</span>
        <h2 id="register-title">Faça parte<span> da nossa equipe.</span></h2>
        <p className="login-description">Preencha seus dados para criar seu acesso ao portal da equipe.</p>
        <form ref={formRef} onSubmit={handleSubmit} aria-labelledby="register-title">
          <div className="form-field">
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" type="text" autoComplete="name" placeholder="Como você se chama?" required maxLength={120} onChange={clearFeedback} aria-describedby={error && error.startsWith('Informe') ? 'register-error' : undefined} aria-invalid={error.startsWith('Informe') || undefined} />
          </div>
          <div className="form-field">
            <label htmlFor="register-email">E-mail de acesso</label>
            <input id="register-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="Seu e-mail de acesso" required onChange={clearFeedback} />
          </div>
          <PasswordField id="password" label="Senha" placeholder="Crie uma senha" describedBy="password-hint" onChange={clearFeedback} />
          <p className="password-hint" id="password-hint">Use pelo menos 8 caracteres.</p>
          <PasswordField id="confirmation" label="Confirmar senha" placeholder="Digite a senha novamente" invalid={error.startsWith('As senhas')} describedBy={error.startsWith('As senhas') ? 'register-error' : undefined} onChange={clearFeedback} />
          {error && <p className="register-error" id="register-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit">Criar minha conta <span aria-hidden="true">→</span></button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>
        <p className="signup-prompt">Já tem uma conta? <Link to="/login">Entre aqui</Link></p>
        <div className="login-note"><span aria-hidden="true">✦</span> Área interna da equipe TechFixOrg.</div>
      </section>
      </div>
      <footer className="login-footer">TechFixOrg <span aria-hidden="true">·</span> Assistência técnica para quem precisa voltar a se conectar.</footer>
    </main>
  )
}
