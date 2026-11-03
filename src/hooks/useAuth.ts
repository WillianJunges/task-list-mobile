import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { FirebaseError } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { AuthUser, UseAuthReturn } from '../types/auth';

// Usado só pelo AuthProvider: as telas acessam via useAuthContext()
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Observa login/logout. Também dispara ao abrir o app (sessão salva no AsyncStorage)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(
        firebaseUser
          ? {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }
          : null,
      );
      setLoading(false);
    });
    // Para de observar quando o componente desmonta
    return unsubscribe;
  }, []);

  // Não precisa atualizar `user` aqui: o onAuthStateChanged faz isso sozinho
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error(getErrorMessage(error));
    }
  }, []);

  // O Firebase já faz login automaticamente depois de criar a conta
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  }, []);

  return { user, loading, signIn, signUp, signOut };
}

// Traduz os códigos de erro do Firebase para mensagens em português
function getErrorMessage(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : '';
  const messages: Record<string, string> = {
    // Projetos novos do Firebase usam este código para e-mail OU senha errados
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'E-mail não cadastrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/too-many-requests':
      'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };
  return messages[code] ?? 'Erro ao processar sua solicitação.';
}
