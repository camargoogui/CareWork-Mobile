// Serviço unificado de Check-ins
// Usa API .NET

import { Checkin, CreateCheckinRequest, UpdateCheckinRequest, QuickCheckinRequest } from '../types/api';
import { apiService } from './apiService';

export const checkinService = {
  async getCheckins(page: number = 1, pageSize: number = 10) {
    return apiService.getCheckins(page, pageSize);
  },

  async getCheckinById(id: string): Promise<Checkin | null> {
    try {
      return await apiService.getCheckinById(id);
    } catch {
      return null;
    }
  },

  async createCheckin(request: CreateCheckinRequest): Promise<Checkin> {
    return apiService.createCheckin(request);
  },

  async createQuickCheckin(request: QuickCheckinRequest): Promise<Checkin> {
    return apiService.createQuickCheckin(request);
  },

  async updateCheckin(id: string, request: UpdateCheckinRequest): Promise<Checkin | null> {
    try {
      return await apiService.updateCheckin(id, request);
    } catch {
      return null;
    }
  },

  async deleteCheckin(id: string): Promise<boolean> {
    try {
      await apiService.deleteCheckin(id);
      return true;
    } catch {
      return false;
    }
  },

  async searchCheckins(query?: string, dateFrom?: string, dateTo?: string): Promise<Checkin[]> {
    try {
      return await apiService.searchCheckins(query, dateFrom, dateTo);
    } catch {
      return [];
    }
  },

  async getCheckinsByDateRange(startDate: Date, endDate: Date): Promise<Checkin[]> {
    // Usa o endpoint de busca com filtro de data
    try {
      const dateFrom = startDate.toISOString().split('T')[0];
      const dateTo = endDate.toISOString().split('T')[0];
      return await apiService.searchCheckins(undefined, dateFrom, dateTo);
    } catch {
      return [];
    }
  },
};

