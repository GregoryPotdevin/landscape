// Karma configuration
// Generated on Thu Apr 28 2016 12:04:26 GMT+0200 (CEST)
var path = require('path')

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      path.join(__dirname, 'node_modules', 'phantomjs-polyfill', 'bind-polyfill.js'),
      './src/**/*.unit.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './src/**/*.js': ['webpack', 'sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'jasmine-diff'],


    // web server port
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    

    webpack: {
          // karma watches the test entry points
          // (you don't need to specify the entry option)
          // webpack watches dependencies

          // webpack configuration
      devtool:"inline-source-map",
      output: {
        path: path.join(__dirname, 'dist')
      },
      resolve: {
        extensions:['', '.js', '.jsx'],
      },
      module: {
        loaders: [
          {
            test: /\.(jsx|js)?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
              presets: [
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-react'),
                require.resolve('babel-preset-stage-0')
              ]
            }
          }
        ]
      }
    },

    webpackMiddleware: {
        // webpack-dev-middleware configuration
        // i. e.
        noInfo: true
    }
  })
}
