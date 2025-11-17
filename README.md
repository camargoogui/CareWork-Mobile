# 📱 CareWork - Apoio Emocional no Trabalho

Aplicativo mobile desenvolvido em React Native para ajudar profissionais a monitorar e melhorar seu bem-estar no ambiente de trabalho através de check-ins diários, análises e dicas personalizadas.

---

## 🎯 Sobre o Projeto

O **CareWork** é uma solução completa de bem-estar corporativo que permite:

- ✅ **Check-ins diários** de humor, estresse e qualidade do sono
- ✅ **Análises e relatórios** semanais e mensais
- ✅ **Dicas personalizadas** de autocuidado
- ✅ **Acompanhamento de tendências** e sequências (streaks)
- ✅ **Gerenciamento de perfil** e configurações

---

## 🚀 Tecnologias Utilizadas

- **React Native** com **Expo**
- **TypeScript** para type safety
- **React Navigation** para navegação
- **AsyncStorage** para persistência local
- **React Native Gesture Handler** para gestos
- **React Native Paper** para componentes UI
- **Context API** para gerenciamento de estado

---

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou Xcode (para iOS)
- API .NET rodando (veja seção de configuração)

---

## 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd CareWork
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a API:**
   - Edite `src/config/api.ts` com a URL da sua API .NET
   - Veja a seção "Configuração da API" abaixo

4. **Execute o app:**
   ```bash
   npm start
   ```

---

## ⚙️ Configuração da API

### Base URL

Edite `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:8080'  // Desenvolvimento
    : 'https://sua-api-producao.com', // Produção
  TIMEOUT: 30000,
};
```

### Configuração por Plataforma

O app detecta automaticamente a plataforma e ajusta a URL:

- **Android Emulator:** `http://10.0.2.2:8080`
- **iOS Simulator:** `http://localhost:8080`
- **Dispositivo Físico:** `http://192.168.x.x:8080` (IP da sua máquina)

**Importante:** Use a mesma porta onde a API .NET está rodando!

---

## 📱 Estrutura do Projeto

