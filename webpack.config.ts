import * as path from 'path';
import * as webpack from 'webpack';
import { IgnorePlugin } from 'webpack';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: webpack.Configuration = {
    entry: './src/index.ts',
    target: "node",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: "./tsconfig.json"
            }),
        ]
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /^pg-native$/,
        })
    ],
    ignoreWarnings: [/critical dependency:/i]
};

export default config;