import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';
import { WeeklyReport, MonthlyReport } from '../types/api';

type ReportType = 'weekly' | 'monthly';

export const ReportScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [reportType, setReportType] = useState<ReportType>('weekly');
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReport();
    }
  }, [user, reportType]);

  const loadReport = async () => {
    if (!user) return;

    try {
      setLoading(true);
      if (reportType === 'weekly') {
        // Calcular início da semana (segunda-feira)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStart = new Date(today.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        const weekStartFormatted = weekStart.toISOString().split('T')[0];
        const data = await reportService.getWeeklyReport(weekStartFormatted, user.id);
        setWeeklyReport(data);
      } else {
        // Mês atual no formato YYYY-MM
        const today = new Date();
        const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const data = await reportService.getMonthlyReport(month, user.id);
        setMonthlyReport(data);
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (
    title: string,
    value: string,
    icon: keyof typeof Ionicons.glyphMap,
    color: string,
    label: string = reportType === 'weekly' ? 'Média semanal' : 'Média mensal'
  ) => {
    return (
      <Card style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={[styles.metricTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
        </View>
        <Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text>
        <Text style={[styles.metricLabel, { color: theme.colors.textLight }]}>{label}</Text>
      </Card>
    );
  };

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable'): keyof typeof Ionicons.glyphMap => {
    switch (trend) {
      case 'improving':
        return 'trending-up';
      case 'declining':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = (trend: 'improving' | 'declining' | 'stable'): string => {
    switch (trend) {
      case 'improving':
        return theme.colors.success;
      case 'declining':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatMonthName = (month: string): string => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const report = reportType === 'weekly' ? weeklyReport : monthlyReport;
  const hasData = report && (reportType === 'weekly' 
    ? (report as WeeklyReport).dailyData.length > 0 
    : (report as MonthlyReport).dailyData.length > 0);

  if (!hasData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Relatórios</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Acompanhe suas médias {reportType === 'weekly' ? 'semanais' : 'mensais'}
            </Text>
          </View>

          {/* Seletor de tipo de relatório */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                reportType === 'weekly' && {
                  backgroundColor: theme.colors.primary,
                },
                reportType !== 'weekly' && {
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setReportType('weekly')}
            >
              <Text
                style={[
                  styles.selectorText,
                  { color: reportType === 'weekly' ? theme.colors.white : theme.colors.text },
                ]}
              >
                Semanal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                reportType === 'monthly' && {
                  backgroundColor: theme.colors.primary,
                },
                reportType !== 'monthly' && {
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setReportType('monthly')}
            >
              <Text
                style={[
                  styles.selectorText,
                  { color: reportType === 'monthly' ? theme.colors.white : theme.colors.text },
                ]}
              >
                Mensal
              </Text>
            </TouchableOpacity>
          </View>

          <Card>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Ainda não há dados para exibir. Faça alguns check-ins para ver seus relatórios!
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const averages = {
    mood: report!.averages.mood.toFixed(1),
    stress: report!.averages.stress.toFixed(1),
    sleep: report!.averages.sleep.toFixed(1),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Relatórios</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Acompanhe suas médias {reportType === 'weekly' ? 'semanais' : 'mensais'}
          </Text>
        </View>

        {/* Seletor de tipo de relatório */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              reportType === 'weekly' && {
                backgroundColor: theme.colors.primary,
              },
              reportType !== 'weekly' && {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setReportType('weekly')}
          >
            <Text
              style={[
                styles.selectorText,
                { color: reportType === 'weekly' ? theme.colors.white : theme.colors.text },
              ]}
            >
              Semanal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectorButton,
              reportType === 'monthly' && {
                backgroundColor: theme.colors.primary,
              },
              reportType !== 'monthly' && {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setReportType('monthly')}
          >
            <Text
              style={[
                styles.selectorText,
                { color: reportType === 'monthly' ? theme.colors.white : theme.colors.text },
              ]}
            >
              Mensal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricsRow}>
          {renderMetricCard('Humor', averages.mood, 'happy-outline', theme.colors.primary)}
          {renderMetricCard('Estresse', averages.stress, 'flash-outline', theme.colors.warning)}
          {renderMetricCard('Sono', averages.sleep, 'moon-outline', theme.colors.secondary)}
        </View>

        {/* Informações específicas do relatório mensal */}
        {reportType === 'monthly' && monthlyReport && (
          <>
            <Card style={styles.infoCard}>
              <Text style={[styles.infoCardTitle, { color: theme.colors.text }]}>
                {formatMonthName(monthlyReport.month)}
              </Text>
              
              {/* Melhor e Pior Dia */}
              <View style={styles.bestWorstContainer}>
                <View style={styles.bestWorstItem}>
                  <Ionicons name="trophy" size={20} color={theme.colors.success} />
                  <Text style={[styles.bestWorstLabel, { color: theme.colors.textSecondary }]}>
                    Melhor dia
                  </Text>
                  <Text style={[styles.bestWorstDate, { color: theme.colors.text }]}>
                    {new Date(monthlyReport.bestDay.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </Text>
                  <Text style={[styles.bestWorstValue, { color: theme.colors.success }]}>
                    Humor: {monthlyReport.bestDay.mood}/5
                  </Text>
                </View>
                <View style={styles.bestWorstItem}>
                  <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
                  <Text style={[styles.bestWorstLabel, { color: theme.colors.textSecondary }]}>
                    Pior dia
                  </Text>
                  <Text style={[styles.bestWorstDate, { color: theme.colors.text }]}>
                    {new Date(monthlyReport.worstDay.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </Text>
                  <Text style={[styles.bestWorstValue, { color: theme.colors.error }]}>
                    Humor: {monthlyReport.worstDay.mood}/5
                  </Text>
                </View>
              </View>

              {/* Tendências */}
              <View style={styles.trendsContainer}>
                <Text style={[styles.trendsTitle, { color: theme.colors.text }]}>Tendências</Text>
                <View style={styles.trendsRow}>
                  <View style={styles.trendItem}>
                    <Ionicons
                      name={getTrendIcon(monthlyReport.trends.mood)}
                      size={20}
                      color={getTrendColor(monthlyReport.trends.mood)}
                    />
                    <Text style={[styles.trendLabel, { color: theme.colors.textSecondary }]}>
                      Humor: {monthlyReport.trends.mood === 'improving' ? 'Melhorando' : monthlyReport.trends.mood === 'declining' ? 'Piorando' : 'Estável'}
                    </Text>
                  </View>
                  <View style={styles.trendItem}>
                    <Ionicons
                      name={getTrendIcon(monthlyReport.trends.stress)}
                      size={20}
                      color={getTrendColor(monthlyReport.trends.stress)}
                    />
                    <Text style={[styles.trendLabel, { color: theme.colors.textSecondary }]}>
                      Estresse: {monthlyReport.trends.stress === 'improving' ? 'Melhorando' : monthlyReport.trends.stress === 'declining' ? 'Piorando' : 'Estável'}
                    </Text>
                  </View>
                  <View style={styles.trendItem}>
                    <Ionicons
                      name={getTrendIcon(monthlyReport.trends.sleep)}
                      size={20}
                      color={getTrendColor(monthlyReport.trends.sleep)}
                    />
                    <Text style={[styles.trendLabel, { color: theme.colors.textSecondary }]}>
                      Sono: {monthlyReport.trends.sleep === 'improving' ? 'Melhorando' : monthlyReport.trends.sleep === 'declining' ? 'Piorando' : 'Estável'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Comparação com mês anterior */}
              <View style={styles.comparisonContainer}>
                <Text style={[styles.comparisonTitle, { color: theme.colors.text }]}>
                  Comparação com mês anterior
                </Text>
                <View style={styles.comparisonRow}>
                  <View style={styles.comparisonItem}>
                    <Text style={[styles.comparisonLabel, { color: theme.colors.textSecondary }]}>
                      Humor
                    </Text>
                    <Text
                      style={[
                        styles.comparisonValue,
                        {
                          color:
                            monthlyReport.comparisonWithPreviousMonth.mood > 0
                              ? theme.colors.success
                              : monthlyReport.comparisonWithPreviousMonth.mood < 0
                              ? theme.colors.error
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {monthlyReport.comparisonWithPreviousMonth.mood > 0 ? '+' : ''}
                      {monthlyReport.comparisonWithPreviousMonth.mood.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.comparisonItem}>
                    <Text style={[styles.comparisonLabel, { color: theme.colors.textSecondary }]}>
                      Estresse
                    </Text>
                    <Text
                      style={[
                        styles.comparisonValue,
                        {
                          color:
                            monthlyReport.comparisonWithPreviousMonth.stress < 0
                              ? theme.colors.success
                              : monthlyReport.comparisonWithPreviousMonth.stress > 0
                              ? theme.colors.error
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {monthlyReport.comparisonWithPreviousMonth.stress > 0 ? '+' : ''}
                      {monthlyReport.comparisonWithPreviousMonth.stress.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.comparisonItem}>
                    <Text style={[styles.comparisonLabel, { color: theme.colors.textSecondary }]}>
                      Sono
                    </Text>
                    <Text
                      style={[
                        styles.comparisonValue,
                        {
                          color:
                            monthlyReport.comparisonWithPreviousMonth.sleep > 0
                              ? theme.colors.success
                              : monthlyReport.comparisonWithPreviousMonth.sleep < 0
                              ? theme.colors.error
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {monthlyReport.comparisonWithPreviousMonth.sleep > 0 ? '+' : ''}
                      {monthlyReport.comparisonWithPreviousMonth.sleep.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </>
        )}

        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Evolução {reportType === 'weekly' ? 'semanal' : 'mensal'}
          </Text>
          <View style={styles.chartContainer}>
            {report!.dailyData.map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(data.mood / 5) * 100}%`,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>
                  {reportType === 'weekly' ? getDayName(data.date) : new Date(data.date).getDate()}
                </Text>
              </View>
            ))}
          </View>
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
              Veja todos os seus check-ins com data e horário
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    marginLeft: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
  },
  chartCard: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  bar: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
  selectorContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: 24,
  },
  infoCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  bestWorstContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  bestWorstItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  bestWorstLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  bestWorstDate: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bestWorstValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendsContainer: {
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  trendsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  trendsRow: {
    gap: 8,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendLabel: {
    fontSize: 14,
  },
  comparisonContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  historyCard: {
    marginTop: 12,
    marginBottom: 24,
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
