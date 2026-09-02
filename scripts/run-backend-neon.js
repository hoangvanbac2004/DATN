/**
 * TaskFlow Backend Neon Runner Script
 * Parses .env file from root and executes Spring Boot backend.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

// Parse environment variables if .env exists
const env = { ...process.env };
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const val = valueParts.join('=').replace(/^["']|["']$/g, '');
      env[key.trim()] = val.trim();
    }
  });
  console.log('✅ Loaded environment variables from .env');
} else {
  console.log('⚠️  No .env file found at root, using default process environment.');
}

console.log('🐘 Booting TaskFlow Spring Boot Backend with Neon PostgreSQL settings...\n');

const backend = spawn('mvn', ['spring-boot:run'], {
  cwd: path.join(rootDir, 'code', 'backend'),
  env: env,
  shell: true,
  stdio: 'inherit',
});

backend.on('error', (err) => {
  console.error('Failed to start Spring Boot backend:', err);
});
