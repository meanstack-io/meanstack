/**
 * ErrorHandlingServiceProvider
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */
var ServiceProvider = require('../support/ServiceProvider'),
    util = require('util'),
    ErrorHandling = require('./ErrorHandling');

/**
 * ErrorHandlingServiceProvider
 *
 * @param App
 * @type {Function}
 */
var ErrorHandlingServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._errorHandling = new ErrorHandling(App);
});

/**
 * Boot Error Handling.
 *
 * @param done
 */
ErrorHandlingServiceProvider.prototype.boot = function (done) {

    this._App.app.use(this._errorHandling.use());

    done();
};

module.exports = ErrorHandlingServiceProvider;
