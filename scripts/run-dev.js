/**
 * TaskFlow Development Orchestration Script
 * Launches both Next.js frontend and Spring Boot backend concurrently.
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting TaskFlow Development Services...\n');

// 1. Launch Spring Boot Backend
const backend = spawn('mvn', ['spring-boot:run'], {
  cwd: path.join(rootDir, 'code', 'backend'),
  shell: true,
  stdio: 'inherit',
});

// 2. Launch Next.js Frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'code', 'frontend'),
  shell: true,
  stdio: 'inherit',
});

const handleTermination = (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down TaskFlow services...`);
  backend.kill(signal);
  frontend.kill(signal);
  process.exit(0);
};

process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);
