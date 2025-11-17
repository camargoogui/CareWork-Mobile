// Serviço unificado de Reports
// Usa API .NET

import { WeeklyReport, MonthlyReport, CustomReport, CustomReportRequest } from '../types/api';
import { apiService } from './apiService';

export const reportService = {
  async getWeeklyReport(weekStart: string, userId?: string): Promise<WeeklyReport | null> {
    try {
      return await apiService.getWeeklyReport(weekStart, userId);
    } catch {
      return null;
    }
  },

  async getMonthlyReport(month: string, userId?: string): Promise<MonthlyReport | null> {
    try {
      return await apiService.getMonthlyReport(month, userId);
    } catch {
      return null;
    }
  },

  async getCustomReport(request: CustomReportRequest): Promise<CustomReport | null> {
    try {
      return await apiService.getCustomReport(request);
    } catch {
      return null;
    }
  },
};

