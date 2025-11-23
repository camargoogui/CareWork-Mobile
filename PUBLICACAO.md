# 📱 Guia de Publicação - Firebase App Distribution

Este guia explica passo a passo como publicar o aplicativo CareWork no Firebase App Distribution.

---

## 📋 Pré-requisitos

1. **Conta no Firebase**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um novo projeto ou use um existente

2. **Conta no Expo**
   - Acesse [Expo](https://expo.dev/)
   - Crie uma conta gratuita

3. **Ferramentas instaladas:**
   ```bash
   # Instalar EAS CLI (já instalado)
   npm install -g eas-cli

   # Instalar Firebase CLI
   npm install -g firebase-tools
   ```

---

## 🔧 Configuração Inicial

### 1. Login nas ferramentas

```bash
# Login no Expo
eas login

# Login no Firebase
firebase login
```

### 2. Configurar projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto ou crie um novo
3. Vá em **App Distribution** (no menu lateral)
4. Se ainda não tiver um app Android/iOS, clique em **Adicionar app**
5. Anote o **App ID** do Firebase (você precisará dele depois)

### 3. Configurar projeto no Expo

```bash
# No diretório do projeto
cd /Users/camargoogui/CareWork-Mobile

# Configurar EAS
eas build:configure
```

Isso criará/atualizará o arquivo `eas.json`.

---

## 🏗️ Configuração do Build

O arquivo `eas.json` já está configurado com o perfil de produção. Ele:
- Captura automaticamente o commit hash
- Gera APK para Android
- Inclui o commit hash como variável de ambiente

---

## 📦 Processo de Publicação

### Opção 1: Publicação Manual (Recomendado para primeira vez)

#### Passo 1: Capturar Commit Hash

```bash
npm run get-commit-hash
```

Isso criará um arquivo `.env` com o hash do commit atual.

#### Passo 2: Fazer Build

**Para Android:**
```bash
npm run build:android
```

**Para iOS:**
```bash
npm run build:ios
```

**Para ambas as plataformas:**
```bash
npm run build:all
```

O build será feito na nuvem do Expo. Você receberá um link para acompanhar o progresso.

#### Passo 3: Baixar o APK/AAB

Após o build concluir:

1. Acesse [Expo Dashboard](https://expo.dev/accounts/[seu-usuario]/projects/CareWork/builds)
2. Clique no build concluído
3. Baixe o arquivo APK (Android) ou IPA (iOS)

#### Passo 4: Publicar no Firebase App Distribution

**Método 1: Via Firebase Console (Mais fácil)**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **App Distribution**
3. Clique em **Distribuir release**
4. Faça upload do arquivo APK/AAB baixado
5. Adicione release notes (ex: "Build de produção - v1.0.0")
6. Selecione os testers ou grupos de testers
7. Clique em **Distribuir**

**Método 2: Via Firebase CLI**

```bash
# Primeiro, obtenha o App ID do Firebase Console
# Android App ID: 1:XXXXXXXX:android:XXXXXXXXXXXXX
# iOS App ID: 1:XXXXXXXX:ios:XXXXXXXXXXXXX

# Publicar Android
firebase appdistribution:distribute build-android.apk \
  --app 1:XXXXXXXX:android:XXXXXXXXXXXXX \
  --groups "testers" \
  --release-notes "Build de produção - $(git rev-parse --short HEAD)"

# Publicar iOS
firebase appdistribution:distribute build-ios.ipa \
  --app 1:XXXXXXXX:ios:XXXXXXXXXXXXX \
  --groups "testers" \
  --release-notes "Build de produção - $(git rev-parse --short HEAD)"
```

### Opção 2: Script Automatizado

Edite o arquivo `scripts/publish-to-firebase.sh` e configure:

```bash
# Adicione o App ID do Firebase
FIREBASE_APP_ID="1:XXXXXXXX:android:XXXXXXXXXXXXX"

# Adicione os e-mails dos testers (opcional, pode usar grupos)
TESTER_EMAILS="professor@email.com,outro@email.com"
```

Depois execute:

```bash
# Para Android
./scripts/publish-to-firebase.sh android

# Para iOS
./scripts/publish-to-firebase.sh ios
```

---

## 👥 Adicionar Testers

### Adicionar e-mail do professor

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **App Distribution** > **Testers e grupos**
3. Clique em **Adicionar tester**
4. Digite o e-mail do professor
5. Clique em **Adicionar**

### Criar grupo de testers

1. Em **App Distribution** > **Testers e grupos**
2. Clique em **Criar grupo**
3. Nomeie o grupo (ex: "Professores")
4. Adicione os e-mails dos testers
5. Salve o grupo

Ao distribuir um build, você pode selecionar o grupo inteiro.

---

## ✅ Verificação do Commit Hash

Após publicar e instalar o app:

1. Abra o app no dispositivo
2. Vá em **Perfil** > **Sobre**
3. Verifique se o **Commit Hash** está exibido corretamente
4. O hash deve corresponder ao commit atual do repositório

Para verificar o commit atual:
```bash
git rev-parse --short HEAD
```

---

## 🔍 Troubleshooting

### Erro: "Firebase CLI não está instalado"

```bash
npm install -g firebase-tools
```

### Erro: "EAS CLI não está instalado"

```bash
npm install -g eas-cli
```

### Erro: "Não autenticado no Firebase"

```bash
firebase login
```

### Erro: "Não autenticado no Expo"

```bash
eas login
```

### Erro: "App ID não encontrado"

1. Acesse Firebase Console
2. Vá em **Configurações do projeto** (ícone de engrenagem)
3. Role até **Seus apps**
4. Copie o **App ID** (formato: `1:XXXXXXXX:android:XXXXXXXXXXXXX`)

### Commit Hash não aparece na tela "Sobre"

1. Verifique se o arquivo `.env` foi criado:
   ```bash
   cat .env
   ```

2. Se não existir, execute:
   ```bash
   npm run get-commit-hash
   ```

3. Certifique-se de que o build foi feito após criar o `.env`

### Build falha

1. Verifique se está logado:
   ```bash
   eas whoami
   ```

2. Verifique se o projeto está configurado:
   ```bash
   eas build:configure
   ```

3. Verifique os logs do build no [Expo Dashboard](https://expo.dev/)

---

## 📝 Checklist de Publicação

Antes de publicar, certifique-se de:

- [ ] Fazer commit de todas as alterações
- [ ] Fazer push para o repositório
- [ ] Executar `npm run get-commit-hash`
- [ ] Fazer build com `npm run build:android` ou `npm run build:ios`
- [ ] Baixar o APK/AAB do Expo Dashboard
- [ ] Publicar no Firebase App Distribution
- [ ] Adicionar e-mail do professor como tester
- [ ] Verificar se o commit hash aparece na tela "Sobre"
- [ ] Testar o app instalado do Firebase App Distribution

---

## 🎯 Comandos Rápidos

```bash
# Capturar commit hash
npm run get-commit-hash

# Build Android
npm run build:android

# Build iOS
npm run build:ios

# Build ambas plataformas
npm run build:all

# Ver builds recentes
eas build:list

# Ver status do build
eas build:view [BUILD_ID]

# Login no Expo
eas login

# Login no Firebase
firebase login

# Verificar autenticação
eas whoami
firebase projects:list
```

---

## 📚 Links Úteis

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Expo Dashboard](https://expo.dev/)
- [Firebase Console](https://console.firebase.google.com/)

---

**Boa sorte com a publicação! 🚀**

