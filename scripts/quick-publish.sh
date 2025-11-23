#!/bin/bash

# Script simplificado para publicação rápida
# Uso: ./scripts/quick-publish.sh

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Publicação Rápida - CareWork${NC}\n"

# Verificar se está em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Erro: Não é um repositório Git${NC}"
    exit 1
fi

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Atenção: Há mudanças não commitadas${NC}"
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Capturar commit hash
echo -e "${GREEN}📝 Capturando commit hash...${NC}"
COMMIT_HASH=$(git rev-parse --short HEAD)
echo -e "${GREEN}✅ Commit: ${COMMIT_HASH}${NC}\n"

# Criar .env
echo -e "${GREEN}📝 Criando arquivo .env...${NC}"
echo "EXPO_PUBLIC_COMMIT_HASH=${COMMIT_HASH}" > .env
echo -e "${GREEN}✅ Arquivo .env criado${NC}\n"

# Verificar se está logado no EAS
echo -e "${BLUE}🔐 Verificando autenticação...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no EAS${NC}"
    echo -e "${YELLOW}Execute: eas login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Autenticado no EAS${NC}\n"

# Perguntar plataforma
echo -e "${BLUE}📱 Selecione a plataforma:${NC}"
echo "1) Android"
echo "2) iOS"
echo "3) Ambos"
read -p "Opção (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        PLATFORM="android"
        ;;
    2)
        PLATFORM="ios"
        ;;
    3)
        PLATFORM="all"
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

# Fazer build
echo -e "\n${BLUE}🔨 Iniciando build para ${PLATFORM}...${NC}"
echo -e "${YELLOW}⏳ Isso pode levar alguns minutos...${NC}\n"

if eas build --platform $PLATFORM --profile production; then
    echo -e "\n${GREEN}✅ Build concluído com sucesso!${NC}\n"
    echo -e "${BLUE}📋 Próximos passos:${NC}"
    echo "1. Acesse: https://expo.dev/accounts/[seu-usuario]/projects/CareWork/builds"
    echo "2. Baixe o APK/AAB do build mais recente"
    echo "3. Acesse: https://console.firebase.google.com/"
    echo "4. Vá em App Distribution > Distribuir release"
    echo "5. Faça upload do arquivo baixado"
    echo "6. Adicione o e-mail do professor como tester"
    echo -e "\n${GREEN}🎉 Pronto!${NC}"
else
    echo -e "\n${RED}❌ Erro no build${NC}"
    echo -e "${YELLOW}Verifique os logs acima para mais detalhes${NC}"
    exit 1
fi

