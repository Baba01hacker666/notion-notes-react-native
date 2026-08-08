/**
 * Test runner: bundles tests/unit/*.test.ts with esbuild (mocking react-native)
 * and runs them with the Node built-in test runner (node:test).
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const unitDir = path.join(root, 'tests', 'unit');
const outDir = path.join(root, 'dist-tests');
const mockRn = path.join(root, 'tests', 'mocks', 'react-native.js');

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const entryPoints = fs
    .readdirSync(unitDir)
    .filter(f => f.endsWith('.test.ts'))
    .map(f => path.join('tests', 'unit', f));

  if (entryPoints.length === 0) {
    console.error('No test files found in tests/unit/');
    process.exit(1);
  }

  await esbuild.build({
    entryPoints,
    outdir: 'dist-tests',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    logLevel: 'warning',
    plugins: [
      {
        name: 'react-native-stub',
        setup(build) {
          build.onResolve({ filter: /^react-native$/ }, () => ({ path: mockRn }));
        },
      },
    ],
  });

  // Pass explicit file paths (node <21 does not expand globs in --test args).
  const files = fs
    .readdirSync(outDir)
    .filter(f => f.endsWith('.test.js'))
    .map(f => path.join('dist-tests', f));
  execSync(`node --test ${files.map(f => JSON.stringify(f)).join(' ')}`, {
    stdio: 'inherit',
    cwd: root,
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
