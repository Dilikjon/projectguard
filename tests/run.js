#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

// Run gates directly using the module exports
const fileExists = require('../src/gates/file.exists.js');
const testPasses = require('../src/gates/test.passes.js');
const lintClean = require('../src/gates/lint.clean.js');

const fixtureDir = path.join(__dirname, 'fixtures', 'demo-project');

console.log('=== ProjectGuard MVP Unit Tests ===\n');

// Test 1: file.exists gate
console.log('Test 1: file.exists gate');
process.chdir(fixtureDir);
const r1 = fileExists.check({ files: ['README.md', 'package.json', 'src/index.js'] });
console.log('  Expected: passed=true');
console.log('  Got:', r1.passed ? 'PASS' : 'FAIL');
if (!r1.passed) console.log('  Missing:', r1.missing);

// Test 2: file.exists with missing file
console.log('\nTest 2: file.exists with missing file');
const r2 = fileExists.check({ files: ['README.md', 'missing.txt'] });
console.log('  Expected: passed=false');
console.log('  Got:', r2.passed ? 'FAIL' : 'PASS');

// Test 3: test.passes gate (success case)
console.log('\nTest 3: test.passes gate (success)');
const r3 = testPasses.check({ command: 'node -e "console.log(1)"' });
console.log('  Expected: passed=true');
console.log('  Got:', r3.passed ? 'PASS' : 'FAIL');
if (!r3.passed) console.log('  Error:', r3.error);

// Test 4: test.passes gate (failure case)
console.log('\nTest 4: test.passes gate (failure)');
const r4 = testPasses.check({ command: 'node -e "process.exit(1)"' });
console.log('  Expected: passed=false');
console.log('  Got:', r4.passed ? 'FAIL' : 'PASS');

// Test 5: lint.clean gate (success case)
console.log('\nTest 5: lint.clean gate (success)');
const r5 = lintClean.check({ command: 'node -e "console.log(1)"' });
console.log('  Expected: passed=true');
console.log('  Got:', r5.passed ? 'PASS' : 'FAIL');
if (!r5.passed) console.log('  Error:', r5.error);

// Test 6: lint.clean gate (failure case)
console.log('\nTest 6: lint.clean gate (failure)');
const r6 = lintClean.check({ command: 'node -e "process.exit(1)"' });
console.log('  Expected: passed=false');
console.log('  Got:', r6.passed ? 'FAIL' : 'PASS');

console.log('\n=== All unit tests completed ===');