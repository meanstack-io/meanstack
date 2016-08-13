/**
 * SessionServiceProvider
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
    Session = require('./Session');

/**
 * SessionServiceProvider
 *
 * @param App
 * @type {Function}
 */
var SessionServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._session = new Session(App);
});

/**
 * Register SessionService.
 *
 * @param done
 */
SessionServiceProvider.prototype.register = function (done) {

    this._App.app.use(this._session.session());

    done();
};

module.exports = SessionServiceProvider;
