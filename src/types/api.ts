// Tipos para integração com API .NET

// ========== AUTH ==========
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UpdateProfileResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// ========== CHECKIN ==========
export interface Checkin {
  id: string;
  userId: string;
  mood: number; // 1-5
  stress: number; // 1-5
  sleep: number; // 1-5
  notes?: string | null; // Notas opcionais
  tags?: string[]; // Tags opcionais
  createdAt: string; // ISO 8601 datetime
  updatedAt: string | null;
}

export interface CreateCheckinRequest {
  mood: number; // 1-5, obrigatório
  stress: number; // 1-5, obrigatório
  sleep: number; // 1-5, obrigatório
  notes?: string; // Opcional
  tags?: string[]; // Opcional
}

export interface UpdateCheckinRequest {
  mood?: number; // 1-5, opcional
  stress?: number; // 1-5, opcional
  sleep?: number; // 1-5, opcional
  notes?: string; // Opcional
  tags?: string[]; // Opcional
}

export interface QuickCheckinRequest {
  mood: number; // 1-5, obrigatório (stress e sleep usam valores padrão)
}

// ========== TIP ==========
export interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  color: string | null;
  category: string | null;
  createdAt: string; // ISO 8601 datetime
  updatedAt: string | null;
}

export interface CreateTipRequest {
  title: string; // obrigatório, max 200 chars
  description: string; // obrigatório, max 1000 chars
  icon?: string; // opcional, max 100 chars
  color?: string; // opcional, max 50 chars
  category?: string; // opcional, max 100 chars
}

export interface UpdateTipRequest {
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  category?: string;
}

// ========== REPORT ==========
export interface WeeklyReport {
  userId: string;
  weekStart: string; // ISO 8601 datetime
  weekEnd: string; // ISO 8601 datetime
  averages: {
    mood: number;
    stress: number;
    sleep: number;
  };
  dailyData: {
    date: string; // ISO 8601 date
    mood: number;
    stress: number;
    sleep: number;
  }[];
}

// ========== PAGINATION ==========
export interface PagedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  links: {
    self: string;
    first: string;
    last: string;
    previous: string | null;
    next: string | null;
  };
}

// ========== API RESPONSE ==========
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// ========== INSIGHTS ==========
export interface TrendAnalysis {
  period: string; // 'week' | 'month' | 'year'
  trend: 'improving' | 'declining' | 'stable';
  moodTrend: number; // -1 a 1 (negativo = piorando, positivo = melhorando)
  stressTrend: number;
  sleepTrend: number;
  mostStressfulDay?: string; // Dia da semana mais estressante
  correlation: {
    sleepMood: number; // Correlação entre sono e humor (-1 a 1)
    stressMood: number; // Correlação entre stress e humor
  };
  alerts: string[]; // Alertas quando há declínio significativo
}

export interface Recommendation {
  id: string;
  type: 'tip' | 'goal' | 'reminder';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  basedOn: string; // Ex: "Alto stress + sono baixo"
}

export interface ComparisonResult {
  period1: {
    label: string;
    averages: {
      mood: number;
      stress: number;
      sleep: number;
    };
  };
  period2: {
    label: string;
    averages: {
      mood: number;
      stress: number;
      sleep: number;
    };
  };
  differences: {
    mood: number; // Diferença entre períodos
    stress: number;
    sleep: number;
  };
  improvement: boolean; // Se houve melhora geral
}

export interface Streak {
  current: number; // Dias consecutivos atuais
  longest: number; // Maior sequência já alcançada
  lastCheckinDate: string | null;
}

// ========== ACHIEVEMENTS ==========
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  category: 'consistency' | 'wellbeing' | 'stress' | 'sleep' | 'mood';
  unlockedAt: string | null; // ISO 8601 datetime, null se não desbloqueado
  progress: number; // 0-100
  requirement: string; // Ex: "7 dias consecutivos"
}

// ========== GOALS ==========
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'mood' | 'stress' | 'sleep' | 'consistency';
  targetValue: number; // Valor alvo
  currentValue: number; // Valor atual
  deadline: string | null; // ISO 8601 date
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  type: 'mood' | 'stress' | 'sleep' | 'consistency';
  targetValue: number;
  deadline?: string; // ISO 8601 date
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetValue?: number;
  deadline?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
}

export interface GoalProgress {
  goalId: string;
  currentValue: number;
  targetValue: number;
  percentage: number; // 0-100
  daysRemaining: number | null;
  onTrack: boolean; // Se está no caminho para alcançar
}

// ========== REMINDERS ==========
export interface Reminder {
  id: string;
  userId: string;
  title: string;
  time: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (domingo-sábado)
  enabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateReminderRequest {
  title: string;
  time: string; // HH:mm
  daysOfWeek: number[]; // 0-6
}

export interface UpdateReminderRequest {
  title?: string;
  time?: string;
  daysOfWeek?: number[];
  enabled?: boolean;
}

// ========== REPORTS ==========
export interface MonthlyReport {
  userId: string;
  month: string; // YYYY-MM
  averages: {
    mood: number;
    stress: number;
    sleep: number;
  };
  bestDay: {
    date: string;
    mood: number;
    stress: number;
    sleep: number;
  };
  worstDay: {
    date: string;
    mood: number;
    stress: number;
    sleep: number;
  };
  trends: {
    mood: 'improving' | 'declining' | 'stable';
    stress: 'improving' | 'declining' | 'stable';
    sleep: 'improving' | 'declining' | 'stable';
  };
  comparisonWithPreviousMonth: {
    mood: number; // Diferença
    stress: number;
    sleep: number;
  };
  dailyData: {
    date: string;
    mood: number;
    stress: number;
    sleep: number;
  }[];
}

export interface CustomReportRequest {
  startDate: string; // ISO 8601 date
  endDate: string; // ISO 8601 date
  includeAverages: boolean;
  includeTrends: boolean;
  includeComparisons: boolean;
}

export interface CustomReport {
  period: {
    startDate: string;
    endDate: string;
  };
  averages?: {
    mood: number;
    stress: number;
    sleep: number;
  };
  trends?: {
    mood: 'improving' | 'declining' | 'stable';
    stress: 'improving' | 'declining' | 'stable';
    sleep: 'improving' | 'declining' | 'stable';
  };
  comparisons?: {
    previousPeriod: {
      mood: number;
      stress: number;
      sleep: number;
    };
  };
  dailyData: {
    date: string;
    mood: number;
    stress: number;
    sleep: number;
  }[];
}

// ========== API ERROR ==========
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

