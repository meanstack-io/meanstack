/**
 * LogAccessServiceProvider
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
    LogAccess = require('./LogAccess');

/**
 * LogAccessServiceProvider
 *
 * @param App
 * @type {Function}
 */
var LogAccessServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._logAccess = new LogAccess(App);
});

/**
 * Register the Log access.
 *
 * @param done
 */
LogAccessServiceProvider.prototype.register = function (done) {

    this._App.app.use(this._logAccess.file());

    var console = this._logAccess.console();
    if (console) {
        this._App.app.use(console);
    }

    done();
};

module.exports = LogAccessServiceProvider;
