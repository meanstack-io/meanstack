/**
 * CookieServiceProvider
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
    AuthCookie = require('./Cookie');

/**
 * CookieServiceProvider
 *
 * @param App
 * @type {Function}
 */
var CookieServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._AuthCookie = new AuthCookie(App);
});

/**
 * Register cookie auth.
 *
 * @param done
 */
CookieServiceProvider.prototype.register = function (done) {

    this._App.app.use(this._AuthCookie.addSetCookieLoginInMiddleware());

    done();
};

/**
 * Boot cookie auth.
 *
 * @param done
 */
CookieServiceProvider.prototype.boot = function (done) {

    this._App.app.use(this._AuthCookie.checkAuthenticated());

    done();
};

module.exports = CookieServiceProvider;
