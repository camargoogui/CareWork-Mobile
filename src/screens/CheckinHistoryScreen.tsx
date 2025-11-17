import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { checkinService } from '../services/checkinService';
import { getErrorMessage } from '../utils/errorHandler';
import { Checkin } from '../types/api';
import { EditCheckinModal } from './EditCheckinModal';
import { clearAllCache } from '../utils/clearOldData';

export const CheckinHistoryScreen: React.FC = () => {
  const theme = useTheme();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingCheckin, setEditingCheckin] = useState<Checkin | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Limpar cache na primeira carga para garantir dados frescos da API
    clearAllCache().then(() => {
      loadCheckins();
    });
  }, []);

  const loadCheckins = async () => {
    try {
      setLoading(true);
      // SEMPRE buscar da API .NET - nunca usar cache local
      const response = await checkinService.getCheckins(1, 100); // Buscar até 100 check-ins
      
      // Garantir que estamos usando apenas os dados da API
      if (response && response.data && Array.isArray(response.data)) {
        setCheckins(response.data);
        console.log(`✅ Carregados ${response.data.length} check-ins da API`);
      } else {
        setCheckins([]);
        console.log('⚠️ Resposta da API inválida ou vazia');
      }
    } catch (error) {
      console.error('Error loading checkins:', error);
      // Em caso de erro, limpar lista para não mostrar dados antigos
      setCheckins([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Limpar cache antes de recarregar para garantir dados frescos
    await clearAllCache();
    loadCheckins();
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateStr} às ${timeStr}`;
  };

  const getMoodEmoji = (mood: number): string => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getMoodColor = (mood: number): string => {
    if (mood <= 2) return theme.colors.error;
    if (mood === 3) return theme.colors.warning;
    return theme.colors.success;
  };

  const getStressColor = (stress: number): string => {
    if (stress <= 2) return theme.colors.success;
    if (stress === 3) return theme.colors.warning;
    return theme.colors.error;
  };

  const getSleepColor = (sleep: number): string => {
    if (sleep <= 2) return theme.colors.error;
    if (sleep === 3) return theme.colors.warning;
    return theme.colors.success;
  };

  const handleDelete = (checkin: Checkin) => {
    Alert.alert(
      'Deletar Check-in',
      'Tem certeza que deseja deletar este check-in? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(checkin.id);
            try {
              const success = await checkinService.deleteCheckin(checkin.id);
              if (success) {
                // Remover da lista local
                setCheckins(checkins.filter((c) => c.id !== checkin.id));
                Alert.alert('Sucesso', 'Check-in deletado com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível deletar o check-in. Tente novamente.');
              }
            } catch (error: any) {
              Alert.alert('Erro', getErrorMessage(error));
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (checkin: Checkin) => {
    setEditingCheckin(checkin);
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    loadCheckins(); // Recarregar lista após edição
  };

  const renderRightActions = (checkin: Checkin, progress: Animated.AnimatedInterpolation) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <Animated.View
          style={[
            styles.actionButtonContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              handleEdit(checkin);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.white} />
            <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>Editar</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.actionButtonContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleDelete(checkin)}
            disabled={deletingId === checkin.id}
            activeOpacity={0.7}
          >
            {deletingId === checkin.id ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color={theme.colors.white} />
                <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>Deletar</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Histórico de Check-ins</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {checkins.length} {checkins.length === 1 ? 'check-in registrado' : 'check-ins registrados'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Carregando check-ins...
            </Text>
          </View>
        ) : checkins.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textLight} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Nenhum check-in registrado ainda
            </Text>
            <Text style={[styles.emptyHint, { color: theme.colors.textLight }]}>
              Faça seu primeiro check-in na aba Check-in
            </Text>
          </Card>
        ) : (
          checkins.map((checkin) => (
            <Swipeable
              key={checkin.id}
              renderRightActions={(progress) => renderRightActions(checkin, progress)}
              overshootRight={false}
            >
              <Card style={styles.checkinCard}>
                <View style={styles.checkinHeader}>
                  <View style={styles.dateTimeContainer}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.dateTime, { color: theme.colors.textSecondary }]}>
                      {formatDateTime(checkin.createdAt)}
                    </Text>
                  </View>
                </View>

              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <View style={styles.metricHeader}>
                    <Ionicons name="happy-outline" size={20} color={theme.colors.primary} />
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Humor</Text>
                  </View>
                  <View style={styles.metricValueContainer}>
                    <Text style={[styles.metricEmoji]}>{getMoodEmoji(checkin.mood)}</Text>
                    <Text
                      style={[
                        styles.metricValue,
                        { color: getMoodColor(checkin.mood) },
                      ]}
                    >
                      {checkin.mood}/5
                    </Text>
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <View style={styles.metricHeader}>
                    <Ionicons name="flash-outline" size={20} color={theme.colors.warning} />
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Estresse</Text>
                  </View>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: getStressColor(checkin.stress) },
                    ]}
                  >
                    {checkin.stress}/5
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <View style={styles.metricHeader}>
                    <Ionicons name="moon-outline" size={20} color={theme.colors.secondary} />
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Sono</Text>
                  </View>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: getSleepColor(checkin.sleep) },
                    ]}
                  >
                    {checkin.sleep}/5
                  </Text>
                </View>
              </View>

              {checkin.notes && (
                <View style={styles.notesContainer}>
                  <Ionicons name="document-text-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.notesText, { color: theme.colors.text }]}>{checkin.notes}</Text>
                </View>
              )}

              {checkin.tags && checkin.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {checkin.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tag,
                        { backgroundColor: `${theme.colors.secondary}20` },
                      ]}
                    >
                      <Ionicons name="pricetag" size={12} color={theme.colors.secondary} />
                      <Text style={[styles.tagText, { color: theme.colors.secondary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
              </Card>
            </Swipeable>
          ))
        )}
      </ScrollView>

      <EditCheckinModal
        visible={isEditModalVisible}
        checkin={editingCheckin}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingCheckin(null);
        }}
        onSuccess={handleEditSuccess}
      />
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
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  checkinCard: {
    marginBottom: 16,
  },
  checkinHeader: {
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricEmoji: {
    fontSize: 20,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  notesContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    gap: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginRight: 16,
    gap: 8,
  },
  actionButtonContainer: {
    width: 80,
    justifyContent: 'center',
  },
  editButton: {
    width: 80,
    height: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    gap: 4,
    paddingVertical: 8,
  },
  deleteButton: {
    width: 80,
    height: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    gap: 4,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

