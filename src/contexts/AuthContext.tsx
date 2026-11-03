import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContextType } from '../types/auth';

// Um único estado de autenticação compartilhado por todas as telas
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Envolve o app no _layout.tsx: só aqui o useAuth (e o observador do Firebase) roda
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// As telas usam este hook para ler o usuário e chamar signIn/signUp/signOut
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'useAuthContext deve ser usado dentro de um <AuthProvider> (veja o _layout.tsx).',
    );
  }
  return context;
}
