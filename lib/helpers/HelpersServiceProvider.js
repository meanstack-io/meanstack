/**
 * HelpersServiceProvider
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
    hbs = require('express-hbs'),
    Helpers = require('./Helpers');

/**
 * HelpersServiceProvider
 *
 * @param App
 * @type {Function}
 */
var HelpersServiceProvider = ServiceProvider.extend(function (App) {
    this._helpers = new Helpers(App);
});

/**
 * Register helpers.
 *
 * @param done
 */
HelpersServiceProvider.prototype.register = function (done) {

    hbs.registerHelper(
        this._helpers.register()
    );

    done();
};

module.exports = HelpersServiceProvider;
