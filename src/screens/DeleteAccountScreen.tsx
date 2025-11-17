import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { getErrorMessage } from '../utils/errorHandler';

export const DeleteAccountScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDelete = () => {
    if (!password.trim()) {
      Alert.alert('Erro', 'Por favor, digite sua senha para confirmar');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos permanentemente.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar Conta',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await apiService.deleteAccount({ password });
              
              Alert.alert(
                'Conta Deletada',
                'Sua conta foi deletada com sucesso.',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      await logout();
                      // A navegação será redirecionada automaticamente pelo AuthContext
                    },
                  },
                ]
              );
            } catch (error: any) {
              console.error('Error deleting account:', error);
              Alert.alert('Erro', getErrorMessage(error));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <Ionicons name="warning" size={48} color={theme.colors.error} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Deletar Conta</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Esta ação é permanente e não pode ser desfeita
          </Text>
        </View>

        <Card style={[styles.warningCard, { backgroundColor: theme.colors.error + '10' }]}>
          <View style={styles.warningHeader}>
            <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
            <Text style={[styles.warningTitle, { color: theme.colors.error }]}>
              Atenção!
            </Text>
          </View>
          <Text style={[styles.warningText, { color: theme.colors.text }]}>
            Ao deletar sua conta, todos os seus dados serão permanentemente removidos:
          </Text>
          <View style={styles.warningList}>
            <View style={styles.warningItem}>
              <Ionicons name="close-circle" size={16} color={theme.colors.error} />
              <Text style={[styles.warningItemText, { color: theme.colors.text }]}>
                Todos os seus check-ins
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Ionicons name="close-circle" size={16} color={theme.colors.error} />
              <Text style={[styles.warningItemText, { color: theme.colors.text }]}>
                Histórico e relatórios
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Ionicons name="close-circle" size={16} color={theme.colors.error} />
              <Text style={[styles.warningItemText, { color: theme.colors.text }]}>
                Configurações e preferências
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Ionicons name="close-circle" size={16} color={theme.colors.error} />
              <Text style={[styles.warningItemText, { color: theme.colors.text }]}>
                Todas as outras informações da conta
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Input
            label="Confirme sua senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha para confirmar"
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.textLight} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.textLight}
                />
              </TouchableOpacity>
            }
          />
        </Card>

        <Button
          title={loading ? 'Deletando...' : 'Deletar Minha Conta'}
          onPress={handleDelete}
          disabled={loading}
          loading={loading}
          fullWidth
          style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
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
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  warningCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  warningList: {
    gap: 8,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningItemText: {
    fontSize: 14,
    flex: 1,
  },
  formCard: {
    marginBottom: 24,
  },
  deleteButton: {
    marginBottom: 24,
  },
});

