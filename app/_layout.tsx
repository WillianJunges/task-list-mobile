import '../global.css'; // ⚠️ Deve ser a primeira importação!
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colorScheme, useColorScheme } from 'nativewind';
import Storage from 'expo-sqlite/kv-store';
import { ThemeToggle, THEME_KEY } from '../src/components/ThemeToggle';
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext';

// Aplica o tema salvo antes da primeira renderização (evita "piscar" o tema errado)
const savedTheme = Storage.getItemSync(THEME_KEY);
if (savedTheme === 'light' || savedTheme === 'dark') {
  colorScheme.set(savedTheme);
}

// O AuthProvider fica por fora para que o RootLayoutNav possa usar o useAuthContext
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Stack Navigator com cabeçalho índigo (mais escuro no dark mode) + proteção de rotas
function RootLayoutNav() {
  const { user, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme: scheme } = useColorScheme();
  const isDark = scheme === 'dark';
  const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

  // Sem usuário → vai para o login. Logado mas na tela de login/cadastro → vai para a lista.
  // replace() em vez de push() para o botão "voltar" não levar a uma tela proibida
  useEffect(() => {
    if (loading) return;
    if (!user && !inAuthGroup) {
      // Ao sair a partir do Perfil, limpa a pilha para o "voltar" não reabrir a lista
      if (router.canDismiss()) router.dismissAll();
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, loading, inAuthGroup, router]);

  return (
    <>
      {/* Ícones claros sobre o header índigo; escuros no login/cadastro do tema claro */}
      <StatusBar style={inAuthGroup && !isDark ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#1e1b4b' : '#4f46e5' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <ThemeToggle />,
          contentStyle: { backgroundColor: isDark ? '#030712' : '#f9fafb' },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
        <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
        <Stack.Screen name="profile" options={{ title: '👤 Meu Perfil' }} />
      </Stack>
    </>
  );
}
