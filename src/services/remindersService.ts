// Serviço de Lembretes
import { apiService } from './apiService';
import {
  Reminder,
  CreateReminderRequest,
  UpdateReminderRequest,
} from '../types/api';

export const remindersService = {
  async getReminders(): Promise<Reminder[]> {
    try {
      return await apiService.getReminders();
    } catch (error) {
      console.error('Error getting reminders:', error);
      return [];
    }
  },

  async createReminder(request: CreateReminderRequest): Promise<Reminder | null> {
    try {
      return await apiService.createReminder(request);
    } catch (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
  },

  async updateReminder(id: string, request: UpdateReminderRequest): Promise<Reminder | null> {
    try {
      return await apiService.updateReminder(id, request);
    } catch (error) {
      console.error('Error updating reminder:', error);
      return null;
    }
  },

  async deleteReminder(id: string): Promise<boolean> {
    try {
      await apiService.deleteReminder(id);
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  },
};

