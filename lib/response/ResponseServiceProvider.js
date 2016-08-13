/**
 * ResponseServiceProvider
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
var ServiceProvider = require('../support/ServiceProvider');
var Response = require('./Response');

/**
 * ResponseServiceProvider
 *
 * @param App
 * @type {Function}
 */
var ResponseServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
});

/**
 * Register ResponseServiceProvider.
 *
 * @param done
 */
ResponseServiceProvider.prototype.register = function (done) {

    /**
     * Export module Response for "req.response".
     *
     */
    this._App.app.use(function (req, res, next) {
        if (req.response) {
            return next();
        }

        req.response = new Response();

        next();
    });

    done();
};

module.exports = ResponseServiceProvider;
