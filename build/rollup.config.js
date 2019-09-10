import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
import { terser } from 'rollup-plugin-terser';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default {
    input: 'src/components/FuzzySearch/wrapper.js', // Path relative to package.json
    output: {
        name: 'FuzzySearch',
        exports: 'named',
    },
    plugins: [
        commonjs(),
        vue({}),
        buble(), // Transpile to ES5
        terser(), // minify
        webWorkerLoader(),
    ],
};
