function check(config = {}) {
  const files = config.files || ['README.md', 'package.json'];
  const missing = [];
  for (const f of files) {
    if (!require('fs').existsSync(f)) missing.push(f);
  }
  return {
    name: 'file.exists',
    passed: missing.length === 0,
    missing,
    evidence: { checked: files, timestamp: new Date().toISOString() }
  };
}

module.exports = { check };
