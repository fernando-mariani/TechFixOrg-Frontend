import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router'
import { pedidosExemplo } from './pedidos'
import type { Pedido } from './pedidos'
import './Home.css'

type HomeProps = { nomeTecnico?: string; pedidos?: Pedido[] }
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
const displayDate = (date: string) => dateFormatter.format(new Date(`${date}T12:00:00`))

export default function Home({ nomeTecnico = 'Alex', pedidos = pedidosExemplo }: HomeProps) {
  const [pesquisa, setPesquisa] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [expandido, setExpandido] = useState(false)
  const listId = useId()
  const demonstration = pedidos === pedidosExemplo
  useEffect(() => {
    const title = document.title
    document.title = 'Início do técnico | TechFixOrg'
    return () => { document.title = title }
  }, [])
  const pendentes = pedidos.filter((pedido) => pedido.status !== 'Concluído')
  const intervaloInvalido = !!(inicio && fim && inicio > fim)
  const termo = normalize(pesquisa.trim())
  const filtrados = intervaloInvalido ? [] : pendentes.filter((pedido) =>
    normalize(`${pedido.nome} ${pedido.cliente} ${pedido.descricao} ${pedido.id}`).includes(termo)
    && (!inicio || pedido.dataLimite >= inicio)
    && (!fim || pedido.dataLimite <= fim)
  ).sort((a, b) => a.dataLimite.localeCompare(b.dataLimite) || a.id.localeCompare(b.id))
  const visiveis = expandido ? filtrados : filtrados.slice(0, 3)
  const temFiltros = !!(pesquisa || inicio || fim)
  function limparFiltros() { setPesquisa(''); setInicio(''); setFim(''); setExpandido(false) }

  return <div className="technician-home">
    <a className="home-skip" href="#home-content">Ir para o conteúdo</a>
    <header className="home-header">
      <Link className="home-brand" to="/tecnico/home" aria-label="TechFixOrg, início do técnico">
        <span className="home-brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z" /></svg></span>
        <span>TechFix<span className="home-brand-org">Org</span></span>
      </Link>
      <span className="home-account">Área do técnico <span aria-hidden="true">/</span> {nomeTecnico}</span>
    </header>
    <main id="home-content" className="home-content" tabIndex={-1}>
      <section className="home-welcome" aria-labelledby="home-title">
        <p className="home-eyebrow">SUA BANCADA · VISÃO GERAL</p>
        <h1 id="home-title">Boas-vindas, <em>{nomeTecnico}.</em></h1>
        <p>Confira os próximos prazos e organize os reparos da sua bancada.</p>
        {demonstration && <p className="home-demo">Prévia com nome e pedidos de demonstração.</p>}
      </section>
      <section className="home-orders" aria-labelledby="orders-title">
        <div className="home-section-heading">
          <div><p className="home-eyebrow">FILA DE TRABALHO</p><h2 id="orders-title">Pedidos pendentes <span className="home-count">{pendentes.length}</span></h2></div>
          <p>Os prazos mais próximos aparecem primeiro.</p>
        </div>
        <form className="home-filters" role="search" aria-label="Filtrar pedidos pendentes" onSubmit={(event) => event.preventDefault()}>
          <div className="home-filter home-search"><label htmlFor="order-search">Pesquisar pedido</label><input id="order-search" type="search" placeholder="Nome, cliente ou descrição" value={pesquisa} onChange={(event) => { setPesquisa(event.target.value); setExpandido(false) }} /></div>
          <div className="home-filter"><label htmlFor="deadline-start">Data limite: de</label><input id="deadline-start" type="date" value={inicio} aria-invalid={intervaloInvalido} aria-describedby={intervaloInvalido ? 'date-error' : undefined} onChange={(event) => { setInicio(event.target.value); setExpandido(false) }} /></div>
          <div className="home-filter"><label htmlFor="deadline-end">Até</label><input id="deadline-end" type="date" value={fim} aria-invalid={intervaloInvalido} aria-describedby={intervaloInvalido ? 'date-error' : undefined} onChange={(event) => { setFim(event.target.value); setExpandido(false) }} /></div>
          <button className="home-clear" type="button" onClick={limparFiltros} disabled={!temFiltros}>Limpar filtros</button>
        </form>
        {intervaloInvalido && <p className="home-date-error" id="date-error" role="alert">A data final deve ser igual ou posterior à data inicial.</p>}
        <div className="home-results" role="status">{intervaloInvalido ? 'Revise o intervalo de datas.' : `Mostrando ${visiveis.length} de ${filtrados.length} ${filtrados.length === 1 ? 'pedido' : 'pedidos'}${temFiltros ? ' encontrados' : ' pendentes'}.`}</div>
        <ul className="home-order-list" id={listId}>
          {visiveis.map((pedido) => <li key={pedido.id} className="home-order">
            <div className="home-order-reference"><span>{pedido.id}</span><span className="home-order-status">{pedido.status}</span></div>
            <div className="home-order-detail"><h3>{pedido.nome}</h3><p className="home-client">{pedido.cliente}</p><p>{pedido.descricao}</p></div>
            <div className="home-order-deadline"><span>Data limite</span><time dateTime={pedido.dataLimite}>{displayDate(pedido.dataLimite)}</time></div>
          </li>)}
        </ul>
        {!filtrados.length && !intervaloInvalido && <div className="home-empty"><h3>{temFiltros ? 'Nenhum pedido encontrado' : 'Sua bancada está em dia'}</h3><p>{temFiltros ? 'Tente outro nome, descrição ou intervalo de datas.' : 'Não há pedidos pendentes no momento.'}</p>{temFiltros && <button className="home-clear" onClick={limparFiltros}>Limpar filtros</button>}</div>}
        {filtrados.length > 3 && <button className="home-expand" type="button" aria-expanded={expandido} aria-controls={listId} onClick={() => setExpandido(!expandido)}>{expandido ? 'Mostrar apenas os 3 próximos' : `Ver todos os pedidos (${filtrados.length})`}<span aria-hidden="true">{expandido ? '−' : '+'}</span></button>}
      </section>
    </main>
    <footer className="home-footer">TechFixOrg <span aria-hidden="true">·</span> Cada reparo, um novo começo.</footer>
  </div>
}
