/**
 * Cookie authentication.
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
var Promise = require('bluebird');

/**
 * Cookie
 *
 * @param App
 * @constructor
 */
var Cookie = function (App) {
    this._config = App.config.get('auth');
};

/**
 * Add setCookieLogin in middleware.
 *
 * @returns {Function}
 */
Cookie.prototype.addSetCookieLoginInMiddleware = function () {
    var self = this;

    return function (req, res, next) {
        if (!req.setCookieLogin) {
            req.setCookieLogin = function (val) {
                return new Promise(function (resolve) {
                    var options = {
                        httpOnly: false
                    };

                    if (val === false) {
                        res.clearCookie(
                            self._config.cookie,
                            options
                        );

                        return resolve(true);
                    }

                    res.cookie(
                        self._config.cookie,
                        val,
                        options
                    );

                    return resolve(true);
                });
            };
        }

        return next();
    };
};

/**
 * Check user authenticated
 *
 * @returns {Function}
 */
Cookie.prototype.checkAuthenticated = function () {
    return function (req, res, next) {
        if (!req.isAuthenticated()) {
            return req.setCookieLogin(false).then(function () {
                return next();
            });
        } else {
            return next();
        }
    }
};

module.exports = Cookie;
