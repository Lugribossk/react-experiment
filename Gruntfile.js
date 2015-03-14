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
                    { test: /\.js$/, exclude: /node_modules/, loader: "babel"},
                    { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
                    { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
                    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
                    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
                    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" },
                    { test: /\.(png|jpg)$/, loader: "url?limit=10000" }
                ]
            },
            plugins: [
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.CommonsChunkPlugin("vendor", "vendor-[chunkhash].min.js"),
                new HtmlWebpackPlugin({
                    template: "src/index-build.html"
                }),
                new webpack.DefinePlugin({
                    "process.env": {
                        NODE_ENV: JSON.stringify("production")
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
                    "webpack-dev-server/client?http://localhost:8080",
                    "webpack/hot/only-dev-server",
                    "./main.js"
                ],
                output: {
                    path: "target",
                    filename: "main.js"
                },
                module: {
                    loaders: [
                        { test: /\.js$/, exclude: /node_modules/, loaders: ["react-hot", "babel?sourceMap=true"]},
                        { test: /\.css$/, loader: "style!css"},
                        { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
                        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
                        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
                        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" },
                        { test: /\.(png|jpg)$/, loader: "url?limit=10000" }
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

    grunt.loadNpmTasks("grunt-jscs");
    var styleSrc = ["src/**/*.js", "test/**/*.js", "Gruntfile.js"];
    grunt.config.set("jscs", {
        options: {
            config: ".jscsrc"
        },
        dev: {
            src: styleSrc
        },
        ci: {
            options: {
                reporter: "junit",
                reporterOutput: "target/style.xml"
            },
            src: styleSrc
        }
    });

    grunt.loadNpmTasks("grunt-mocha-test");
    var testSrc = ["test/**/*Test.js"];
    grunt.config.set("mochaTest", {
        options: {
            require: [
                "babel-core/register",
                "./test/testSetup"
            ]
        },
        test: {
            src: testSrc
        },
        ci: {
            options: {
                reporter: "xunit",
                captureFile: "target/tests.xml",
                quiet: true
            },
            src: testSrc
        }
    });

    grunt.registerTask("coverage", "Generate test coverage report.", function () {
        var istanbulOptions = ["cover", "--root", "./src", "--dir", "./target/coverage", "./node_modules/mocha/bin/_mocha"];
        var mochaOptions = ["--require", "babel-core/register", "--require", "./test/testSetup", /*"--require", "./src/app/Application",*/ "--recursive", "./test"];

        var done = this.async();
        grunt.util.spawn({
            cmd: "node",
            args: ["./node_modules/istanbul/lib/cli"].concat(istanbulOptions).concat("--").concat(mochaOptions),
            opts: {
                env: process.env,
                cwd: process.cwd(),
                stdio: "inherit"
            }
        }, function (err) {
            if (err) {
                grunt.fail.warn(err);
                return;
            }
            done();
        });
    });

    grunt.registerTask("dev", ["webpack-dev-server:start"]);
    grunt.registerTask("test", ["jscs:dev", "mochaTest:test"]);
    grunt.registerTask("build", ["webpack:build"]);

    grunt.registerTask("ci", "jscs:ci", "mochaTest:ci", "build");
};