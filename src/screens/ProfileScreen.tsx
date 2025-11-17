import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { checkinService } from '../services/checkinService';
import { insightsService } from '../services/insightsService';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Buscar todos os check-ins (primeira página com tamanho grande)
      const checkinsData = await checkinService.getCheckins(1, 1000);
      const checkins = checkinsData.data || [];

      setTotalCheckins(checkins.length);

      // Calcular dias únicos com check-in
      const uniqueDates = new Set(
        checkins.map((c) => new Date(c.createdAt).toDateString())
      );
      setTotalDays(uniqueDates.size);

      // Calcular média de humor
      if (checkins.length > 0) {
        const moodSum = checkins.reduce((sum, c) => sum + (c.mood || 0), 0);
        const average = moodSum / checkins.length;
        setAverageMood(Math.round(average * 10) / 10); // Arredondar para 1 casa decimal
      } else {
        setAverageMood(null);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      icon: 'person-outline' as const,
      label: 'Editar perfil',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'lock-closed-outline' as const,
      label: 'Alterar senha',
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      icon: 'trash-outline' as const,
      label: 'Deletar conta',
      onPress: () => navigation.navigate('DeleteAccount'),
      color: theme.colors.error,
    },
    {
      icon: 'help-circle-outline' as const,
      label: 'Ajuda',
      onPress: () => navigation.navigate('Help'),
    },
    {
      icon: 'information-circle-outline' as const,
      label: 'Sobre',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="person" size={48} color={theme.colors.white} />
          </View>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.name || 'Usuário'}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
            {user?.email || 'usuario@email.com'}
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {loading ? '...' : totalCheckins}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Check-ins
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.divider }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {loading ? '...' : totalDays}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Dias</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.divider }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {loading ? '...' : averageMood !== null ? averageMood.toFixed(1) : '-'}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Média</Text>
            </View>
          </View>
        </Card>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: theme.colors.divider }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.color || theme.colors.primary}
                />
                <Text
                  style={[
                    styles.menuItemLabel,
                    { color: item.color || theme.colors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Sair"
          onPress={handleLogout}
          variant="outline"
          size="large"
          fullWidth
          style={styles.logoutButton}
        />
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
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menu: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginBottom: 24,
  },
});

