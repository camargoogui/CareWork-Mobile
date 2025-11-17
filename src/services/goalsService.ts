// Serviço de Metas
import { apiService } from './apiService';
import {
  Goal,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalProgress,
} from '../types/api';

export const goalsService = {
  async getGoals(): Promise<Goal[]> {
    try {
      return await apiService.getGoals();
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  },

  async createGoal(request: CreateGoalRequest): Promise<Goal | null> {
    try {
      return await apiService.createGoal(request);
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  },

  async updateGoal(id: string, request: UpdateGoalRequest): Promise<Goal | null> {
    try {
      return await apiService.updateGoal(id, request);
    } catch (error) {
      console.error('Error updating goal:', error);
      return null;
    }
  },

  async deleteGoal(id: string): Promise<boolean> {
    try {
      await apiService.deleteGoal(id);
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  },

  async getGoalProgress(id: string): Promise<GoalProgress | null> {
    try {
      return await apiService.getGoalProgress(id);
    } catch (error) {
      console.error('Error getting goal progress:', error);
      return null;
    }
  },
};

