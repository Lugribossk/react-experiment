module.exports = function (grunt) {
    "use strict";
    var webpack = require("webpack");
    var HtmlWebpackPlugin = require("html-webpack-plugin");

    grunt.initConfig({});

    grunt.loadNpmTasks("grunt-webpack");
    grunt.config.set("webpack", {
        dev: {
            context: "src",
            entry: "./main.js",
            output: {
                path: "target",
                filename: "main.js"
            },
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "6to5?sourceMap=true"},
                    { test: /\.css$/, loader: "style!css"},
                    { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: "src/index.html"
                })
            ],
            devtool: "eval-source-map",
            watch: true,
            keepalive: true
        },

        build: {
            context: "src",
            entry: "./main.js",
            output: {
                path: "target/dist",
                filename: "main-[hash].min.js"
            },
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "6to"},
                    { test: /\.css$/, loader: "style!css"},
                    { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: "src/index.html"
                }),
                new webpack.optimize.UglifyJsPlugin({
                    minimize: true,
                    comments: /a^/g, // Remove all comments
                    compress: {
                        warnings: false
                    }
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('production')
                    }
                })
            ]
        }
    });

    grunt.loadNpmTasks("grunt-jest");
    grunt.config.set("jest", {
        options: {}
    });

    //grunt.loadNpmTasks('grunt-eslint');
    //grunt.config.set("eslint", {
    //    options: {
    //        configFile: '.eslintrc'
    //    },
    //    all: {
    //        src: ["src/**/*.js", "test/**/*.js"]
    //    }
    //});
};