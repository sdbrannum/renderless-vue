import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve'; // resolve to include external dependencies
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
// import bundleWorker from 'rollup-plugin-bundle-worker';

export default {
    input: 'src/entry.js',
    output: [
        {
            name: 'Render',
            exports: 'named',
            file: 'packages/render/index.esm.js',
            format: 'es',
        },
        {
            name: 'Render',
            exports: 'named',
            file: 'packages/render/index.umd.js',
            format: 'umd',
        },
        {
            name: 'Render',
            exports: 'named',
            format: 'iife',
            file: 'packages/render/index.min.js',
        },
    ],
    plugins: [
        commonjs(),
        vue(),
        buble(),
        terser(),
        webWorkerLoader(),
        resolve({
            only: ['date-fns'],
        }),
    ],
};
