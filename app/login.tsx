import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../src/contexts/AuthContext';
import { ThemeToggle } from '../src/components/ThemeToggle';

// Tela de login com e-mail e senha (sem header; o _layout redireciona após o login)
export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loading: authLoading, signIn } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha.');
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim(), password);
      // Sucesso: o onAuthStateChanged atualiza o user e o _layout leva para a lista
    } catch (error) {
      Alert.alert('Erro ao entrar', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Enquanto o Firebase verifica se já existe uma sessão salva
  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600 dark:text-gray-300">Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="absolute right-4 z-10" style={{ top: insets.top + 8 }}>
        <ThemeToggle />
      </View>

      {/* flex-grow (e não flex-1) para o conteúdo centralizar e ainda poder rolar */}
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Bem-vindo! 👋
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-8">
          Faça login para acessar suas tarefas
        </Text>

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!loading}
          className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          editable={!loading}
          onSubmitEditing={handleLogin}
          className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mb-8"
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`rounded-xl py-4 items-center mb-6 ${
            loading ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-base font-bold">Entrar</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600 dark:text-gray-400 text-sm">Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')} disabled={loading}>
            <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
