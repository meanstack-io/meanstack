/**
 * AuthServiceProvider
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
    HelpersAuth = require('./HelpersAuth');

/**
 * AuthServiceProvider
 *
 * @param App
 * @type {Function}
 */
var AuthServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._helpersAuth = new HelpersAuth();
});

/**
 * Register Auth Helper.
 *
 * @param done
 */
AuthServiceProvider.prototype.register = function (done) {

    this._App.app.use(this._helpersAuth.register());

    done();
};

module.exports = AuthServiceProvider;
