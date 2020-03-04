import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import VuePlugin from 'rollup-plugin-vue';
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'svga',
      },
    ],
    plugins: [
      VuePlugin (),
      resolve ({
        modulesOnly: true,
        extensions: ['.js', '.vue']
      }),
      commonjs ({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/svga.lite/svga.lite.min.js': [
            'Downloader',
            'Parser',
            'Player',
          ],
        },
      }),
      babel ({
        exclude: 'node_modules/**',
      }),
      terser ({
        exclude: 'node_modules/**',
      }),
    ],
  },
];
