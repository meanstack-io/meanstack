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
    Router = require('./Router');

/**
 * RouterServiceProvider
 *
 * @type {Function}
 */
var RouterServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._routes = App.config.get('app').routes;
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

    new (require(this._routes))(this._App);

    done();
};

module.exports = RouterServiceProvider;
