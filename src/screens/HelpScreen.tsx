import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
  question: string;
  answer: string;
}

export const HelpScreen: React.FC = () => {
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'Como faço um check-in?',
      answer:
        'Para fazer um check-in, vá até a aba "Check-in" no menu inferior e preencha as informações sobre seu humor, nível de estresse e qualidade do sono. Você também pode adicionar notas e tags opcionais.',
    },
    {
      question: 'Posso editar ou excluir um check-in?',
      answer:
        'Sim! No histórico de check-ins, você pode deslizar um card para a esquerda para revelar as opções de editar ou excluir. Você também pode acessar o histórico pela tela inicial ou pela tela de relatórios.',
    },
    {
      question: 'Como vejo meus relatórios?',
      answer:
        'Acesse a aba "Relatórios" no menu inferior. Você pode visualizar relatórios semanais e mensais com análises detalhadas do seu bem-estar.',
    },
    {
      question: 'O que são as dicas recomendadas?',
      answer:
        'As dicas recomendadas são sugestões personalizadas de autocuidado baseadas no seu histórico de check-ins e estado atual. Elas aparecem na aba "Dicas" com um indicador especial.',
    },
    {
      question: 'Como funciona a sequência (streak)?',
      answer:
        'A sequência conta quantos dias consecutivos você fez check-in. Quanto maior a sequência, mais você está cuidando do seu bem-estar!',
    },
    {
      question: 'Meus dados estão seguros?',
      answer:
        'Sim! Todos os seus dados são armazenados de forma segura e criptografada. Você pode exportar seus dados a qualquer momento nas configurações.',
    },
    {
      question: 'Como altero minhas notificações?',
      answer:
        'Acesse "Perfil" > "Notificações" para gerenciar quais tipos de notificações você deseja receber.',
    },
    {
      question: 'O aplicativo funciona offline?',
      answer:
        'O aplicativo requer conexão com a internet para sincronizar seus dados com o servidor. Algumas funcionalidades podem estar limitadas sem conexão.',
    },
  ];

  const contactInfo = [
    {
      icon: 'mail-outline' as const,
      label: 'Email',
      value: 'suporte@carework.com',
      action: () => {},
    },
    {
      icon: 'help-circle-outline' as const,
      label: 'Central de Ajuda',
      value: 'Acesse nosso site',
      action: () => {},
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="help-circle" size={48} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Ajuda</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Encontre respostas para suas dúvidas
          </Text>
        </View>

        <Card style={styles.faqCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Perguntas Frequentes
          </Text>
          {faqItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleExpanded(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqQuestion}>
                  <Text style={[styles.faqQuestionText, { color: theme.colors.text }]}>
                    {item.question}
                  </Text>
                  <Ionicons
                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.textLight}
                  />
                </View>
                {expandedIndex === index && (
                  <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                    {item.answer}
                  </Text>
                )}
              </TouchableOpacity>
              {index < faqItems.length - 1 && (
                <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
              )}
            </View>
          ))}
        </Card>

        <Card style={styles.contactCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contato</Text>
          {contactInfo.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
                <View style={styles.contactText}>
                  <Text style={[styles.contactLabel, { color: theme.colors.textSecondary }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>
                    {item.value}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
              </TouchableOpacity>
              {index < contactInfo.length - 1 && (
                <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
              )}
            </View>
          ))}
        </Card>
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
  faqCard: {
    marginBottom: 16,
  },
  contactCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  faqItem: {
    paddingVertical: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    paddingRight: 32,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactText: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
});

