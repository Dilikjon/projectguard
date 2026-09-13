#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// ── helpers ──────────────────────────────────────────────────────────

const ROOT = process.cwd();

function loadConfig(projectDir) {
  const yamlPath = path.join(projectDir || ROOT, '.projectguard.yaml');
  if (!fs.existsSync(yamlPath)) return null;
  // Tiny YAML reader — only handles the flat structure we generate.
  const text = fs.readFileSync(yamlPath, 'utf8');
  const cfg = { name: '', gates: [] };
  let currentGate = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    if (/^\s{2,}-\s+name:\s/.test(line)) {
      if (currentGate) cfg.gates.push(currentGate);
      currentGate = { name: line.replace(/.*name:\s*/, '').trim(), enabled: true, files: [], command: '' };
    } else if (currentGate && /^\s{4,}enabled:\s/.test(line)) {
      currentGate.enabled = /\btrue\b/.test(line);
    } else if (currentGate && /^\s{4,}command:\s/.test(line)) {
      currentGate.command = line.replace(/.*command:\s*/, '').trim().replace(/^["']|["']$/g, '');
    } else if (currentGate && /^\s{4,}-\s+/.test(line)) {
      const val = line.replace(/^\s*-\s*/, '').trim().replace(/^["']|["']$/g, '');
      if (currentGate.name === 'file.exists') currentGate.files.push(val);
    }
  }
  if (currentGate) cfg.gates.push(currentGate);
  return cfg;
}

// ── gates ────────────────────────────────────────────────────────────

function gateFileExists(cfg) {
  const missing = (cfg.files || []).filter(f => !fs.existsSync(path.join(ROOT, f)));
  return { name: 'file.exists', passed: missing.length === 0, missing, evidence: { files: cfg.files, timestamp: new Date().toISOString() } };
}

function gateTestPasses(cfg) {
  if (!cfg.command) return { name: 'test.passes', passed: false, error: 'no command configured' };
  try {
    execSync(cfg.command, { cwd: ROOT, stdio: 'pipe', timeout: 30000 });
    return { name: 'test.passes', passed: true, command: cfg.command };
  } catch (e) {
    return { name: 'test.passes', passed: false, command: cfg.command, error: e.message };
  }
}

// ── CLI ──────────────────────────────────────────────────────────────

function runAll() {
  const cfg = loadConfig();
  if (!cfg) { console.log('No .projectguard.yaml found in project root.'); process.exit(1); }
  const results = [];
  for (const g of cfg.gates) {
    if (!g.enabled) continue;
    switch (g.name) {
      case 'file.exists': results.push(gateFileExists(g)); break;
      case 'test.passes': results.push(gateTestPasses(g)); break;
      default: results.push({ name: g.name, passed: false, error: 'unknown gate' });
    }
  }
  console.log('=== ProjectGuard verification ===');
  let ok = true;
  for (const r of results) {
    const status = r.passed ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${r.name}`);
    if (!r.passed) { ok = false; console.log('  error:', r.error || 'missing:', r.missing); }
  }
  console.log(ok ? 'All gates passed.' : 'Some gates failed.');
  process.exit(ok ? 0 : 1);
}

// ── exports for programmatic use ─────────────────────────────────────

module.exports = { loadConfig, gateFileExists, gateTestPasses, runAll };
