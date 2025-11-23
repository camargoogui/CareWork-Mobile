#!/bin/bash

# Script para publicar o app no Firebase App Distribution
# Uso: ./scripts/publish-to-firebase.sh [android|ios]

set -e

PLATFORM=${1:-android}
APP_ID=""
FIREBASE_APP_ID=""
TESTER_EMAILS=""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando publicação no Firebase App Distribution${NC}\n"

# Verificar se Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI não está instalado${NC}"
    echo -e "${YELLOW}📦 Instale com: npm install -g firebase-tools${NC}"
    exit 1
fi

# Verificar se está logado no Firebase
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no Firebase primeiro${NC}"
    echo -e "${YELLOW}Execute: firebase login${NC}"
    exit 1
fi

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI não está instalado${NC}"
    echo -e "${YELLOW}📦 Instale com: npm install -g eas-cli${NC}"
    exit 1
fi

# Verificar se está logado no EAS
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no EAS primeiro${NC}"
    echo -e "${YELLOW}Execute: eas login${NC}"
    exit 1
fi

# Capturar commit hash
echo -e "${GREEN}📝 Capturando commit hash...${NC}"
node scripts/get-commit-hash.js

# Fazer build
echo -e "\n${GREEN}🔨 Fazendo build para ${PLATFORM}...${NC}"
if [ "$PLATFORM" = "android" ]; then
    eas build --platform android --profile production --non-interactive
    BUILD_PATH=$(eas build:list --platform android --limit 1 --json | jq -r '.[0].artifacts.buildUrl // empty')
else
    eas build --platform ios --profile production --non-interactive
    BUILD_PATH=$(eas build:list --platform ios --limit 1 --json | jq -r '.[0].artifacts.buildUrl // empty')
fi

if [ -z "$BUILD_PATH" ]; then
    echo -e "${RED}❌ Erro ao obter caminho do build${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído: ${BUILD_PATH}${NC}"

# Baixar o arquivo APK/AAB
echo -e "\n${GREEN}📥 Baixando arquivo de build...${NC}"
BUILD_FILE="build-${PLATFORM}-$(date +%Y%m%d-%H%M%S).${PLATFORM == 'android' ? 'apk' : 'ipa'}"
curl -L -o "$BUILD_FILE" "$BUILD_PATH"

# Publicar no Firebase App Distribution
echo -e "\n${GREEN}📤 Publicando no Firebase App Distribution...${NC}"
if [ "$PLATFORM" = "android" ]; then
    firebase appdistribution:distribute "$BUILD_FILE" \
        --app "$FIREBASE_APP_ID" \
        --groups "testers" \
        --release-notes "Build de produção - $(git rev-parse --short HEAD)"
else
    firebase appdistribution:distribute "$BUILD_FILE" \
        --app "$FIREBASE_APP_ID" \
        --groups "testers" \
        --release-notes "Build de produção - $(git rev-parse --short HEAD)"
fi

echo -e "\n${GREEN}✅ Publicação concluída!${NC}"
echo -e "${YELLOW}📧 Certifique-se de adicionar o e-mail do professor como tester no Firebase Console${NC}"

