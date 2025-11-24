// Serviço de Insights e Análises
import { apiService } from './apiService';
import {
  TrendAnalysis,
  Recommendation,
  ComparisonResult,
  Streak,
} from '../types/api';

export const insightsService = {
  async getTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<TrendAnalysis | null> {
    try {
      return await apiService.getTrends(period);
    } catch (error: any) {
      // Se não houver dados suficientes, retornar null silenciosamente
      // Não logar como erro/warning, pois é esperado quando não há dados suficientes
      const errorMessage = error?.message || '';
      
      // Verificar se é erro de dados insuficientes (várias possibilidades)
      const isInsufficientDataError = 
        error?.statusCode === 500 ||
        errorMessage.toLowerCase().includes('faltam campos obrigatórios') ||
        errorMessage.toLowerCase().includes('resposta inválida') ||
        errorMessage.toLowerCase().includes('sequence') ||
        errorMessage.toLowerCase().includes('no elements') ||
        error?.errors?.some((e: string) => 
          e.includes('Sequence contains no elements') || 
          e.includes('sequence') ||
          e.toLowerCase().includes('no elements')
        );
      
      if (isInsufficientDataError) {
        // Não há dados suficientes - isso é normal, não é um erro
        // Retornar null silenciosamente sem logar warning
        return null;
      }
      
      // Outros erros (rede, etc) - só logar se for erro de conexão crítico
      if (error?.statusCode === 0) {
        // Erro de conexão - pode logar em modo debug, mas não como warning
        if (__DEV__) {
          console.log('ℹ️ Erro de conexão ao obter tendências (modo desenvolvimento)');
        }
        return null;
      }
      
      // Erro não esperado - só logar em desenvolvimento
      if (__DEV__) {
        console.log('ℹ️ Erro ao obter tendências:', error?.message || 'Erro desconhecido');
      }
      return null;
    }
  },

  async getRecommendations(): Promise<Recommendation[]> {
    try {
      return await apiService.getRecommendations();
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  async comparePeriods(period1: string, period2: string): Promise<ComparisonResult | null> {
    try {
      return await apiService.comparePeriods(period1, period2);
    } catch (error) {
      console.error('Error comparing periods:', error);
      return null;
    }
  },

  async getStreak(): Promise<Streak> {
    try {
      return await apiService.getStreak();
    } catch (error) {
      console.error('Error getting streak:', error);
      return { current: 0, longest: 0, lastCheckinDate: null };
    }
  },
};

