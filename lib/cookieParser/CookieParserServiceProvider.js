/**
 * CookieParserServiceProvider
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
    cookieParser = require('cookie-parser');

/**
 * CookieParserServiceProvider
 *
 * @param App
 * @type {Function}
 */
var CookieParserServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
});

/**
 * Register the Cookie Parser service.
 *
 * @param done
 */
CookieParserServiceProvider.prototype.register = function (done) {

    var config = this._App.config.get('cookieParser');

    this._App.app.use(cookieParser(config.secret || null, config.options || null));

    done();
};

module.exports = CookieParserServiceProvider;
