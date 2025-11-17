import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { checkinService } from '../services/checkinService';
import { insightsService } from '../services/insightsService';
import { Checkin } from '../types/api';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [todayCheckin, setTodayCheckin] = useState<Checkin | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastCheckinDate: null });
  const [trend, setTrend] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!user) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Resetar animações se necessário

      // Carregar check-in de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      console.log('🔍 Buscando check-ins de hoje:', {
        from: today.toISOString(),
        to: tomorrow.toISOString(),
      });

      const checkins = await checkinService.getCheckinsByDateRange(today, tomorrow);
      console.log('📊 Check-ins encontrados:', checkins.length);
      
      if (checkins.length > 0) {
        // Ordenar por data de criação (mais recente primeiro) e pegar o primeiro
        const sortedCheckins = checkins.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTodayCheckin(sortedCheckins[0]);
        console.log('✅ Check-in de hoje carregado:', sortedCheckins[0].id);
      } else {
        setTodayCheckin(null);
        console.log('ℹ️ Nenhum check-in encontrado para hoje');
      }

      // Carregar streak
      const streakData = await insightsService.getStreak();
      setStreak(streakData);

      // Carregar tendência (pode falhar se não houver dados suficientes)
      try {
        const trends = await insightsService.getTrends('month');
        if (trends) {
          const trendMap: Record<string, string> = {
            improving: '📈 Melhorando',
            declining: '📉 Precisando de atenção',
            stable: '➡️ Estável',
          };
          setTrend(trendMap[trends.trend] || '');
        } else {
          setTrend('');
        }
      } catch (error) {
        // Ignorar erro se não houver dados suficientes para gerar tendências
        console.log('Não há dados suficientes para gerar tendências ainda');
        setTrend('');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Recarregar dados quando a tela receber foco (quando voltar de outra tela)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadData();
      }
    }, [user, loadData])
  );


  const onRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);


  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero Section com Gradiente */}
        <View style={[styles.heroSection, { backgroundColor: theme.colors.primary }]}>
          <View style={[styles.heroGradientOverlay, { backgroundColor: theme.colors.secondary }]} />
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, { backgroundColor: theme.colors.white }]}>
                    <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                      {getInitials(user?.name)}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroGreeting}>
                  {getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                </Text>
                <Text style={styles.heroDate}>
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              {!todayCheckin && (
                <TouchableOpacity
                  style={[styles.quickCheckinButton, { backgroundColor: theme.colors.white }]}
                  onPress={() => navigation.navigate('Checkin')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
                  <Text style={[styles.quickCheckinText, { color: theme.colors.primary }]}>
                    Fazer Check-in Agora
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>


        {/* Streak Card */}
        {streak.current > 0 && (
          <Card style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <Ionicons name="flame" size={24} color={theme.colors.warning} />
              <Text style={[styles.streakTitle, { color: theme.colors.text }]}>Sequência</Text>
            </View>
            <Text style={[styles.streakValue, { color: theme.colors.text }]}>
              {streak.current} {streak.current === 1 ? 'dia' : 'dias'} consecutivos! 🔥
            </Text>
            {streak.longest > streak.current && (
              <Text style={[styles.streakHint, { color: theme.colors.textSecondary }]}>
                Seu recorde: {streak.longest} dias
              </Text>
            )}
          </Card>
        )}

        {/* Trend Card */}
        {trend && (
          <Card style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Ionicons name="trending-up-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.trendTitle, { color: theme.colors.text }]}>Tendência do mês</Text>
            </View>
            <Text style={[styles.trendValue, { color: theme.colors.text }]}>{trend}</Text>
          </Card>
        )}

        <Card style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.reminderTitle, { color: theme.colors.text }]}>Lembrete</Text>
          </View>
          <Text style={[styles.reminderText, { color: theme.colors.textSecondary }]}>
            {todayCheckin
              ? 'Ótimo! Você já fez seu check-in hoje. Continue assim! 💪'
              : 'Não esqueça de fazer seu check-in diário!'}
          </Text>
        </Card>

        {/* Histórico de Check-ins */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CheckinHistory')}
          activeOpacity={0.7}
        >
          <Card style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.historyTitle, { color: theme.colors.text }]}>
                Histórico de Check-ins
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
            </View>
            <Text style={[styles.historyText, { color: theme.colors.textSecondary }]}>
              Veja todos os seus check-ins registrados
            </Text>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  // Hero Section
  heroSection: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  heroGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  heroGradient: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTop: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroGreeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroDate: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  quickCheckinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickCheckinText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  reminderCard: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  reminderText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  streakCard: {
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  streakHint: {
    fontSize: 12,
    marginTop: 4,
  },
  trendCard: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  historyCard: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  historyText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 32,
  },
});
