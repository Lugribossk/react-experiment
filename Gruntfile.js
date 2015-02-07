module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({});

    var webpack = require("webpack");
    grunt.loadNpmTasks('grunt-webpack');
    grunt.config.set("webpack", {
        dev: {
            context: "src",
            entry: "./main.js",
            output: {
                filename: "target/main.js"
            },
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "6to5-loader?sourceMap=true"}
                ]
            },
            devtool: "source-map",
            watch: true,
            keepalive: true
        },
        build: {
            context: "src",
            entry: "./main.js",
            output: {
                filename: "target/dist/main.min.js"
            },
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "6to5-loader"}
                ]
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    minimize: true,
                    comments: /a^/g, // Remove all comments
                    compress: {
                        warnings: false
                    },
                    "screw-ie8": true
                })
            ]
        }
    });

    grunt.loadNpmTasks('grunt-jest');
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