var nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
    entry: {
        "main": "./src/main.ts",//electron default entry index.js if no package.json
        "Server": "./src/Server.ts"
    },
    target: "electron",
    externals: [nodeExternals()],
    output: {
        path: './app',
        filename: "[name].js"
    },
    resolve: {
        extensions: ["", ".ts", ".tsx", ".js"]
    },
    devtool: 'source-map',
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ],
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.tsx?$/, exclude: [/node_modules/, /YuanQiTV2-win32-x64/], loader: 'ts-loader'},
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                context: 'src/',
                from: 'view/**/*.ejs'
            },
            {context: '.', from: 'static/**/*'},
            // {context: '.', from: 'db/**/*'},
            {from: 'src/reload.html'}
        ])
    ]
};