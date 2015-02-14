module.exports = function (grunt) {
    "use strict";
    var webpack = require("webpack");
    var HtmlWebpackPlugin = require("html-webpack-plugin");
    var ExtractTextPlugin = require("extract-text-webpack-plugin");

    grunt.initConfig({});

    grunt.loadNpmTasks("grunt-webpack");
    grunt.config.set("webpack", {
        build: {
            context: "src",
            entry: {
                main: "./main.js",
                vendor: ["bluebird", "lodash", "md5", "react", "react-bootstrap", "superagent"]
            },
            output: {
                path: "target/dist",
                filename: "main-[chunkhash].min.js"
            },
            module: {
                loaders: [
                    { test: /\.js$/, exclude: /node_modules/, loader: "6to5"},
                    { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
                    { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
                ]
            },
            plugins: [
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.CommonsChunkPlugin("vendor", "vendor-[chunkhash].min.js"),
                new HtmlWebpackPlugin({
                    template: "src/index-build.html"
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('production')
                    }
                }),
                new ExtractTextPlugin("main-[chunkhash].css"),
                new webpack.optimize.UglifyJsPlugin({
                    minimize: true,
                    comments: /a^/g, // Remove all comments
                    compress: {
                        warnings: false
                    }
                })
            ],
            node: {
                __filename: true
            }
        }
    });

    grunt.config.set("webpack-dev-server", {
        options: {
            webpack: {
                context: "src",
                entry: [
                    'webpack-dev-server/client?http://localhost:8080',
                    'webpack/hot/only-dev-server',
                    "./main.js"
                ],
                output: {
                    path: "target",
                    filename: "main.js"
                },
                module: {
                    loaders: [
                        { test: /\.js$/, exclude: /node_modules/, loaders: ["react-hot", "6to5?sourceMap=true"]},
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
                    new webpack.HotModuleReplacementPlugin(),
                    new webpack.NoErrorsPlugin()
                ],
                node: {
                    __filename: true
                },
                watch: true,
                keepalive: true
            },
            publicPath: "/",
            hot: true
        },
        start: {
            keepAlive: true,
            webpack: {
                devtool: "eval",
                debug: true
            }
        }
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

    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.config.set("mochaTest", {
        options: {
            require: [
                "6to5-core/register",
                "./test/testSetup"
            ]
        },
        test: {
            src: ["test/**/*Test.js"]
        }
    });

    grunt.registerTask("dev", ["webpack-dev-server:start"]);
    grunt.registerTask("test", ["grunt-mocha-test:test"]);
    grunt.registerTask("build", ["webpack:build"]);
};