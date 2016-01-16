// NB var __dirname is where this file presently is
module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'directives/js/lib/angular.js',
      'directives/js/lib/angular-route.js',
      'test/lib/angular-mocks.js',
      'directives/js/**/*.js', // getting lib twice...
      'test/unit/**/*.js',
      // when the index.html file changes, we won't run the tests
      { pattern: 'directives/**/*.html', watched: false }
    ],
    exclude: [],
    port: 8080, // default is 9876
    proxies: {/*'/': 'http://localhost:9000'*/}, // needed in e2e
    logLevel: config.LOG_INFO,
    autowatch: true,
    reporters: ['progress', 'dots'], // also available 'dots'
    preprocessors: {},
    browsers: ['Chrome'],
    captureTimeout: 5000, // browser capture
    singleRun: false,
    //hostname: '127.0.0.1', // whatever
  });
}