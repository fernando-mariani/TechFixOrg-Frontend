import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="login-page">
      <aside className="login-story" aria-label="TechFixOrg" data-enter>
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z" />
            </svg>
          </span>
          <span>TechFix<strong>Org</strong></span>
        </div>
        <div className="story-copy">
          <p className="story-eyebrow">Assistência técnica</p>
          <p className="story-title">Do diagnóstico <em>ao reparo.</em></p>
          <p>O portal da equipe para acompanhar solicitações e organizar os reparos da bancada.</p>
        </div>
        <ol className="repair-flow" aria-label="Etapas da assistência técnica">
          <li><span aria-hidden="true">↘</span> Solicitação</li>
          <li><span aria-hidden="true">◎</span> Diagnóstico</li>
          <li><span aria-hidden="true">✓</span> Reparo</li>
        </ol>
      </aside>
      <div className="auth-content">
        {children}
        <footer className="login-footer">TechFixOrg · Portal interno da equipe</footer>
      </div>
    </main>
  );
}
