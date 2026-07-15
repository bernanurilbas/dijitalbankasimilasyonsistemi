import { spawn } from 'child_process';

console.log('Starting Astra Bank Mock Server & Vite Dev Server...');

// Start the json-server
const server = spawn('node', ['server.js'], { stdio: 'inherit', shell: true });

// Start Vite
const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

const cleanExit = () => {
  server.kill();
  vite.kill();
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
