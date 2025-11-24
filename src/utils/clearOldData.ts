// Utilitário para limpar dados antigos do AsyncStorage
// Use esta função para remover dados locais antigos que não devem mais existir

import AsyncStorage from '@react-native-async-storage/async-storage';

const OLD_STORAGE_KEYS = {
  CHECKINS: '@carework:checkins',
  TIPS: '@carework:tips',
};

/**
 * Limpa dados antigos do AsyncStorage que não devem mais ser usados
 * Todos os dados agora vêm da API .NET
 */
export const clearOldLocalData = async (): Promise<void> => {
  try {
    // Remover check-ins antigos salvos localmente
    await AsyncStorage.removeItem(OLD_STORAGE_KEYS.CHECKINS);
    
    // Remover tips antigas salvas localmente
    await AsyncStorage.removeItem(OLD_STORAGE_KEYS.TIPS);
    
    // Limpar TODAS as chaves que possam conter dados antigos
    const allKeys = await AsyncStorage.getAllKeys();
    const oldKeys = allKeys.filter((key) => 
      key.includes('checkin') || 
      key.includes('tip') || 
      key.includes('report') ||
      (key.startsWith('@carework:') && !key.includes('token') && !key.includes('userId') && !key.includes('userName') && !key.includes('userEmail'))
    );
    
    if (oldKeys.length > 0) {
      await AsyncStorage.multiRemove(oldKeys);
    }
    
  } catch (error) {
    console.error('Erro ao limpar dados antigos:', error);
  }
};

/**
 * Limpa TODOS os dados do AsyncStorage (exceto autenticação)
 * Use com cuidado - isso remove todos os dados locais
 */
export const clearAllCache = async (): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    // Manter apenas as chaves de autenticação
    const keysToKeep = [
      '@carework:token',
      '@carework:userId',
      '@carework:userName',
      '@carework:userEmail',
    ];
    const keysToRemove = allKeys.filter((key) => !keysToKeep.includes(key));
    
    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log(`✅ Cache limpo: ${keysToRemove.length} chaves removidas`);
    }
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

