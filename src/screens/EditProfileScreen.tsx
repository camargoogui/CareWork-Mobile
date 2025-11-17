import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
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

export const EditProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    // Verificar se houve alterações
    if (name === user?.name && email === user?.email) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita');
      return;
    }

    setLoading(true);
    try {
      const profileData = await apiService.updateProfile({ name, email });
      
      // Atualizar o contexto do usuário
      if (updateUser) {
        updateUser({
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
        });
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Erro', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="person" size={48} color={theme.colors.white} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Editar Perfil</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Atualize suas informações pessoais
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.textLight} />}
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.textLight} />}
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Após atualizar o email, você precisará fazer login novamente.
            </Text>
          </View>
        </Card>

        <Button
          title={loading ? 'Salvando...' : 'Salvar Alterações'}
          onPress={handleSave}
          disabled={loading}
          loading={loading}
          fullWidth
          style={styles.saveButton}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: 24,
  },
  inputSpacing: {
    height: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  saveButton: {
    marginBottom: 24,
  },
});

