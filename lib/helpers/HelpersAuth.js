/**
 * HelpersAuth
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * HelpersAuth
 *
 * @constructor
 */
var HelpersAuth = function () {};

/**
 * register
 *
 * @returns {Function}
 */
HelpersAuth.prototype.register = function () {

    return function (req, res, next) {

        // if passport not instantiated.
        if (typeof req.isAuthenticated === 'undefined' || req.isUnauthenticated === 'undefined') {
            return next();
        }

        /**
         * Locals user.
         * Returns the User or false.
         *
         * Example:
         *   {{#if user}}
         *     {{ user.username }}
         *   {{/if}}
         *
         * @param req
         * @returns {*}
         */
        res.locals.user = (req.isAuthenticated()) ? req.user : false;

        /**
         * Locals isAuthenticated
         * Return true if the User is logged.
         *
         * @type {Boolean}
         */
        res.locals.isAuthenticated = req.isAuthenticated();

        /**
         * Locals isUnauthenticated
         * Return true if the User not logged.
         *
         * @type {Boolean}
         */
        res.locals.isAuthenticated = req.isUnauthenticated();

        next();
    };
};

module.exports = HelpersAuth;
