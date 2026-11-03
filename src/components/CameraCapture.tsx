import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraCaptureProps {
  onCapture: (uri: string) => void; // Recebe o URI (temporário) da foto tirada
  onClose: () => void;
}

// Câmera em tela cheia: pede permissão, mostra o preview e tira a foto
export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  // useRef dá acesso aos métodos do CameraView (takePictureAsync) sem causar re-render
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [capturing, setCapturing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleCapture = async () => {
    if (capturing) return;
    try {
      setCapturing(true);
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) onCapture(photo.uri);
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    } finally {
      setCapturing(false);
    }
  };

  // Estado 1: ainda verificando a permissão
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Estado 2: permissão negada (ou ainda não pedida)
  if (!permission.granted) {
    return (
      <View
        className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950 px-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-6xl mb-4">📷</Text>
        <Text className="text-xl font-bold text-gray-700 dark:text-gray-200 text-center mb-2">
          Precisamos da sua câmera
        </Text>
        <Text className="text-sm text-gray-400 text-center leading-5 mb-8">
          A câmera é usada apenas para tirar a sua foto de perfil.
        </Text>

        {/* Se o usuário negou de vez, só dá para liberar pelas Configurações do sistema */}
        <TouchableOpacity
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
          className="bg-indigo-600 rounded-xl py-4 px-6 items-center w-full mb-3"
        >
          <Text className="text-white text-base font-bold">
            {permission.canAskAgain ? 'Conceder Permissão' : 'Abrir Configurações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} className="py-3">
          <Text className="text-gray-500 dark:text-gray-400 text-base">Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Estado 3: permissão concedida → preview da câmera
  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        mirror={facing === 'front'} // Foto da câmera frontal sai igual ao preview (espelhada)
      />

      {/* Botões por cima do preview */}
      <View
        className="absolute left-0 right-0 flex-row justify-between px-6"
        style={{ top: insets.top + 16 }}
      >
        <TouchableOpacity
          onPress={onClose}
          className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
        >
          <Text className="text-white text-2xl">✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
          className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
        >
          <Text className="text-white text-2xl">🔄</Text>
        </TouchableOpacity>
      </View>

      <View
        className="absolute left-0 right-0 items-center"
        style={{ bottom: insets.bottom + 32 }}
      >
        <TouchableOpacity
          onPress={handleCapture}
          disabled={capturing}
          className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
        >
          {capturing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View className="w-16 h-16 rounded-full bg-white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
