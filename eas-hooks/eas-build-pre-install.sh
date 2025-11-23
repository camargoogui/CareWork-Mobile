#!/bin/bash

# Hook do EAS Build para capturar commit hash antes do build
# Este script é executado automaticamente pelo EAS Build

set -e

# Tentar obter o hash do commit atual
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo "✅ Commit hash capturado: ${COMMIT_HASH}"
else
    COMMIT_HASH="dev-mode"
    echo "⚠️  Git não disponível. Usando: ${COMMIT_HASH}"
fi

# Exportar variável de ambiente para o build
export EXPO_PUBLIC_COMMIT_HASH=$COMMIT_HASH

# Criar arquivo .env para o Expo ler
echo "EXPO_PUBLIC_COMMIT_HASH=${COMMIT_HASH}" > .env

echo "✅ Variável EXPO_PUBLIC_COMMIT_HASH=${COMMIT_HASH} configurada"

