// Configuração da API
import { Platform } from 'react-native';

// Função para obter a URL base correta baseado na plataforma
const getBaseUrl = (): string => {
  if (__DEV__) {
    // Em desenvolvimento
    if (Platform.OS === 'android') {
      // Emulador Android usa 10.0.2.2 para acessar localhost da máquina
      return 'http://10.0.2.2:8080';
    } else if (Platform.OS === 'ios') {
      // iOS Simulator usa localhost
      return 'http://localhost:8080';
    } else {
      // Web ou outras plataformas
      return 'http://localhost:8080';
    }
  }
  // Produção
  return 'https://sua-api-producao.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 30000, // 30 segundos
};

