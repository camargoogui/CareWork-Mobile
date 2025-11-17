import { ApiError } from '../types/api';

/**
 * Traduz mensagens de erro da API para mensagens amigáveis em português
 */
export const getErrorMessage = (error: any): string => {
  // Se já é uma string, retornar direto
  if (typeof error === 'string') {
    return error;
  }

  // Se é um ApiError
  if (error?.statusCode !== undefined) {
    const apiError = error as ApiError;
    
    // Mensagens específicas da API
    if (apiError.message) {
      // Traduzir mensagens comuns da API
      const message = apiError.message.toLowerCase();
      
      if (message.includes('email already in use') || message.includes('email já está em uso')) {
        return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      }
      
      if (message.includes('invalid credentials') || message.includes('credenciais inválidas')) {
        return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.';
      }
      
      if (message.includes('current password is incorrect') || message.includes('senha atual incorreta')) {
        return 'A senha atual está incorreta. Verifique e tente novamente.';
      }
      
      if (message.includes('password is incorrect') || message.includes('senha incorreta')) {
        return 'Senha incorreta. Verifique e tente novamente.';
      }
      
      if (message.includes('user not found') || message.includes('usuário não encontrado')) {
        return 'Usuário não encontrado. Verifique suas credenciais.';
      }
      
      if (message.includes('email already in use') || message.includes('email já está em uso')) {
        return 'Este email já está sendo usado por outra conta.';
      }
      
      if (message.includes('new password must be different')) {
        return 'A nova senha deve ser diferente da senha atual.';
      }
      
      if (message.includes('unauthorized') || message.includes('não autorizado')) {
        return 'Sua sessão expirou. Por favor, faça login novamente.';
      }
      
      if (message.includes('forbidden') || message.includes('proibido')) {
        return 'Você não tem permissão para realizar esta ação.';
      }
      
      if (message.includes('not found') || message.includes('não encontrado')) {
        return 'O recurso solicitado não foi encontrado.';
      }
      
      if (message.includes('validation') || message.includes('validação')) {
        // Tentar extrair erros de validação específicos
        if (apiError.errors) {
          const errorArray = Array.isArray(apiError.errors) 
            ? apiError.errors 
            : Object.values(apiError.errors).flat();
          
          if (errorArray.length > 0) {
            return errorArray[0] as string;
          }
        }
        return 'Por favor, verifique os dados informados e tente novamente.';
      }
      
      // Retornar mensagem original se não houver tradução específica
      return apiError.message;
    }
    
    // Mensagens baseadas no status code
    switch (apiError.statusCode) {
      case 0:
        return 'Erro de conexão. Verifique sua internet e se o servidor está disponível.';
      case 400:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Sua sessão expirou. Por favor, faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito: este recurso já existe ou está em uso.';
      case 422:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 500:
        return 'Erro interno do servidor. Tente novamente em alguns instantes.';
      case 503:
        return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      default:
        return apiError.message || 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }
  
  // Se tem propriedade message
  if (error?.message) {
    return error.message;
  }
  
  // Se tem array de errors
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0];
  }
  
  // Mensagem padrão
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

/**
 * Extrai mensagens de erro de validação da API
 */
export const getValidationErrors = (error: any): Record<string, string> => {
  if (!error?.errors) {
    return {};
  }
  
  if (Array.isArray(error.errors)) {
    return { general: error.errors[0] || '' };
  }
  
  if (typeof error.errors === 'object') {
    return error.errors as Record<string, string>;
  }
  
  return {};
};

/**
 * Verifica se o erro é de conexão/rede
 */
export const isNetworkError = (error: any): boolean => {
  if (error?.statusCode === 0) {
    return true;
  }
  
  if (error instanceof TypeError) {
    return error.message.includes('Network') || error.message.includes('Failed to fetch');
  }
  
  const message = (error?.message || '').toLowerCase();
  return message.includes('network') || message.includes('conexão') || message.includes('fetch');
};

/**
 * Verifica se o erro requer novo login
 */
export const requiresReauth = (error: any): boolean => {
  const statusCode = error?.statusCode;
  return statusCode === 401 || statusCode === 403;
};

