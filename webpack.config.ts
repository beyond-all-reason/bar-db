import * as path from 'path';
import * as webpack from 'webpack';
import { IgnorePlugin } from 'webpack';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import tsTransformPaths from "@zerollup/ts-transform-paths"

const config: webpack.Configuration = {
    entry: './src/index.ts',
    target: "node",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        getCustomTransformers: (program: any) => {
                            const transformer = tsTransformPaths(program);
                            return {
                                before: [transformer.before], // for updating paths in generated code
                                afterDeclarations: [transformer.afterDeclarations] // for updating paths in declaration files
                            };
                        }
                    }
                }],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
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