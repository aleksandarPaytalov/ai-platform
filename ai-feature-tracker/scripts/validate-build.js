#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build configuration...');

// Check TypeScript configuration
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (!fs.existsSync(tsConfigPath)) {
  console.error('❌ tsconfig.json not found');
  process.exit(1);
}

// Check Next.js configuration
const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
if (!fs.existsSync(nextConfigPath)) {
  console.error('❌ next.config.ts not found');
  process.exit(1);
}

// Check required directories
const requiredDirs = ['src/app', 'src/components', 'src/lib', 'src/types'];

for (const dir of requiredDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Required directory not found: ${dir}`);
    process.exit(1);
  }
}

// Check package.json scripts
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredScripts = ['dev', 'build', 'start', 'type-check', 'lint'];
for (const script of requiredScripts) {
  if (!packageJson.scripts[script]) {
    console.error(`❌ Required script not found: ${script}`);
    process.exit(1);
  }
}

console.log('✅ Build configuration validation passed');
