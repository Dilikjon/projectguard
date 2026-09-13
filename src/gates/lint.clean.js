#!/usr/bin/env node

const { execSync } = require('child_process');

function check(config = {}) {
  const cmd = config.command || 'npm run lint';
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 30000 });
    return { name: 'lint.clean', passed: true, command: cmd };
  } catch (e) {
    return { name: 'lint.clean', passed: false, command: cmd, error: e.message };
  }
}

module.exports = { check };
