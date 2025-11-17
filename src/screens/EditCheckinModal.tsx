import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { checkinService } from '../services/checkinService';
import { Checkin, UpdateCheckinRequest } from '../types/api';
import { getErrorMessage } from '../utils/errorHandler';

interface EditCheckinModalProps {
  visible: boolean;
  checkin: Checkin | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditCheckinModal: React.FC<EditCheckinModalProps> = ({
  visible,
  checkin,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkin) {
      setMood(checkin.mood);
      setStress(checkin.stress);
      setSleep(checkin.sleep);
      setNotes(checkin.notes || '');
      setTags(checkin.tags ? checkin.tags.join(', ') : '');
    }
  }, [checkin]);

  const handleSave = async () => {
    if (!checkin) return;

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

      const updateRequest: UpdateCheckinRequest = {
        mood,
        stress,
        sleep,
      };

      if (notes.trim().length > 0) {
        updateRequest.notes = notes.trim();
      }

      if (tagsArray.length > 0) {
        updateRequest.tags = tagsArray;
      }

      const updated = await checkinService.updateCheckin(checkin.id, updateRequest);

      if (updated) {
        Alert.alert('Sucesso', 'Check-in atualizado com sucesso!');
        onSuccess();
        onClose();
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o check-in. Tente novamente.');
      }
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
    icon: string,
    color: string
  ) => {
    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleHeader}>
          <Ionicons name={icon as any} size={24} color={color} />
          <Text style={[styles.scaleLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
        <View style={styles.scaleButtons}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.scaleButton,
                value === num && {
                  backgroundColor: color,
                  borderColor: color,
                },
                value !== num && {
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setValue(num)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  { color: value === num ? theme.colors.white : theme.colors.text },
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (!checkin) return null;

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={true} 
      onRequestClose={onClose}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalWrapper}>
          <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Editar Check-in</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {renderScale('Humor', mood, setMood, 'happy-outline', theme.colors.primary)}
              {renderScale('Estresse', stress, setStress, 'flash-outline', theme.colors.warning)}
              {renderScale('Sono', sleep, setSleep, 'moon-outline', theme.colors.secondary)}

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Notas (opcional)</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Como você está se sentindo?"
                  placeholderTextColor={theme.colors.textLight}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Tags (opcional, separadas por vírgula)
                </Text>
                <TextInput
                  style={[
                    styles.textInputSingle,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={tags}
                  onChangeText={setTags}
                  placeholder="Ex: Trabalho, Academia, Família"
                  placeholderTextColor={theme.colors.textLight}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title="Cancelar"
                  onPress={onClose}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title={loading ? 'Salvando...' : 'Salvar Alterações'}
                  onPress={handleSave}
                  disabled={loading}
                  loading={loading}
                  style={styles.saveButton}
                />
              </View>
            </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalWrapper: {
    width: '100%',
    zIndex: 1,
  },
  safeArea: {
    maxHeight: '93%',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 520,
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  scaleContainer: {
    marginBottom: 24,
  },
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  scaleLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scaleButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  textInputSingle: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

