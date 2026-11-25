import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useGerente } from '../../context/useGerente';
import type { TecnicoDisponivel } from '../../context/useGerente';
import type { Pedido } from '../../types/PedidoTypes';
import { categorias } from '../Pedidos/categorias';
import { FilaPedidos } from '../Pedidos/FilaPedidos';
import './Gerente.css';

type ListaTecnicos = {
  tecnicos: TecnicoDisponivel[] | null;
  erroLista: boolean;
  tentarNovamente: () => void;
};

function Atribuicao({ pedido, fechar, concluir, tecnicos, erroLista, tentarNovamente }: ListaTecnicos & {
  pedido: Pedido;
  fechar: () => void;
  concluir: () => void;
}) {
  const { atribuirPedido } = useGerente();
  const dialogo = useRef<HTMLDialogElement>(null);
  const [tecnicoId, setTecnicoId] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const tecnicoSelecionado = tecnicos?.find((tecnico) => tecnico.id === tecnicoId);

  useEffect(() => {
    const elemento = dialogo.current;
    elemento?.showModal();
    return () => { elemento?.close(); };
  }, []);

  async function confirmar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvando || !tecnicoSelecionado) return;
    const valor = new FormData(evento.currentTarget).get('preco');
    const preco = Number(valor);
    if (typeof valor !== 'string' || !valor.trim() || !Number.isFinite(preco) || preco < 0) {
      setErro('Informe um preço válido.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      await atribuirPedido(pedido.id, tecnicoSelecionado.id, preco);
      concluir();
    } catch (falha) {
      setErro(falha instanceof Error && falha.name !== 'TypeError' && falha.message
        ? falha.message : 'Não foi possível atribuir o pedido. Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <dialog className="gerente-dialogo" ref={dialogo} aria-labelledby="atribuicao-titulo" onCancel={(evento) => {
      evento.preventDefault();
      if (!salvando) fechar();
    }}>
      <h2 id="atribuicao-titulo">Atribuir pedido</h2>
      <p>{pedido.titulo}</p>
      <form onSubmit={confirmar}>
        {!tecnicos && !erroLista && <p role="status">Carregando técnicos disponíveis…</p>}
        {erroLista && <div>
          <p role="alert">Não foi possível carregar os técnicos.</p>
          <button className="home-clear" type="button" onClick={tentarNovamente}>Tentar novamente</button>
        </div>}
        {tecnicos?.length === 0 && <p role="status">Nenhum técnico disponível.</p>}
        {!!tecnicos?.length && (
          <details className="gerente-seletor">
            <summary>Técnico · {tecnicoSelecionado?.nome ?? 'Selecione um técnico'}</summary>
            <fieldset disabled={salvando}>
              <legend>Técnicos disponíveis</legend>
              {tecnicos.map((tecnico) => (
                <label key={tecnico.id} className="gerente-opcao">
                  <input type="radio" name="tecnico" value={tecnico.id} checked={tecnico.id === tecnicoId} onChange={() => setTecnicoId(tecnico.id)} />
                  <span>
                    <strong>{tecnico.nome}</strong>
                    <small>{tecnico.categorias.map((categoria) => categorias[categoria] ?? categoria).join(' · ') || 'Sem categorias'}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          </details>
        )}
        <div className="home-filter">
          <label htmlFor="atribuicao-preco">Preço (R$)</label>
          <input id="atribuicao-preco" name="preco" type="number" inputMode="decimal" min="0" step="0.01" defaultValue={pedido.preco ?? ''} disabled={salvando} required />
        </div>
        {erro && <p role="alert">{erro}</p>}
        <div className="gerente-acoes">
          <button className="home-clear" type="button" disabled={salvando} onClick={fechar}>Cancelar</button>
          <button className="home-clear" type="submit" disabled={salvando || !tecnicoSelecionado}>{salvando ? 'Atribuindo…' : 'Confirmar atribuição'}</button>
        </div>
      </form>
    </dialog>
  );
}

function ReenviarEmail({ pedido }: { pedido: Pedido }) {
  const { reenviarEmail } = useGerente();
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{ texto: string; erro: boolean } | null>(null);

  async function reenviar() {
    if (enviando) return;
    setEnviando(true);
    setFeedback(null);
    try {
      await reenviarEmail(pedido.id);
      setFeedback({ texto: 'E-mail reenviado.', erro: false });
    } catch (falha) {
      setFeedback({
        texto: falha instanceof Error && falha.name !== 'TypeError' && falha.message
          ? falha.message : 'Não foi possível reenviar o e-mail. Tente novamente.',
        erro: true,
      });
    } finally {
      setEnviando(false);
    }
  }

  return <div className="gerente-reenvio">
    <button className="home-clear" type="button" disabled={enviando} onClick={reenviar}
      aria-label={enviando ? undefined : `Reenviar email do pedido ${pedido.titulo}`}>
      {enviando ? 'Enviando…' : 'Reenviar email'}
    </button>
    {feedback && <small role={feedback.erro ? 'alert' : 'status'}>{feedback.texto}</small>}
  </div>;
}

export default function Gerente() {
  const { nome, listarPedidos, listarTecnicos } = useGerente();
  const [selecao, setSelecao] = useState<{ pedido: Pedido; atualizar: () => void } | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [tecnicos, setTecnicos] = useState<TecnicoDisponivel[] | null>(null);
  const [erroLista, setErroLista] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    listarTecnicos(controller.signal).then(
      (lista) => { if (!controller.signal.aborted) setTecnicos(lista); },
      () => { if (!controller.signal.aborted) setErroLista(true); },
    );
    return () => controller.abort();
  }, [listarTecnicos, tentativa]);

  function tentarNovamente() {
    setErroLista(false);
    setTentativa((atual) => atual + 1);
  }

  return <>
    <FilaPedidos gerente nome={nome} listarPedidos={listarPedidos}
      estadoPerfil={<p role="status">{mensagem}</p>}
      filtroTecnico={<div className="home-filter">
        <label htmlFor="order-technician">Técnico</label>
        <select id="order-technician" name="tecnicoId" disabled={!tecnicos?.length}>
          <option value="">Todos os técnicos</option>
          {tecnicos?.map((tecnico) => (
            <option key={tecnico.id} value={tecnico.id}>{tecnico.nome} ({tecnico.email})</option>
          ))}
        </select>
        {!tecnicos && !erroLista && <small role="status">Carregando técnicos…</small>}
        {tecnicos?.length === 0 && <small>Nenhum técnico encontrado.</small>}
        {erroLista && <div>
          <p role="alert">Não foi possível carregar os técnicos.</p>
          <button className="home-clear" type="button" onClick={tentarNovamente}>Tentar novamente</button>
        </div>}
      </div>}
      acaoPedido={(pedido, atualizar) => {
        if (pedido.status === 'AGUARDANDO_CONFIRMACAO') return <ReenviarEmail pedido={pedido} />;
        if (pedido.status !== 'AGUARDANDO_VERIFICACAO') return null;
        return <button className="home-clear gerente-atribuir" type="button" aria-label={`Atribuir pedido ${pedido.titulo}`}
          onClick={() => { setMensagem(''); setSelecao({ pedido, atualizar }); }}>Atribuir pedido</button>;
      }}
    />
    {selecao && <Atribuicao pedido={selecao.pedido} tecnicos={tecnicos} erroLista={erroLista}
      tentarNovamente={tentarNovamente} fechar={() => setSelecao(null)} concluir={() => {
      setMensagem(`O pedido “${selecao.pedido.titulo}” foi atribuído.`);
      setSelecao(null);
      selecao.atualizar();
    }} />}
  </>;
}
