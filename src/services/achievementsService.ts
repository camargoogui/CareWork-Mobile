// Serviço de Conquistas
import { apiService } from './apiService';
import { Achievement } from '../types/api';

export const achievementsService = {
  async getAchievements(): Promise<Achievement[]> {
    try {
      return await apiService.getAchievements();
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  },

  async getAvailableAchievements(): Promise<Achievement[]> {
    try {
      return await apiService.getAvailableAchievements();
    } catch (error) {
      console.error('Error getting available achievements:', error);
      return [];
    }
  },
};

