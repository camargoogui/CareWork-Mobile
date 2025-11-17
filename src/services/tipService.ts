// Serviço unificado de Tips
// Usa API .NET

import { Tip, CreateTipRequest, UpdateTipRequest } from '../types/api';
import { apiService } from './apiService';

export const tipService = {
  async getRecommendedTips(): Promise<Tip[]> {
    try {
      return await apiService.getRecommendedTips();
    } catch {
      return [];
    }
  },

  async getTips(
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    moodLevel?: 'low' | 'medium' | 'high'
  ) {
    return apiService.getTips(page, pageSize, category, moodLevel);
  },

  async getTipById(id: string): Promise<Tip | null> {
    try {
      return await apiService.getTipById(id);
    } catch {
      return null;
    }
  },

  async createTip(request: CreateTipRequest): Promise<Tip> {
    return apiService.createTip(request);
  },

  async updateTip(id: string, request: UpdateTipRequest): Promise<Tip | null> {
    try {
      return await apiService.updateTip(id, request);
    } catch {
      return null;
    }
  },

  async deleteTip(id: string): Promise<boolean> {
    try {
      await apiService.deleteTip(id);
      return true;
    } catch {
      return false;
    }
  },
};

