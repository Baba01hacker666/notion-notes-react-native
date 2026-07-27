const esbuild = require('esbuild-wasm');
const fs = require('fs');
const path = require('path');

async function build() {
  await esbuild.initialize({});
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  await esbuild.build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    loader: {
      '.tsx': 'tsx',
      '.ts': 'ts',
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.svg': 'text',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      'global': 'window',
    },
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      {
        name: 'react-native-web-resolver',
        setup(build) {
          build.onResolve({ filter: /Animated$/ }, args => {
            if (args.path.includes('vendor/react-native/Animated/Animated')) {
              return { path: require.resolve('react-native-web/dist/exports/Animated') };
            }
          });
          build.onResolve({ filter: /^css-in-js-utils$/ }, args => {
            try {
              return { path: require.resolve('css-in-js-utils') };
            } catch {
              return { path: path.resolve(__dirname, '../node_modules/css-in-js-utils/lib/index.js') };
            }
          });
        },
      },
    ],
  });

  // Generate dist/index.html with bundle.js reference
  let html = fs.readFileSync('index.html', 'utf8');
  html = html.replace('<script type="module" src="/src/index.tsx"></script>', '<script src="bundle.js"></script>');
  fs.writeFileSync('dist/index.html', html);

  console.log('Build completed successfully! dist/index.html and dist/bundle.js generated.');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
