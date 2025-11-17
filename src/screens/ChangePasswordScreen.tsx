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
import { apiService } from '../services/apiService';
import { getErrorMessage } from '../utils/errorHandler';

export const ChangePasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Erro', 'A senha atual é obrigatória');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Erro', 'A nova senha é obrigatória');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Erro', 'A nova senha deve ser diferente da senha atual');
      return;
    }

    setLoading(true);
    try {
      await apiService.updatePassword({
        currentPassword,
        newPassword,
      });

      Alert.alert('Sucesso', 'Senha atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            // Limpar campos
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error updating password:', error);
      Alert.alert('Erro', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={48} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Alterar Senha</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Digite sua senha atual e a nova senha
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Senha Atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Digite sua senha atual"
            secureTextEntry={!showCurrentPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.textLight} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons
                  name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.textLight}
                />
              </TouchableOpacity>
            }
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Digite a nova senha (mín. 6 caracteres)"
            secureTextEntry={!showNewPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.textLight} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.textLight}
                />
              </TouchableOpacity>
            }
          />

          <View style={styles.inputSpacing} />

          <Input
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirme a nova senha"
            secureTextEntry={!showConfirmPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.textLight} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.textLight}
                />
              </TouchableOpacity>
            }
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              A senha deve ter no mínimo 6 caracteres e ser diferente da senha atual.
            </Text>
          </View>
        </Card>

        <Button
          title={loading ? 'Salvando...' : 'Salvar Nova Senha'}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
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

