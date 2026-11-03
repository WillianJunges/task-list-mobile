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

// Tela de cadastro: após criar a conta o Firebase já faz login sozinho
export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas digitadas não coincidem.');
      return;
    }
    try {
      setLoading(true);
      await signUp(email.trim(), password);
      // Sucesso: o _layout detecta o novo usuário e leva para a lista
    } catch (error) {
      Alert.alert('Erro ao criar conta', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Volta para o login (ou abre ele, se o cadastro foi a primeira tela da pilha)
  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/login');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="absolute right-4 z-10" style={{ top: insets.top + 8 }}>
        <ThemeToggle />
      </View>

      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Criar conta 🚀
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-8">
          Cadastre-se para começar a organizar suas tarefas
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
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          editable={!loading}
          className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Confirmar senha
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Digite a senha novamente"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          editable={!loading}
          onSubmitEditing={handleRegister}
          className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mb-8"
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className={`rounded-xl py-4 items-center mb-6 ${
            loading ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-base font-bold">Criar conta</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center">
          <Text className="text-gray-600 dark:text-gray-400 text-sm">Já tem uma conta? </Text>
          <TouchableOpacity onPress={goToLogin} disabled={loading}>
            <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
              Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
