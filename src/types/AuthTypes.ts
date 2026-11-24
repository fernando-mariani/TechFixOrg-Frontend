export type User = {
  nome: string;
  email: string;
  role: string;
};

export type LoginData = {
  email: string;
  senha: string;
};

export type CadastroData = LoginData & Pick<User, 'nome'>;

export type AuthSession = {
  user: User;
  token: string;
};

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (dados: LoginData, lembrar?: boolean) => Promise<User>;
  cadastrar: (dados: CadastroData) => Promise<void>;
  logout: () => void;
};
