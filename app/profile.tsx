import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

// Tela de perfil: foto (tirada com a câmera), nome e e-mail
export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, saveProfile } = useProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sincroniza os campos quando o perfil carrega do banco
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]);

  // A foto da câmera fica no cache (temporária): copiamos para o diretório permanente
  const handlePhotoCapture = async (tempUri: string) => {
    try {
      const destFile = new File(Paths.document, `profile-${Date.now()}.jpg`);
      await new File(tempUri).copy(destFile);
      setPhotoUri(destFile.uri);
      setShowCamera(false);
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    }
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }
    if (trimmedEmail && !trimmedEmail.includes('@')) {
      Alert.alert('Atenção', 'Digite um e-mail válido.');
      return;
    }

    try {
      setSaving(true);
      await saveProfile({ name: trimmedName, email: trimmedEmail, photoUri });

      // Se a foto mudou, apaga o arquivo da foto antiga para não ocupar espaço
      const oldPhotoUri = profile?.photoUri;
      if (oldPhotoUri && oldPhotoUri !== photoUri) {
        try {
          new File(oldPhotoUri).delete();
        } catch {
          // Arquivo já não existia: nada a fazer
        }
      }
      router.back();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* contentContainerClassName estiliza o conteúdo de dentro do ScrollView */}
      <ScrollView contentContainerClassName="p-4" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8 mt-4">
          <TouchableOpacity onPress={() => setShowCamera(true)}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                className="w-32 h-32 rounded-full border-4 border-indigo-600"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-950 border-4 border-indigo-600 items-center justify-center">
                <Text className="text-6xl">👤</Text>
              </View>
            )}
          </TouchableOpacity>

          <View className="flex-row mt-4 gap-3">
            <TouchableOpacity
              onPress={() => setShowCamera(true)}
              className="bg-indigo-600 rounded-full px-4 py-2"
            >
              <Text className="text-white font-semibold">
                📷 {photoUri ? 'Trocar foto' : 'Tirar foto'}
              </Text>
            </TouchableOpacity>
            {photoUri && (
              <TouchableOpacity
                onPress={() => setPhotoUri(null)}
                className="bg-gray-200 dark:bg-gray-800 rounded-full px-4 py-2"
              >
                <Text className="text-gray-700 dark:text-gray-200 font-semibold">Remover</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Nome *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor="#9ca3af"
          maxLength={60}
          className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mb-5"
        />

        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={100}
          className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 text-base text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mb-8"
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`rounded-xl py-4 items-center ${
            saving ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-base font-bold">Salvar perfil</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Câmera em tela cheia; o botão "voltar" do Android também fecha */}
      <Modal
        visible={showCamera}
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setShowCamera(false)}
      >
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}
