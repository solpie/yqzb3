var nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
module.exports = {
    // This is the "main" file which should include all other modules
    entry: {
        // "server": "./app/server/server.js"
        "main": "./src/main.ts",//electron default entry index.js if no package.json
        "Server": "./src/Server.ts",//electron default entry index.js if no package.json
    },
    target: "electron",
    externals: [nodeExternals()],
    output: {
        // To the `dist` folder
        path: './app',
        // With the filename `build.js` so it's dist/build.js
        filename: "[name].js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
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
            }
        ])
    ]
};