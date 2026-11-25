import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link } from 'react-router';
import type { ConsultaPedidos, PaginaPedidos, Pedido, StatusPedido } from '../../types/PedidoTypes';
import LoadingRows from '../../components/LoadingRows';
import { categorias } from './categorias';
import type { Categoria } from '../../types/TecnicoTypes';
import '../Tecnico/Home/Home.css';

const consultaInicial: ConsultaPedidos = { busca: '', categorias: [], ordenarPreco: '', pagina: 0, tamanho: 10 };
const opcoesCategoria = Object.keys(categorias) as Categoria[];
const statusPedido: Record<StatusPedido, string> = {
  AGUARDANDO_VERIFICACAO: 'Aguardando verificação',
  AGUARDANDO_CONFIRMACAO: 'Aguardando confirmação',
  PENDENTE: 'Pendente',
  PRONTO: 'Pronto',
};
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

type Resultado = { consulta: ConsultaPedidos; dados: PaginaPedidos | null; };

type FilaProps = {
  listarPedidos: (consulta: ConsultaPedidos, signal: AbortSignal) => Promise<PaginaPedidos>;
  nome: string | null;
  gerente?: boolean;
  estadoPerfil?: ReactNode;
  filtroTecnico?: ReactNode;
  acaoPedido?: (pedido: Pedido, atualizar: () => void) => ReactNode;
};

