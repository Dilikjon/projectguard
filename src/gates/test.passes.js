#!/usr/bin/env node

const { execSync } = require('child_process');

function check(config = {}) {
  const cmd = config.command || 'npm test';
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 30000 });
    return { name: 'test.passes', passed: true, command: cmd };
  } catch (e) {
    return { name: 'test.passes', passed: false, command: cmd, error: e.message };
  }
}

module.exports = { check };
