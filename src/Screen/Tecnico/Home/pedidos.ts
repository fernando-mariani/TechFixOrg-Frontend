export type Pedido = {
  id: string
  nome: string
  cliente: string
  descricao: string
  dataLimite: string
  status: 'Aguardando diagnóstico' | 'Em reparo' | 'Aguardando peça' | 'Concluído'
}

// Dados de demonstração. A conta e os pedidos reais devem vir da API.
export const pedidosExemplo: Pedido[] = [
  { id: 'OS-1042', nome: 'iPhone 13', cliente: 'Mariana Costa', descricao: 'Troca de tela. Display sem imagem após queda.', dataLimite: '2026-11-11', status: 'Em reparo' },
  { id: 'OS-1043', nome: 'Samsung Galaxy A54', cliente: 'Pedro Almeida', descricao: 'Conector de carga com mau contato. Verificar alimentação.', dataLimite: '2026-11-12', status: 'Aguardando diagnóstico' },
  { id: 'OS-1044', nome: 'Notebook Dell Inspiron', cliente: 'Ana Ribeiro', descricao: 'Desliga durante o uso. Verificar temperatura e refrigeração.', dataLimite: '2026-11-13', status: 'Em reparo' },
  { id: 'OS-1045', nome: 'Motorola Edge 40', cliente: 'Lucas Santos', descricao: 'Substituição de bateria com baixa autonomia.', dataLimite: '2026-11-16', status: 'Aguardando peça' },
  { id: 'OS-1046', nome: 'PlayStation 5', cliente: 'Beatriz Lima', descricao: 'Saída HDMI sem sinal. Inspecionar conector e circuito.', dataLimite: '2026-11-17', status: 'Aguardando diagnóstico' },
  { id: 'OS-1047', nome: 'iPad 9ª geração', cliente: 'Rafael Oliveira', descricao: 'Tela de toque não responde em parte do painel.', dataLimite: '2026-11-18', status: 'Aguardando peça' },
]
