/**
 * LogServiceProvider
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
    Log = require('./Log');

/**
 * LogServiceProvider
 *
 * @param App
 * @type {Function}
 */
var LogServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._log = new Log(App);
});

/**
 * Register the Log service.
 *
 * @param done
 */
LogServiceProvider.prototype.register = function (done) {

    this._App.log = this._log.Logger();

    done();
};

module.exports = LogServiceProvider;
