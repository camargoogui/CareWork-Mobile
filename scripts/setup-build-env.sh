#!/bin/bash

# Script para configurar variáveis de ambiente para o build
# Usado antes de executar eas build

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}📝 Configurando variáveis de ambiente para o build...${NC}"

# Tentar obter o hash do commit atual
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo -e "${GREEN}✅ Commit hash capturado: ${COMMIT_HASH}${NC}"
else
    COMMIT_HASH="dev-mode"
    echo -e "${YELLOW}⚠️  Não é um repositório Git ou Git não está disponível. Usando: ${COMMIT_HASH}${NC}"
fi

# Criar arquivo .env
cat > .env << EOF
EXPO_PUBLIC_COMMIT_HASH=${COMMIT_HASH}
EOF

echo -e "${GREEN}✅ Arquivo .env criado com commit hash${NC}"

# Exportar para uso no build
export EXPO_PUBLIC_COMMIT_HASH=$COMMIT_HASH

echo -e "${GREEN}✅ Variável de ambiente exportada: EXPO_PUBLIC_COMMIT_HASH=${COMMIT_HASH}${NC}"

