// Serviço de API para integração com .NET
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Checkin,
  Tip,
  WeeklyReport,
  MonthlyReport,
  CustomReport,
  CustomReportRequest,
  CreateCheckinRequest,
  UpdateCheckinRequest,
  QuickCheckinRequest,
  CreateTipRequest,
  UpdateTipRequest,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ApiResponse,
  PagedResponse,
  ApiError,
  TrendAnalysis,
  Recommendation,
  ComparisonResult,
  Streak,
  Achievement,
  Goal,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalProgress,
  Reminder,
  CreateReminderRequest,
  UpdateReminderRequest,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileResponse,
} from '../types/api';
import { API_CONFIG } from '../config/api';

const STORAGE_KEYS = {
  TOKEN: '@carework:token',
  USER_ID: '@carework:userId',
};

class ApiService {
  private async getHeaders(includeAuth: boolean = true): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    // Endpoints de autenticação que NÃO requerem token: register e login
    // Endpoints de autenticação que REQUEREM token: profile, password, account
    const publicAuthEndpoints = ['/api/v1/auth/register', '/api/v1/auth/login'];
    const includeAuth = !publicAuthEndpoints.includes(endpoint);
    const headers = await this.getHeaders(includeAuth);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Para DELETE 204, não há corpo
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        // Extrair mensagem de erro mais específica
        let errorMessage = data.message || 'Erro desconhecido';
        
