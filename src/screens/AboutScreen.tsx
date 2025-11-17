import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export const AboutScreen: React.FC = () => {
  const theme = useTheme();

  // TODO: Buscar hash do commit dinamicamente
  const commitHash = 'N/A';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="heart" size={48} color={theme.colors.white} />
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>CareWork</Text>
          <Text style={[styles.version, { color: theme.colors.textSecondary }]}>Versão 1.0.0</Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            CareWork é um aplicativo desenvolvido para ajudar você a monitorar e melhorar seu
            bem-estar no ambiente de trabalho. Faça check-ins diários, acompanhe suas métricas e
            receba dicas personalizadas de autocuidado.
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="code-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
              Commit Hash:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{commitHash}</Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recursos</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Check-in diário de bem-estar
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Relatórios e análises semanais
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Dicas personalizadas de autocuidado
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>
                Interface intuitiva e moderna
              </Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.footer, { color: theme.colors.textLight }]}>
          © 2024 CareWork. Todos os direitos reservados.
        </Text>
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
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});

