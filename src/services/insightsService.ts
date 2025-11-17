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
      // Se não houver dados suficientes (erro 500), retornar null silenciosamente
      // Não logar como erro, pois é esperado quando não há dados suficientes
      if (error?.statusCode === 500) {
        // Verificar se é erro de dados insuficientes
        const errorMessage = error?.message || '';
        const hasSequenceError = error?.errors?.some((e: string) => 
          e.includes('Sequence contains no elements') || 
          e.includes('sequence') ||
          e.toLowerCase().includes('no elements')
        );
        
        if (hasSequenceError || errorMessage.toLowerCase().includes('sequence') || errorMessage.toLowerCase().includes('no elements')) {
          // Não há dados suficientes - isso é normal, não é um erro
          return null;
        }
        
        // Outro erro 500 - pode ser problema da API, mas não vamos quebrar o app
        console.warn('⚠️ Erro ao obter tendências (pode ser falta de dados):', errorMessage);
        return null;
      }
      
      // Outros erros (rede, etc) - logar mas não quebrar o app
      if (error?.statusCode === 0 || error?.statusCode === undefined) {
        console.warn('⚠️ Erro de conexão ao obter tendências');
        return null;
      }
      
      // Erro não esperado - logar mas retornar null para não quebrar o app
      console.warn('⚠️ Erro ao obter tendências:', error?.message || 'Erro desconhecido');
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

