'use strict';

module.exports = function (config) {
    config.set({
        logLevel: config.LOG_INFO,
        frameworks: [ 'mocha', 'chai-as-promised', 'chai', 'sinon' ],
        browsers: [ 'PhantomJS' ],
        reporters: [ 'dots' ],
        preprocessors: {
            'src/**/*.spec.js': [ 'babel' ]
        },
        files: [
            require.resolve('sinon-chai/lib/sinon-chai.js'),
            require.resolve('phantomjs-polyfill'),
            require.resolve('babel-polyfill/dist/polyfill.js'),
            require.resolve('angular/angular.js'),
            require.resolve('angular-mocks/angular-mocks.js'),
            'dist/geheugen-angular.js',
            'src/**/*.spec.js'
        ]
    })
};