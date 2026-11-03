import '../global.css'; // ⚠️ Deve ser a primeira importação!
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colorScheme, useColorScheme } from 'nativewind';
import Storage from 'expo-sqlite/kv-store';
import { ThemeToggle, THEME_KEY } from '../src/components/ThemeToggle';

// Aplica o tema salvo antes da primeira renderização (evita "piscar" o tema errado)
const savedTheme = Storage.getItemSync(THEME_KEY);
if (savedTheme === 'light' || savedTheme === 'dark') {
  colorScheme.set(savedTheme);
}

// Layout raiz: um Stack Navigator com o cabeçalho índigo (mais escuro no dark mode)
export default function RootLayout() {
  const { colorScheme: scheme } = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: isDark ? '#1e1b4b' : '#4f46e5' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <ThemeToggle />,
          contentStyle: { backgroundColor: isDark ? '#030712' : '#f9fafb' },
        }}
      >
        <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
        <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
        <Stack.Screen name="profile" options={{ title: '👤 Meu Perfil' }} />
      </Stack>
    </>
  );
}
