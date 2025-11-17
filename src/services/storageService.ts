// Serviço de storage local usando AsyncStorage
// Pode ser facilmente substituído por chamadas de API .NET

import AsyncStorage from '@react-native-async-storage/async-storage';
// Este arquivo não é mais usado - mantido apenas para referência
// Todos os serviços agora usam a API .NET via apiService

import { Checkin, Tip, WeeklyReport, CreateCheckinRequest, CreateTipRequest } from '../types/api';

const STORAGE_KEYS = {
  CHECKINS: '@carework:checkins',
  TIPS: '@carework:tips',
  USER_ID: '@carework:userId',
};

export const storageService = {
  // ========== CHECKINS ==========
  async getCheckins(userId: string): Promise<Checkin[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
      if (!data) return [];
      const allCheckins: Checkin[] = JSON.parse(data);
      return allCheckins.filter((c) => c.userId === userId);
    } catch (error) {
      console.error('Error getting checkins:', error);
      return [];
    }
  },

  async getCheckinById(id: string): Promise<Checkin | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
      if (!data) return null;
      const checkins: Checkin[] = JSON.parse(data);
      return checkins.find((c) => c.id === id) || null;
    } catch (error) {
      console.error('Error getting checkin:', error);
      return null;
    }
  },

  async createCheckin(userId: string, dto: CreateCheckinDto): Promise<Checkin> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
      const checkins: Checkin[] = data ? JSON.parse(data) : [];

      const newCheckin: Checkin = {
        id: Date.now().toString(),
        userId,
        ...dto,
        createdAt: new Date().toISOString(),
      };

      checkins.push(newCheckin);
      await AsyncStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));

      return newCheckin;
    } catch (error) {
      console.error('Error creating checkin:', error);
      throw error;
    }
  },

  async updateCheckin(id: string, dto: Partial<CreateCheckinDto>): Promise<Checkin | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
      if (!data) return null;
      const checkins: Checkin[] = JSON.parse(data);
      const index = checkins.findIndex((c) => c.id === id);
      if (index === -1) return null;

      checkins[index] = {
        ...checkins[index],
        ...dto,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
      return checkins[index];
    } catch (error) {
      console.error('Error updating checkin:', error);
      throw error;
    }
  },

  async deleteCheckin(id: string): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
      if (!data) return false;
      const checkins: Checkin[] = JSON.parse(data);
      const filtered = checkins.filter((c) => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting checkin:', error);
      return false;
    }
  },

  async getCheckinsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Checkin[]> {
    try {
      const checkins = await this.getCheckins(userId);
      return checkins.filter((c) => {
        const date = new Date(c.createdAt);
        return date >= startDate && date <= endDate;
      });
    } catch (error) {
      console.error('Error getting checkins by date range:', error);
      return [];
    }
  },

  // ========== TIPS ==========
  async getTips(): Promise<Tip[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TIPS);
      if (!data) {
        // Retornar dicas padrão se não houver nenhuma
        return this.getDefaultTips();
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting tips:', error);
      return this.getDefaultTips();
    }
  },

  async getTipById(id: string): Promise<Tip | null> {
    try {
      const tips = await this.getTips();
      return tips.find((t) => t.id === id) || null;
    } catch (error) {
      console.error('Error getting tip:', error);
      return null;
    }
  },

  async createTip(dto: CreateTipDto): Promise<Tip> {
    try {
      const tips = await this.getTips();
      const newTip: Tip = {
        id: Date.now().toString(),
        ...dto,
        createdAt: new Date().toISOString(),
      };

      tips.push(newTip);
      await AsyncStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(tips));

      return newTip;
    } catch (error) {
      console.error('Error creating tip:', error);
      throw error;
    }
  },

  async updateTip(id: string, dto: Partial<CreateTipDto>): Promise<Tip | null> {
    try {
      const tips = await this.getTips();
      const index = tips.findIndex((t) => t.id === id);
      if (index === -1) return null;

      tips[index] = {
        ...tips[index],
        ...dto,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(tips));
      return tips[index];
    } catch (error) {
      console.error('Error updating tip:', error);
      throw error;
    }
  },

  async deleteTip(id: string): Promise<boolean> {
    try {
      const tips = await this.getTips();
      const filtered = tips.filter((t) => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.TIPS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting tip:', error);
      return false;
    }
  },

  // ========== REPORTS ==========
  async getWeeklyReport(userId: string, weekStart: Date): Promise<WeeklyReport> {
    try {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const checkins = await this.getCheckinsByDateRange(userId, weekStart, weekEnd);

      if (checkins.length === 0) {
        return {
          userId,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          averages: { mood: 0, stress: 0, sleep: 0 },
          dailyData: [],
        };
      }

      const averages = {
        mood: checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length,
        stress: checkins.reduce((sum, c) => sum + c.stress, 0) / checkins.length,
        sleep: checkins.reduce((sum, c) => sum + c.sleep, 0) / checkins.length,
      };

      const dailyData = checkins.map((c) => ({
        date: c.createdAt,
        mood: c.mood,
        stress: c.stress,
        sleep: c.sleep,
      }));

      return {
        userId,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        averages,
        dailyData,
      };
    } catch (error) {
      console.error('Error getting weekly report:', error);
      throw error;
    }
  },

  // ========== HELPER METHODS ==========
  getDefaultTips(): Tip[] {
    return [
      {
        id: '1',
        title: 'Pausas regulares',
        description: 'Faça pausas de 5-10 minutos a cada hora de trabalho para descansar os olhos e a mente.',
        icon: 'time-outline',
        color: '#6B7FD7',
        category: 'produtividade',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Respiração consciente',
        description: 'Pratique respirações profundas quando sentir estresse. Inspire por 4 segundos, segure por 4 e expire por 4.',
        icon: 'leaf-outline',
        color: '#06D6A0',
        category: 'bem-estar',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Hidratação',
        description: 'Mantenha-se hidratado! Beba pelo menos 2 litros de água por dia para manter seu corpo e mente funcionando bem.',
        icon: 'water-outline',
        color: '#4A90E2',
        category: 'saúde',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Postura ergonômica',
        description: 'Ajuste sua cadeira e monitor para manter uma postura confortável e prevenir dores nas costas e pescoço.',
        icon: 'body-outline',
        color: '#B8A9D9',
        category: 'saúde',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Exercícios leves',
        description: 'Incorpore alongamentos e caminhadas curtas durante o dia para melhorar a circulação e reduzir tensão.',
        icon: 'fitness-outline',
        color: '#FFB800',
        category: 'exercício',
        createdAt: new Date().toISOString(),
      },
      {
        id: '6',
        title: 'Limite de notificações',
        description: 'Configure horários específicos para verificar e-mails e mensagens, evitando interrupções constantes.',
        icon: 'notifications-off-outline',
        color: '#E63946',
        category: 'produtividade',
        createdAt: new Date().toISOString(),
      },
    ];
  },
};

