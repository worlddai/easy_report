import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: './src/index.js',
    output: [
        { file: './dist/EasyReport.js', format: 'iife', name: "ER" },
    ],
    plugins: [
        resolve({
            browser: true,
        }),
        json(),
        commonjs(),
        // babel({
        //     exclude: 'node_modules/**',
        // }),
        production && terser()
    ]
};
