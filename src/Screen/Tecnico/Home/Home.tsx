import { useTecnico } from '../../../context/useTecnico';
import { FilaPedidos } from '../../Pedidos/FilaPedidos';

export default function Home() {
  const perfil = useTecnico();
  return <FilaPedidos
    listarPedidos={perfil.listarPedidos}
    nome={perfil.status === 'pronto' ? perfil.tecnico.nome : null}
    estadoPerfil={perfil.status === 'carregando' ? <p role="status">Carregando seu perfil…</p>
      : perfil.status === 'erro' ? <p role="alert">{perfil.mensagem}</p> : null}
  />;
}
