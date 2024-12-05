const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/index.js', // Entry point for React
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    //target: 'electron-renderer', // Target Electron's renderer process
    module: {
        rules: [
            {
                test : /\.(ts|tsx)$/i,
                exclude : /node_modules/,
                use : ["ts-loader"]
            },
            {
                test : /\.(js|jsx)$/i,
                exclude : /node_modules/,
                use : ["babel-loader"]
            },
            {
                test : /\.s?css$/i,
                use : ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test : /\.(png|svg|jpg|jpeg|gif)$/i,
                exclude : /\.(css.png)$/i,
                use : ["file-loader"]
            },
        ],
    },
    resolve: {
        extensions : [".*", ".js", ".jsx"], // Resolve JS and JSX extensions
    },
    plugins: [
        new ESLintPlugin({
            extensions : ["jx", "jsx"]
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html', // Path to HTML template
        }),
        new Dotenv({
            path: './.env', // Path to the .env file
            safe: true,     // (Optional) Verify that variables defined in .env.example are all set
        }),
    ],
    devtool: "source-map",
    devServer: {
        static: './dist',
    },
    mode: 'development',
};

/*
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const MiniCssExtract = require("mini-css-extract-plugin")

module.exports = {
    mode : "development",
    devtool : "eval-source-map",
    entry : path.resolve(__dirname, "./src/index.js"),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    target: 'electron-renderer',
    module : {
        rules : [
            {
                test : /\.(ts|tsx)$/i,
                exclude : /node_modules/,
                use : ["ts-loader"]
            },
            {
                test : /\.(js|jsx)$/i,
                exclude : /node_modules/,
                use : ["babel-loader"]
            },
            {
                test : /\.s?css$/i,
                use : ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test : /\.(png|svg|jpg|jpeg|gif)$/i,
                exclude : /\.(css.png)$/i,
                use : ["file-loader"]
            },
        ]
    },
    resolve : {
        extensions : ["*", ".js", "jsx"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Path to HTML template
        }),
    ],
    devServer : {
        hot : true,
        historyApiFallback : true
    }
}
*/
/*
const path = require("path")

module.exports = {
    entry : path.resolve(__dirname, "./src/index.js"),
    output : {
        path : path.resolve(__dirname, "./public"),
        filename : "bundle.js"
    },
    devServer : {
        hot : true
    }
}
*/