import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { apiUrl } from '../apiUrl';
import type { AuthSession, CadastroData, LoginData } from '../types/AuthTypes';
import { AuthContext } from './useAuth';

const storageKey = 'techfixorg.token';

function lerSessao(token: string): AuthSession {
  const partes = token.split('.');
  if (partes.length !== 3 || partes.some((parte) => !parte)) {
    throw new Error('A API retornou uma sessão inválida ou expirada.');
  }

  const payload = partes[1].replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(payload), (caractere) => caractere.charCodeAt(0));
  const claims = JSON.parse(new TextDecoder().decode(bytes));
  const { nome, email, role, exp } = claims ?? {};

  if (typeof nome !== 'string' || typeof email !== 'string' || typeof role !== 'string'
      || typeof exp !== 'number' || !Number.isFinite(exp) || exp * 1000 <= Date.now()) {
    throw new Error('A API retornou uma sessão inválida ou expirada.');
  }

  return { token, user: { nome, email, role } };
}

function recuperarSessao() {
  for (const chave of ['sessionStorage', 'localStorage'] as const) {
    try {
      const token = window[chave].getItem(storageKey);
      if (token) return lerSessao(token);
    } catch {
      continue;
    }
  }

  return null;
}

async function enviar(path: string, dados: LoginData | CadastroData) {
  let resposta: Response;
  try {
    resposta = await fetch(`${apiUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(dados),
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Tente novamente.');
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);
    const mensagem = typeof erro?.mensagem === 'string' ? erro.mensagem : '';
    throw new Error(mensagem || 'Não foi possível concluir a solicitação. Tente novamente.');
  }

  return resposta;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [sessao, setSessao] = useState(recuperarSessao);

  async function login(dados: LoginData, lembrar = false) {
    const resposta = await enviar('/auth/login', dados);
    const resultado = await resposta.json().catch(() => null);
    if (typeof resultado?.token !== 'string') throw new Error('A API não retornou um token de acesso.');

    let novaSessao: AuthSession;
    try {
      novaSessao = lerSessao(resultado.token);
    } catch {
      throw new Error('A API retornou uma sessão inválida ou expirada.');
    }

    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    const storage = lembrar ? localStorage : sessionStorage;
    storage.setItem(storageKey, novaSessao.token);
    setSessao(novaSessao);
    return novaSessao.user;
  }

  async function cadastrar(dados: CadastroData) {
    const resposta = await enviar('/usuarios', dados);
    if (resposta.status !== 201) throw new Error('A API não confirmou a criação da conta.');
  }

  function logout() {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    setSessao(null);
  }

  return (
    <AuthContext.Provider value={{ user: sessao?.user ?? null, token: sessao?.token ?? null, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
