const path = require("path")
//const MiniCssExtract = require("mini-css-extract-plugin")

module.exports = {
    mode : "development",
    devtool : "eval-source-map",
    entry : path.resolve(__dirname, "./src/index.js"),
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
                test : /\.scss$/i,
                use : ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test : /\.css$/i,
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
    output : {
        path : path.resolve(__dirname, "./public"),
        filename : "bundle.js"
    },
    devServer : {
        hot : true,
        historyApiFallback : true
    }
}
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