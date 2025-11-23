#!/usr/bin/env node

/**
 * Script para capturar o hash do commit atual do Git
 * Usado durante o build para injetar na aplicação
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Tentar obter o hash do commit atual
  const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  
  // Criar arquivo .env com o commit hash
  const envContent = `EXPO_PUBLIC_COMMIT_HASH=${commitHash}\n`;
  const envPath = path.join(__dirname, '..', '.env');
  
  fs.writeFileSync(envPath, envContent);
  
  console.log(`✅ Commit hash capturado: ${commitHash}`);
  console.log(`✅ Arquivo .env criado em: ${envPath}`);
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro ao capturar commit hash:', error.message);
  console.log('⚠️  Usando hash padrão: dev-mode');
  
  // Criar arquivo .env com valor padrão
  const envContent = `EXPO_PUBLIC_COMMIT_HASH=dev-mode\n`;
  const envPath = path.join(__dirname, '..', '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
  } catch (writeError) {
    console.error('❌ Erro ao escrever arquivo .env:', writeError.message);
  }
  
  process.exit(1);
}

