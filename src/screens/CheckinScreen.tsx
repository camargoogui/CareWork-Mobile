import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { checkinService } from '../services/checkinService';
import { getErrorMessage } from '../utils/errorHandler';

export const CheckinScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para fazer check-in');
      return;
    }

    if (mood === null || stress === null || sleep === null) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Preparar request body - só incluir notes e tags se tiverem valor
      const requestBody: any = {
        mood,
        stress,
        sleep,
      };

      // Adicionar notes apenas se não estiver vazio
      const notesTrimmed = notes.trim();
      if (notesTrimmed.length > 0) {
        requestBody.notes = notesTrimmed;
      }

      // Adicionar tags apenas se houver tags
      if (tagsArray.length > 0) {
        requestBody.tags = tagsArray;
      }

      await checkinService.createCheckin(requestBody);

      Alert.alert('Sucesso', 'Check-in registrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setMood(null);
            setStress(null);
            setSleep(null);
            setNotes('');
            setTags('');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const renderScale = (
    label: string,
    value: number | null,
    setValue: (value: number) => void,
    icon: keyof typeof Ionicons.glyphMap,
    color: string
  ) => {
    return (
      <Card style={styles.scaleCard}>
        <View style={styles.scaleHeader}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={[styles.scaleLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
        <View style={styles.scaleContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.scaleButton,
                {
                  backgroundColor: value === num ? color : theme.colors.surface,
                  borderColor: color,
                },
              ]}
              onPress={() => setValue(num)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  {
                    color: value === num ? theme.colors.white : color,
                    fontWeight: value === num ? '700' : '400',
                  },
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.scaleHint, { color: theme.colors.textLight }]}>
          {value ? `Selecionado: ${value}` : 'Toque para selecionar'}
        </Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Check-in diário</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Como você está se sentindo hoje?
          </Text>
        </View>

        {renderScale('Humor', mood, setMood, 'happy-outline', theme.colors.primary)}
        {renderScale('Nível de estresse', stress, setStress, 'flash-outline', theme.colors.warning)}
        {renderScale('Qualidade do sono', sleep, setSleep, 'moon-outline', theme.colors.secondary)}

        <Card style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.notesLabel, { color: theme.colors.text }]}>Notas (opcional)</Text>
          </View>
          <TextInput
            style={[
              styles.notesInput,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Adicione um contexto sobre como você está se sentindo..."
            placeholderTextColor={theme.colors.textLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        <Card style={styles.tagsCard}>
          <View style={styles.tagsHeader}>
            <Ionicons name="pricetag-outline" size={24} color={theme.colors.secondary} />
            <Text style={[styles.tagsLabel, { color: theme.colors.text }]}>Tags (opcional)</Text>
          </View>
          <TextInput
            style={[
              styles.tagsInput,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Ex: trabalho, pessoal, exercício (separadas por vírgula)"
            placeholderTextColor={theme.colors.textLight}
            value={tags}
            onChangeText={setTags}
          />
          <Text style={[styles.tagsHint, { color: theme.colors.textSecondary }]}>
            Separe as tags por vírgula
          </Text>
        </Card>

        <Button
          title="Salvar check-in"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          fullWidth
          disabled={mood === null || stress === null || sleep === null || loading}
          loading={loading}
          style={styles.submitButton}
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
  scaleCard: {
    marginBottom: 20,
  },
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scaleLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  scaleHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  notesCard: {
    marginBottom: 20,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  notesInput: {
    minHeight: 100,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  tagsCard: {
    marginBottom: 20,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagsLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  tagsInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 4,
  },
  tagsHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

