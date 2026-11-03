// Usuário autenticado: só os campos do `User` do Firebase que o app usa
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// O que o hook useAuth devolve
export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean; // true enquanto o Firebase verifica se há sessão salva
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// O contexto compartilha exatamente o que o hook devolve
export type AuthContextType = UseAuthReturn;
