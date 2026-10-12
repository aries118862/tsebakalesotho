const { spawn } = require('node:child_process');
const path = require('node:path');

const children = [];
let shuttingDown = false;

function stopChildren(signal = 'SIGTERM') {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => {
    if (child && child.exitCode === null && !child.killed) child.kill(signal);
  });
}

function startChild(label, scriptPath) {
  const child = spawn(process.execPath, [scriptPath], { stdio: 'inherit' });
  children.push(child);
  child.on('error', (error) => {
    console.error(`Could not start ${label}:`, error.message);
    stopChildren();
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    if (code !== 0) {
      console.error(`${label} exited with ${signal || `code ${code}`}.`);
      process.exitCode = code || 1;
    }
    stopChildren();
  });
  return child;
}

startChild('Weather proxy', path.join(__dirname, 'server.js'));
startChild('React development server', path.join(__dirname, 'node_modules', 'react-scripts', 'scripts', 'start.js'));

process.on('SIGINT', () => stopChildren('SIGINT'));
process.on('SIGTERM', () => stopChildren('SIGTERM'));
