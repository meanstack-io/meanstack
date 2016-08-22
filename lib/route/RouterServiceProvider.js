/**
 * RouterServiceProvider
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
    Router = require('./Router'),
    ErrorHandling = require('./ErrorHandling');

/**
 * RouterServiceProvider
 *
 * @type {Function}
 */
var RouterServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._error = new Error(this._App);
    this._errorHandling = new ErrorHandling(this._App);
});

/**
 * Register functions additional for Router express.
 */
RouterServiceProvider.prototype.register = function (done) {

    this._App.Router = this._App.router = new Router(this._App);

    done();
};

/**
 * Boot Routes.
 */
RouterServiceProvider.prototype.boot = function (done) {
    var self = this,
        Routes = require(this._App.config.get('app').routes)(self._App.Router);

    // Register routes
    this._App.app.use(Routes);

    // Register error handling
    this._App.app.use(
        this._errorHandling.use()
    );

    done();
};

module.exports = RouterServiceProvider;