export function FilaPedidos({ listarPedidos, nome, gerente, estadoPerfil, filtroTecnico, acaoPedido }: FilaProps) {
  const [consulta, setConsulta] = useState(consultaInicial);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const carregando = resultado?.consulta !== consulta;
  const dados = carregando ? null : resultado.dados;

  useEffect(() => {
    const title = document.title;
    document.title = gerente ? 'Início do gerente | TechFixOrg' : 'Início do técnico | TechFixOrg';
    return () => { document.title = title; };
  }, [gerente]);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        const dados = await listarPedidos(consulta, controller.signal);
        if (!controller.signal.aborted) setResultado({ consulta, dados });
      } catch {
        if (!controller.signal.aborted) setResultado({ consulta, dados: null });
      }
    }

    void carregar();
    return () => controller.abort();
  }, [consulta, listarPedidos]);

  function aplicarFiltros(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const campos = new FormData(evento.currentTarget);
    const selecionadas = campos.getAll('categoria');
    const ordem = campos.get('ordenarPreco');

    setConsulta({
      busca: String(campos.get('busca') ?? '').trim(),
      categorias: opcoesCategoria.filter((categoria) => selecionadas.includes(categoria)),
      ordenarPreco: ordem === 'ASC' || ordem === 'DESC' ? ordem : '',
      pagina: 0,
      tamanho: Number(campos.get('tamanho')),
      ...(filtroTecnico && { tecnicoId: String(campos.get('tecnicoId') ?? '') }),
    });
  }

  function irParaPagina(pagina: number) {
    setConsulta({ ...consulta, pagina });
  }

  return <div className="technician-home">
    <a className="home-skip" href="#home-content">Ir para o conteúdo</a>
    <header className="home-header">
      <Link className="home-brand" to={gerente ? "/gerente/home" : "/tecnico/home"} aria-label="TechFixOrg, início">
        <span className="home-brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 6a5 5 0 0 0-6 6l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6-6l-3 3-3-3 3-3Z" /></svg></span>
        <span>TechFix<span className="home-brand-org">Org</span></span>
      </Link>
      <span className="home-account">{gerente ? 'Área do gerente' : 'Área do técnico'}{nome && <> <span aria-hidden="true">/</span> {nome}</>}</span>
    </header>
    <main id="home-content" className="home-content" tabIndex={-1}>
      <section className="home-welcome" aria-labelledby="home-title">
        <p className="home-eyebrow">Assistência técnica</p>
        <h1 id="home-title">Boas-vindas{nome ? <>, <em>{nome}.</em></> : '.'}</h1>
        {estadoPerfil}
      </section>
      <section className="home-orders" aria-labelledby="orders-title">
        <div className="home-section-heading">
          <div>
            <h2 id="orders-title">{gerente ? 'Pedidos' : 'Meus pedidos'} {dados && <span className="home-count">{dados.page.totalElements}</span>}</h2>
          </div>
        </div>
        <form className={filtroTecnico ? 'home-filters home-filters--team' : 'home-filters'} role="search" aria-label="Filtrar pedidos" onSubmit={aplicarFiltros} onReset={() => setConsulta(consultaInicial)}>
          <div className="home-filter home-search">
            <label htmlFor="order-search">Pesquisar pedido</label>
            <input id="order-search" type="search" name="busca" placeholder="Título ou descrição" />
          </div>
          <div className="home-filter">
            <label htmlFor="order-price">Ordenar por preço</label>
            <select id="order-price" name="ordenarPreco">
              <option value="">Mais recentes</option>
              <option value="ASC">Menor preço</option>
              <option value="DESC">Maior preço</option>
            </select>
          </div>
          <div className="home-filter">
            <label htmlFor="order-size">Pedidos por página</label>
            <select id="order-size" name="tamanho" defaultValue={consultaInicial.tamanho}>
              {[10, 20, 50].map((tamanho) => <option key={tamanho} value={tamanho}>{tamanho}</option>)}
            </select>
          </div>
          {filtroTecnico}
          <fieldset className="home-categories">
            <legend>Categorias</legend>
            {opcoesCategoria.map((categoria) => (
              <label key={categoria}><input type="checkbox" name="categoria" value={categoria} /> {categorias[categoria]}</label>
            ))}
          </fieldset>
          <div className="home-filter-actions">
            <button className="home-clear" type="submit">Aplicar filtros</button>
            <button className="home-clear" type="reset">Limpar filtros</button>
          </div>
        </form>

        {carregando && <LoadingRows label="Carregando pedidos…" />}
        {!carregando && !dados && (
          <div className="home-empty">
            <p role="alert">Não foi possível carregar os pedidos.</p>
            <button className="home-clear" type="button" onClick={() => irParaPagina(consulta.pagina)}>Tentar novamente</button>
          </div>
        )}
        {dados && <>
          {dados.content.length === 0 ? (
            <div className="home-empty"><h3>Nenhum pedido encontrado</h3><p>Experimente ajustar a busca ou limpar os filtros.</p></div>
          ) : (
            <ul className="home-order-list">
              {dados.content.map((pedido) => (
                <li key={pedido.id} className={gerente && pedido.status === 'PRONTO' ? 'home-order gerente-finalizado' : 'home-order'}>
                  <div className="home-order-detail">
                    <span className="home-order-category">{categorias[pedido.categoria]}</span>
                    <h3>{pedido.titulo}</h3>
                    <p className="home-client">{pedido.nomeCliente}</p>
                    <p>{pedido.descricao}</p>
                  </div>
                  <div className="home-order-meta">
                    <span className="home-order-status" data-status={pedido.status}>
                      {gerente && pedido.status === 'PRONTO'
                        ? <><span aria-hidden="true">✓ </span>Finalizado</>
                        : statusPedido[pedido.status]}
                    </span>
                    <div className="home-order-price">
                      <span>Preço</span>
                      <strong>{pedido.preco == null ? 'A definir' : moeda.format(pedido.preco)}</strong>
                    </div>
                  </div>
                  {acaoPedido?.(pedido, () => irParaPagina(consulta.pagina))}
                </li>
              ))}
            </ul>
          )}
          {(dados.page.totalPages > 1 || dados.page.number > 0) && (
            <nav className="home-pagination" aria-label="Paginação dos pedidos">
              <button className="home-clear" type="button" disabled={dados.page.number === 0} onClick={() => irParaPagina(dados.page.number - 1)}>Anterior</button>
              <span>Página {dados.page.number + 1}{dados.page.totalPages > dados.page.number && <> de {dados.page.totalPages}</>}</span>
              <button className="home-clear" type="button" disabled={dados.page.number + 1 >= dados.page.totalPages} onClick={() => irParaPagina(dados.page.number + 1)}>Próxima</button>
            </nav>
          )}
        </>}
      </section>
    </main>
    <footer className="home-footer">TechFixOrg <span aria-hidden="true">·</span> Portal interno da equipe</footer>
  </div>;
}

