/**
 * Session
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
var expressSession = require('express-session');

/**
 * Session
 *
 * @param App
 * @constructor
 */
var Session = function (App) {
    this._config = App.config.get('session');
};

/**
 * Load driver for store session.
 * Example "connect-redis".
 * Documentation: https://github.com/tj/connect-redis#setup
 *
 * @returns {*}
 */
Session.prototype.settings = function () {
    if (typeof this._config.driverStore !== 'undefined') {
        var options = this._config.store || '',
            driverStore = require(this._config.driverStore)(expressSession);

        this._config.store = new driverStore(options);
    }

    return this._config;
};

/**
 * Generate express session.
 *
 * @returns {Function} express-session
 */
Session.prototype.session = function () {
    return expressSession(this.settings());
};

module.exports = Session;
