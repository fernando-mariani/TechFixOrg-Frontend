import './Sidebar.css';

const itens = [
  { nome: 'Visão geral', icone: 'M3 10l9-7 9 7v10H3z M9 20v-6h6v6' },
  { nome: 'Pedidos', icone: 'M6 4h12v16H6z M9 9h6 M9 13h6 M9 17h4' },
  { nome: 'Equipe', icone: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M18 15a4 4 0 0 1 3 4v2 M14 5a4 4 0 0 1 0 7 M14 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' },
  { nome: 'Perfil', icone: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' },
  { nome: 'Configurações', icone: 'M4 6h16 M4 12h16 M4 18h16 M8 4v4 M16 10v4 M10 16v4' },
  { nome: 'Ajuda', icone: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z M9 9a3 3 0 1 1 4 2.8c-.7.3-1 1-1 2.2 M12 17h.01' },
];

function ItensMenu() {
  return <ul className="sidebar-items">
    {itens.map(({ nome, icone }) => (
      <li key={nome}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={icone} />
        </svg>
        {nome}
      </li>
    ))}
  </ul>;
}

export default function Sidebar() {
  return <aside className="portal-sidebar" aria-label="Menu do portal">
    <div className="sidebar-desktop">
      <p className="sidebar-title">Menu do portal</p>
      <ItensMenu />
    </div>
    <details className="sidebar-mobile">
      <summary>
        Menu do portal
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ItensMenu />
    </details>
  </aside>;
}
