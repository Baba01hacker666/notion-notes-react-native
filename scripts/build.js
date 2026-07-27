const esbuild = require('esbuild-wasm');
const path = require('path');

async function build() {
  await esbuild.initialize({});
  
  const result = await esbuild.build({
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
          // Resolve missing vendor files or internal css-in-js-utils
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

  console.log('Build completed successfully!');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
