// TODO: Implementar integração com API
// Este arquivo será usado para todas as chamadas de API

const API_BASE_URL = 'https://api.carework.com'; // TODO: Configurar URL real

export const api = {
  // Autenticação
  login: async (email: string, password: string) => {
    // TODO: Implementar
    return Promise.resolve({ token: '', user: {} });
  },

  signup: async (name: string, email: string, password: string) => {
    // TODO: Implementar
    return Promise.resolve({ token: '', user: {} });
  },

  // Check-ins
  createCheckin: async (data: { mood: number; stress: number; sleep: number }) => {
    // TODO: Implementar
    return Promise.resolve({ id: '', ...data });
  },

  getCheckins: async () => {
    // TODO: Implementar
    return Promise.resolve([]);
  },

  // Relatórios
  getWeeklyReport: async () => {
    // TODO: Implementar
    return Promise.resolve({ averages: {}, weeklyData: [] });
  },
};

