import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Tip } from '../types/api';
import { tipService } from '../services/tipService';

// Mapeamento de ícones inválidos para ícones válidos
const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  boundaries: 'resize-outline',
  break: 'pause-outline',
  food: 'restaurant-outline',
  music: 'musical-notes-outline',
  kindness: 'heart-outline',
  sun: 'sunny-outline',
  spa: 'flower-outline',
  bedroom: 'bed-outline',
  'coffee-off': 'cafe-outline',
  'phone-off': 'phone-portrait-outline',
  'news-off': 'newspaper-outline',
  focus: 'eye-outline',
  meditation: 'leaf-outline',
  breath: 'airplane-outline',
};

// Função para validar e mapear ícones
const getValidIcon = (iconName: string | undefined): keyof typeof Ionicons.glyphMap => {
  if (!iconName) return 'bulb-outline';
  
  // Verificar se está no mapeamento
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  
  // Verificar se é um ícone válido do Ionicons
  if (iconName in Ionicons.glyphMap) {
    return iconName as keyof typeof Ionicons.glyphMap;
  }
  
  // Retornar ícone padrão se não for válido
  return 'bulb-outline';
};

export const TipsScreen: React.FC = () => {
  const theme = useTheme();
  const [recommendedTips, setRecommendedTips] = useState<Tip[]>([]);
  const [allTips, setAllTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecommended, setShowRecommended] = useState(true);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      // Carregar dicas recomendadas primeiro
      const recommended = await tipService.getRecommendedTips();
      setRecommendedTips(recommended);

      // Carregar todas as dicas
      const response = await tipService.getTips(1, 100);
      setAllTips(response.data);
    } catch (error) {
      console.error('Error loading tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const tipsToShow = showRecommended && recommendedTips.length > 0 ? recommendedTips : allTips;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Dicas de autocuidado</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {showRecommended && recommendedTips.length > 0
              ? 'Dicas recomendadas para você'
              : 'Pequenas ações para melhorar seu bem-estar no trabalho'}
          </Text>
        </View>

        {recommendedTips.length > 0 && (
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: theme.colors.textSecondary }]}>
              {showRecommended ? 'Mostrando: Recomendadas' : 'Mostrando: Todas'}
            </Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : tipsToShow.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Nenhuma dica disponível no momento.
            </Text>
          </Card>
        ) : (
          tipsToShow.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                {tip.icon && (
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${tip.color || theme.colors.primary}20` },
                    ]}
                  >
                    <Ionicons
                      name={getValidIcon(tip.icon)}
                      size={28}
                      color={tip.color || theme.colors.primary}
                    />
                  </View>
                )}
                <Text style={[styles.tipTitle, { color: theme.colors.text }]}>{tip.title}</Text>
              </View>
              <Text style={[styles.tipDescription, { color: theme.colors.textSecondary }]}>
                {tip.description}
              </Text>
            </Card>
          ))
        )}
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
  tipCard: {
    marginBottom: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

