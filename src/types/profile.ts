// Interface que representa o perfil do usuário no banco de dados
export interface UserProfile {
  id: number; // Sempre 1 (registro único)
  name: string;
  email: string;
  photoUri: string | null; // Caminho local da foto ou null se não houver
}

// Dados necessários para salvar o perfil (criar ou atualizar)
export interface SaveProfileInput {
  name: string;
  email: string;
  photoUri: string | null;
}