        // Se tem array de erros, usar o primeiro
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors[0];
        }
        
        // Se errors é um objeto, tentar extrair mensagens
        if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
          const errorValues = Object.values(data.errors).flat();
          if (errorValues.length > 0) {
            errorMessage = errorValues[0] as string;
          }
        }
        
        const error: ApiError = {
          message: errorMessage,
          statusCode: response.status,
          errors: data.errors,
        };
        throw error;
      }

      // Retornar exatamente o que a API retornou - SEM wrapper ApiResponse se não vier
      // Se a API retorna ApiResponse<T>, extrair data
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        const apiResponse = data as ApiResponse<T>;
        if (apiResponse.success && apiResponse.data !== undefined) {
          return apiResponse.data;
        }
        // Se success é false, lançar erro
        throw {
          message: apiResponse.message || 'Erro na resposta da API',
          statusCode: response.status,
          errors: apiResponse.errors,
        } as ApiError;
      }

      // Se não tem wrapper ApiResponse, retornar direto (para endpoints que retornam PagedResponse diretamente)
      return data as T;
    } catch (error: any) {
      // Se já é um ApiError, re-lançar
      if (error?.statusCode !== undefined) {
        throw error;
      }
      
      // Erro de rede/conexão
      if (error instanceof TypeError && (error.message.includes('Network') || error.message.includes('Failed to fetch'))) {
        throw {
          message: 'Erro de conexão. Verifique sua internet e se o servidor está disponível.',
          statusCode: 0,
        } as ApiError;
      }
      
      // Erro de JSON parsing (API retornou resposta inválida)
      if (error instanceof SyntaxError) {
        throw {
          message: 'Resposta inválida do servidor. Tente novamente.',
          statusCode: 0,
        } as ApiError;
      }
      
      // Erro desconhecido
      throw {
        message: error?.message || 'Ocorreu um erro inesperado. Tente novamente.',
        statusCode: 0,
      } as ApiError;
    }
  }

  // ========== AUTH ==========
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // O método request já extrai o data do wrapper ApiResponse
      const authResponse = await this.request<AuthResponse>(
        '/api/v1/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ email, password, name } as RegisterRequest),
        }
      );

      // Validar que a resposta tem os campos necessários
      if (authResponse && authResponse.token && authResponse.userId) {
        // Salvar token e userId no AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, authResponse.userId);
        return authResponse;
      }

      // Se a resposta não tem os campos necessários, lançar erro
      throw {
        message: 'Resposta inválida da API',
        statusCode: 500,
      } as ApiError;
    } catch (error: any) {
      // Se já é um ApiError, re-lançar
      if (error.statusCode !== undefined) {
        throw error;
      }
      // Caso contrário, lançar erro genérico
      throw {
        message: error.message || 'Erro ao registrar. Verifique os dados e tente novamente.',
        statusCode: 0,
      } as ApiError;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Tentando fazer login com:', { email });
      
      // O método request já extrai o data do wrapper ApiResponse
      const authResponse = await this.request<AuthResponse>(
        '/api/v1/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password } as LoginRequest),
        }
      );

      console.log('📥 Resposta do login:', { 
        hasToken: !!authResponse?.token, 
        hasUserId: !!authResponse?.userId,
        hasEmail: !!authResponse?.email,
        hasName: !!authResponse?.name 
      });

      // Validar que a resposta tem os campos necessários
      if (authResponse && authResponse.token && authResponse.userId) {
        // Salvar token e userId no AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, authResponse.userId);
        console.log('✅ Login bem-sucedido, token salvo');
        return authResponse;
      }

      // Se a resposta não tem os campos necessários, lançar erro
      console.error('❌ Resposta inválida da API:', authResponse);
      throw {
        message: 'Resposta inválida da API - faltam campos obrigatórios',
        statusCode: 500,
      } as ApiError;
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      // Se já é um ApiError, re-lançar
      if (error.statusCode !== undefined) {
        throw error;
      }
      // Caso contrário, lançar erro genérico
      throw {
        message: error.message || 'Erro ao fazer login. Verifique suas credenciais.',
        statusCode: 0,
      } as ApiError;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
  }

  async updateProfile(request: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      // A API retorna { success: true, data: { id, email, name, createdAt }, message, errors }
      const profileData = await this.request<UpdateProfileResponse>(
        '/api/v1/auth/profile',
        {
          method: 'PUT',
          body: JSON.stringify(request),
        }
      );

      // Validar que a resposta tem os campos necessários
      if (profileData && profileData.id && profileData.email && profileData.name) {
        // Atualizar dados do usuário no AsyncStorage (o token permanece o mesmo)
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, profileData.id);
        await AsyncStorage.setItem('@carework:userName', profileData.name);
        await AsyncStorage.setItem('@carework:userEmail', profileData.email);
        return profileData;
      }

      throw {
        message: 'Resposta inválida da API',
        statusCode: 500,
      } as ApiError;
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      throw {
        message: error.message || 'Erro ao atualizar perfil. Tente novamente.',
        statusCode: 0,
      } as ApiError;
    }
  }

  async updatePassword(request: UpdatePasswordRequest): Promise<void> {
    try {
      await this.request<void>(
        '/api/v1/auth/password',
        {
          method: 'PUT',
          body: JSON.stringify(request),
        }
      );
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      throw {
        message: error.message || 'Erro ao atualizar senha. Verifique a senha atual e tente novamente.',
        statusCode: 0,
      } as ApiError;
    }
  }

  async deleteAccount(request: DeleteAccountRequest): Promise<void> {
    try {
      await this.request<void>(
        '/api/v1/auth/account',
        {
          method: 'DELETE',
          body: JSON.stringify(request),
        }
      );
      // Limpar dados locais após deletar conta
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
      await AsyncStorage.removeItem('@carework:userName');
      await AsyncStorage.removeItem('@carework:userEmail');
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      throw {
        message: error.message || 'Erro ao deletar conta. Verifique a senha e tente novamente.',
        statusCode: 0,
      } as ApiError;
    }
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  async getUserId(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  }

  // ========== CHECKINS ==========
  async getCheckins(page: number = 1, pageSize: number = 10): Promise<PagedResponse<Checkin>> {
    // Buscar DIRETAMENTE da API .NET - SEM normalização, SEM fallback, SEM dados locais
    const response = await this.request<PagedResponse<Checkin>>(
      `/api/v1/checkins?page=${page}&pageSize=${pageSize}`
    );

    // Validar que a resposta tem a estrutura esperada
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Resposta inválida da API');
    }

    // Retornar EXATAMENTE o que a API retornou - SEM modificar, SEM adicionar dados
    return response;
  }

  async getCheckinById(id: string): Promise<Checkin> {
    // Buscar diretamente da API .NET
    const data = await this.request<Checkin>(`/api/v1/checkins/${id}`);
    if (data && data.id) {
      return data;
    }
    throw new Error('Check-in não encontrado');
  }

  async createCheckin(request: CreateCheckinRequest): Promise<Checkin> {
    // Limpar campos undefined antes de enviar
    const cleanRequest: any = {
      mood: request.mood,
      stress: request.stress,
      sleep: request.sleep,
    };

    // Adicionar notes apenas se existir e não estiver vazio
    if (request.notes && request.notes.trim().length > 0) {
      cleanRequest.notes = request.notes.trim();
    }

    // Adicionar tags apenas se existir e não estiver vazio
    if (request.tags && request.tags.length > 0) {
      cleanRequest.tags = request.tags;
    }

    // Criar check-in diretamente na API .NET
    const data = await this.request<Checkin>('/api/v1/checkins', {
      method: 'POST',
      body: JSON.stringify(cleanRequest),
    });
    
    // Retornar exatamente o que a API retornou
    if (data && data.id) {
      return data;
    }
    throw new Error('Erro ao criar check-in');
  }

  async createQuickCheckin(request: QuickCheckinRequest): Promise<Checkin> {
    // Criar check-in rápido diretamente na API .NET
    const data = await this.request<Checkin>('/api/v1/checkins/quick', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    // Retornar exatamente o que a API retornou
    if (data && data.id) {
      return data;
    }
    throw new Error('Erro ao criar check-in rápido');
  }

  async searchCheckins(query?: string, dateFrom?: string, dateTo?: string): Promise<Checkin[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/checkins/search?${queryString}` : '/api/v1/checkins/search';
    
    // Buscar diretamente da API .NET
    try {
      const response = await this.request<Checkin[]>(endpoint);
      // Se retornar array direto
      if (Array.isArray(response)) {
        return response;
      }
      // Se retornar com wrapper
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as any).data || [];
      }
      return [];
    } catch {
      return [];
    }
  }

  async updateCheckin(id: string, request: UpdateCheckinRequest): Promise<Checkin> {
    // Atualizar check-in diretamente na API .NET
    const data = await this.request<Checkin>(`/api/v1/checkins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    
    // Retornar exatamente o que a API retornou
    if (data && data.id) {
      return data;
    }
    throw new Error('Erro ao atualizar check-in');
  }

  async deleteCheckin(id: string): Promise<void> {
    await this.request(`/api/v1/checkins/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== TIPS ==========
  async getRecommendedTips(): Promise<Tip[]> {
    try {
      const data = await this.request<Tip[]>('/api/v1/tips/recommended');
      // Se retornar array direto
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch {
      return [];
    }
  }

  async getTips(
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    moodLevel?: 'low' | 'medium' | 'high'
  ): Promise<PagedResponse<Tip>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (category) params.append('category', category);
    if (moodLevel) params.append('moodLevel', moodLevel);
    
    // Buscar diretamente da API .NET - SEM normalização ou fallback
    const response = await this.request<PagedResponse<Tip>>(
      `/api/v1/tips?${params.toString()}`
    );

    // Retornar exatamente o que a API retornou - SEM criar dados falsos
    if (response && response.data && Array.isArray(response.data)) {
      return response;
    }

    // Se a resposta não tem a estrutura esperada, lançar erro
    throw new Error('Resposta inválida da API');
  }

  async getTipById(id: string): Promise<Tip> {
    // Buscar diretamente da API .NET
    const data = await this.request<Tip>(`/api/v1/tips/${id}`);
    if (data && data.id) {
      return data;
    }
    throw new Error('Dica não encontrada');
  }

  async createTip(request: CreateTipRequest): Promise<Tip> {
    // Criar dica diretamente na API .NET
    const data = await this.request<Tip>('/api/v1/tips', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (data && data.id) {
      return data;
    }
    throw new Error('Erro ao criar dica');
  }

  async updateTip(id: string, request: UpdateTipRequest): Promise<Tip> {
    // Atualizar dica diretamente na API .NET
    const data = await this.request<Tip>(`/api/v1/tips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    if (data && data.id) {
      return data;
    }
    throw new Error('Erro ao atualizar dica');
  }

  async deleteTip(id: string): Promise<void> {
    await this.request(`/api/v1/tips/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== REPORTS ==========
  async getWeeklyReport(weekStart: string, userId?: string): Promise<WeeklyReport> {
    const userIdParam = userId ? `&userId=${userId}` : '';
    // Buscar diretamente da API .NET
    const data = await this.request<WeeklyReport>(
      `/api/v1/reports/weekly?weekStart=${weekStart}${userIdParam}`
    );
    if (data && data.userId) {
      return data;
    }
    throw new Error('Erro ao gerar relatório');
  }

  async getMonthlyReport(month: string, userId?: string): Promise<MonthlyReport> {
    const userIdParam = userId ? `&userId=${userId}` : '';
    // Buscar diretamente da API .NET
    const data = await this.request<MonthlyReport>(
      `/api/v1/reports/monthly?month=${month}${userIdParam}`
    );
    if (data && data.userId) {
      return data;
    }
    throw new Error('Erro ao gerar relatório mensal');
  }

  async getCustomReport(request: CustomReportRequest): Promise<CustomReport> {
    // Buscar diretamente da API .NET
    const data = await this.request<CustomReport>('/api/v1/reports/custom', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (data && data.period) {
      return data;
    }
    throw new Error('Erro ao gerar relatório customizado');
  }

  // ========== INSIGHTS ==========
  async getTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<TrendAnalysis> {
    try {
      // O método request já extrai o data do wrapper ApiResponse
      const trendAnalysis = await this.request<TrendAnalysis>(
        `/api/v1/insights/trends?period=${period}`
      );
      
      // Validar que a resposta tem os campos necessários
      if (trendAnalysis && trendAnalysis.trend) {
        return trendAnalysis;
      }
      
      throw {
        message: 'Resposta inválida da API - faltam campos obrigatórios',
        statusCode: 500,
      } as ApiError;
    } catch (error: any) {
      // Re-lançar o erro para que o insightsService possa tratá-lo
      if (error.statusCode !== undefined) {
        throw error;
      }
      throw {
        message: error.message || 'Erro ao obter tendências',
        statusCode: 0,
      } as ApiError;
    }
  }

  async getRecommendations(): Promise<Recommendation[]> {
    try {
      // O método request já extrai o data do wrapper ApiResponse
      const recommendations = await this.request<Recommendation[]>('/api/v1/insights/recommendations');
      if (Array.isArray(recommendations)) {
        return recommendations;
      }
      return [];
    } catch {
      return [];
    }
  }

  async comparePeriods(
    period1: string,
    period2: string
  ): Promise<ComparisonResult> {
    try {
      // O método request já extrai o data do wrapper ApiResponse
      const comparison = await this.request<ComparisonResult>(
        `/api/v1/insights/compare?period1=${period1}&period2=${period2}`
      );
      if (comparison && comparison.period1 && comparison.period2) {
        return comparison;
      }
      throw new Error('Resposta inválida da API');
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao comparar períodos');
    }
  }

  async getStreak(): Promise<Streak> {
    try {
      // O método request já extrai o data do wrapper ApiResponse
      const streak = await this.request<Streak>('/api/v1/insights/streak');
      if (streak && typeof streak.current === 'number') {
        return streak;
      }
      return { current: 0, longest: 0, lastCheckinDate: null };
    } catch {
      return { current: 0, longest: 0, lastCheckinDate: null };
    }
  }

  // ========== ACHIEVEMENTS ==========
  async getAchievements(): Promise<Achievement[]> {
    const data = await this.request<ApiResponse<Achievement[]>>('/api/v1/achievements');
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  }

  async getAvailableAchievements(): Promise<Achievement[]> {
    const data = await this.request<ApiResponse<Achievement[]>>('/api/v1/achievements/available');
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  }

  // ========== GOALS ==========
  async getGoals(): Promise<Goal[]> {
    const data = await this.request<ApiResponse<Goal[]>>('/api/v1/goals');
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  }

  async createGoal(request: CreateGoalRequest): Promise<Goal> {
    const data = await this.request<ApiResponse<Goal>>('/api/v1/goals', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Erro ao criar meta');
  }

  async updateGoal(id: string, request: UpdateGoalRequest): Promise<Goal> {
    const data = await this.request<ApiResponse<Goal>>(`/api/v1/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Erro ao atualizar meta');
  }

  async deleteGoal(id: string): Promise<void> {
    await this.request(`/api/v1/goals/${id}`, {
      method: 'DELETE',
    });
  }

  async getGoalProgress(id: string): Promise<GoalProgress> {
    const data = await this.request<ApiResponse<GoalProgress>>(`/api/v1/goals/${id}/progress`);
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Erro ao obter progresso da meta');
  }

  // ========== REMINDERS ==========
  async getReminders(): Promise<Reminder[]> {
    const data = await this.request<ApiResponse<Reminder[]>>('/api/v1/reminders');
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  }

  async createReminder(request: CreateReminderRequest): Promise<Reminder> {
    const data = await this.request<ApiResponse<Reminder>>('/api/v1/reminders', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Erro ao criar lembrete');
  }

  async updateReminder(id: string, request: UpdateReminderRequest): Promise<Reminder> {
    const data = await this.request<ApiResponse<Reminder>>(`/api/v1/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    if (data.success && data.data) {
      return data.data;
    }
    throw new Error(data.message || 'Erro ao atualizar lembrete');
  }

  async deleteReminder(id: string): Promise<void> {
    await this.request(`/api/v1/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== HEALTH ==========
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      const status = await response.text();
      return status === 'Healthy';
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