```
CareWork/
├── src/
│   ├── assets/          # Imagens e ícones
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── config/          # Configurações
│   │   └── api.ts       # Configuração da API
│   ├── contexts/        # Context API
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom hooks
│   │   └── useTheme.ts
│   ├── navigation/      # Navegação
│   │   ├── AppNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   └── MainTabs.tsx
│   ├── screens/         # Telas do app
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CheckinScreen.tsx
│   │   ├── CheckinHistoryScreen.tsx
│   │   ├── EditCheckinModal.tsx
│   │   ├── TipsScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── ChangePasswordScreen.tsx
│   │   ├── DeleteAccountScreen.tsx
│   │   ├── HelpScreen.tsx
│   │   └── AboutScreen.tsx
│   ├── services/        # Serviços de API
│   │   ├── apiService.ts
│   │   ├── checkinService.ts
│   │   ├── tipService.ts
│   │   ├── reportService.ts
│   │   ├── insightsService.ts
│   │   ├── goalsService.ts
│   │   ├── achievementsService.ts
│   │   └── remindersService.ts
│   ├── theme/           # Tema e estilos
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   └── spacing.ts
│   ├── types/           # Tipos TypeScript
│   │   └── api.ts
│   └── utils/           # Utilitários
│       ├── formatDate.ts
│       ├── clearOldData.ts
│       └── errorHandler.ts
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🔐 Autenticação

O app utiliza **JWT (JSON Web Tokens)** para autenticação:

- ✅ Login e registro funcionando
- ✅ Token salvo automaticamente no AsyncStorage
- ✅ Persistência de sessão (usuário permanece logado)
- ✅ Token enviado em todas as requisições protegidas
- ✅ Logout funcional

### Endpoints de Autenticação

- `POST /api/v1/auth/register` - Criar conta
- `POST /api/v1/auth/login` - Fazer login
- `PUT /api/v1/auth/profile` - Atualizar perfil
- `PUT /api/v1/auth/password` - Alterar senha
- `DELETE /api/v1/auth/account` - Deletar conta

---

## 📊 Funcionalidades

### ✅ Check-ins

- Criar check-in diário (humor, estresse, sono)
- Adicionar notas e tags opcionais
- Visualizar histórico completo
- Editar check-ins existentes
- Deletar check-ins (swipe to delete)
- Buscar check-ins por data ou texto

### ✅ Dicas de Autocuidado

- Listar todas as dicas disponíveis
- Visualizar dicas recomendadas (baseadas no histórico)
- Filtrar por categoria
- Criar, editar e deletar dicas (admin)

### ✅ Relatórios

- Relatório semanal com médias
- Relatório mensal com análises detalhadas
- Comparação entre períodos
- Visualização de tendências

### ✅ Insights

- Análise de tendências (melhorando, estável, piorando)
- Sequências (streaks) de check-ins
- Comparação entre períodos
- Recomendações personalizadas

### ✅ Perfil

- Visualizar estatísticas (total de check-ins, dias, média)
- Editar perfil (nome e email)
- Alterar senha
- Deletar conta
- Ajuda e informações sobre o app

---

## 🎨 Design System

O app segue o **Apple Human Interface Guidelines** com:

- **Cores:** Paleta suave de azuis e roxos
- **Tipografia:** Sistema de fontes consistente
- **Espaçamento:** Valores padronizados
- **Componentes:** Reutilizáveis e acessíveis

### Tema

- Cores primárias e secundárias
- Modo claro (dark mode pode ser adicionado)
- Componentes com suporte a tema

---

## 🛠️ Tratamento de Erros

O app possui um sistema robusto de tratamento de erros:

### ✅ Utilitário de Erros (`utils/errorHandler.ts`)

- Traduz mensagens da API para português
- Mensagens específicas por tipo de erro
- Detecção de erros de rede
- Detecção de necessidade de re-autenticação

### ✅ Padrões de Feedback

- **Formulários:** Erro inline embaixo dos campos
- **Ações críticas:** Alert com confirmação
- **Feedback geral:** Alert para sucesso/erro
- **Mensagens claras:** Sempre em português

### ✅ Códigos de Status Tratados

- `0` - Erro de conexão/rede
- `400` - Dados inválidos
- `401` - Não autorizado (sessão expirada)
- `403` - Proibido
- `404` - Não encontrado
- `422` - Erro de validação
- `500` - Erro interno do servidor
- `503` - Serviço indisponível

---

## 📡 Integração com API .NET

### Endpoints Utilizados

#### Autenticação
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `PUT /api/v1/auth/profile`
- `PUT /api/v1/auth/password`
- `DELETE /api/v1/auth/account`

#### Check-ins
- `GET /api/v1/checkins?page={page}&pageSize={size}`
- `GET /api/v1/checkins/{id}`
- `POST /api/v1/checkins`
- `PUT /api/v1/checkins/{id}`
- `DELETE /api/v1/checkins/{id}`
- `GET /api/v1/checkins/search?query={query}&dateFrom={date}&dateTo={date}`
- `POST /api/v1/checkins/quick`

#### Dicas
- `GET /api/v1/tips?page={page}&pageSize={size}`
- `GET /api/v1/tips/{id}`
- `GET /api/v1/tips/recommended`
- `POST /api/v1/tips`
- `PUT /api/v1/tips/{id}`
- `DELETE /api/v1/tips/{id}`

#### Relatórios
- `GET /api/v1/reports/weekly?weekStart={date}&userId={id}`
- `GET /api/v1/reports/monthly?month={month}&userId={id}`

#### Insights
- `GET /api/v1/insights/trends?period={period}`
- `GET /api/v1/insights/recommendations`
- `GET /api/v1/insights/compare?period1={period}&period2={period}`
- `GET /api/v1/insights/streak`

#### Health Check
- `GET /health`

---

## 🧪 Como Testar

1. **Inicie a API .NET** na porta configurada (padrão: 8080)

2. **Configure a BASE_URL** em `src/config/api.ts`

3. **Execute o app:**
   ```bash
   npm start
   ```

4. **Teste o fluxo completo:**
   - ✅ Criar conta
   - ✅ Fazer login
   - ✅ Criar check-in
   - ✅ Visualizar histórico
   - ✅ Editar check-in
   - ✅ Ver dicas recomendadas
   - ✅ Visualizar relatórios
   - ✅ Editar perfil
   - ✅ Alterar senha

---

## 🎯 Funcionalidades por Tela

### **LoginScreen**
- Login com email/senha
- Validação de campos
- Mensagens de erro traduzidas
- Loading state
- Navegação para signup

### **SignupScreen**
- Registro com nome/email/senha
- Validação de senha (mínimo 6 caracteres)
- Confirmação de senha
- Mensagens de erro traduzidas

### **HomeScreen**
- Hero section com gradiente
- Avatar do usuário
- Saudação dinâmica (Bom dia/tarde/noite)
- Resumo do dia (se houver check-in)
- Card de sequência (streak)
- Card de tendência
- Botão rápido para check-in
- Link para histórico

### **CheckinScreen**
- Escalas de 1-5 para humor, estresse e sono
- Campo de notas (opcional)
- Campo de tags (opcional, separadas por vírgula)
- Validação de campos obrigatórios
- Feedback de sucesso/erro
- Limpa formulário após sucesso

### **CheckinHistoryScreen**
- Lista todos os check-ins
- Swipe to delete (deslizar para deletar)
- Swipe to edit (deslizar para editar)
- Modal de edição
- Pull to refresh
- Formatação de data e hora
- Exibe notas e tags

### **TipsScreen**
- Lista dicas da API
- Toggle entre dicas recomendadas e todas
- Loading state
- Exibe ícones e cores personalizadas
- Pull to refresh

### **ReportScreen**
- Seletor de período (Semanal/Mensal)
- Relatório semanal com médias
- Relatório mensal com análises
- Comparação com período anterior
- Melhor e pior dia
- Link para histórico

### **ProfileScreen**
- Avatar do usuário
- Estatísticas (check-ins, dias, média)
- Menu de opções:
  - Editar perfil
  - Alterar senha
  - Deletar conta
  - Ajuda
  - Sobre
- Botão de logout

### **EditProfileScreen**
- Formulário para editar nome e email
- Validação de campos
- Atualização via API
- Feedback de sucesso/erro

### **ChangePasswordScreen**
- Formulário para alterar senha
- Validação (mínimo 6 caracteres, senhas coincidem)
- Mostrar/ocultar senha
- Feedback de sucesso/erro

### **DeleteAccountScreen**
- Avisos sobre perda de dados
- Confirmação com senha
- Alert de confirmação
- Logout automático após deletar

### **HelpScreen**
- FAQ com perguntas frequentes
- Expansão/colapso de respostas
- Seção de contato

### **AboutScreen**
- Informações sobre o app
- Versão
- Recursos disponíveis
- Copyright

---

## 🔒 Segurança

- ✅ Tokens JWT armazenados de forma segura
- ✅ Validação de dados no cliente
- ✅ Tratamento seguro de erros (sem expor informações sensíveis)
- ✅ Logout automático em caso de token inválido

---

## 📦 Dependências Principais

```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "react-native-gesture-handler": "~2.16.0",
  "react-native-safe-area-context": "4.10.0",
  "@react-native-async-storage/async-storage": "1.23.0",
  "@expo/vector-icons": "^14.0.0",
  "typescript": "~5.3.0"
}
```

---

## 🐛 Troubleshooting

### Erro de conexão com a API

1. Verifique se a API .NET está rodando
2. Confirme a porta configurada em `src/config/api.ts`
3. Para Android emulator, use `10.0.2.2` em vez de `localhost`
4. Para dispositivo físico, use o IP da sua máquina

### Erro de autenticação

1. Verifique se o token está sendo salvo corretamente
2. Confirme que o endpoint de login está retornando o token
3. Limpe o AsyncStorage e tente novamente

### Erro ao fazer build

1. Limpe o cache: `npm start -- --clear`
2. Reinstale dependências: `rm -rf node_modules && npm install`
3. Verifique se todas as dependências estão atualizadas

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 🎉 Status do Projeto

✅ **100% Funcional e Integrado**

- [x] Autenticação JWT completa
- [x] CRUD de Check-ins
- [x] CRUD de Dicas
- [x] Relatórios semanais e mensais
- [x] Insights e análises
- [x] Gerenciamento de perfil
- [x] Tratamento de erros robusto
- [x] Design system completo
- [x] Navegação funcional
- [x] Persistência de dados

---

**Desenvolvido com ❤️ para melhorar o bem-estar no trabalho**

