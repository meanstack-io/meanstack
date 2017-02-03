/**
 * Auth helpers
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
var uuid = require('uuid'),
    crypto = require('crypto');

/**
 * Check permissions user.
 *  permission => show.users || save.user ...
 *  user permissions => ['show.users', 'save.user']
 *
 * @param user
 * @param permission
 * @param callback
 * @returns {*}
 */
var permission = module.exports.permission = function (user, permission, callback) {

    var authorization = (user.permissions.indexOf(permission) !== -1);

    if (typeof callback === 'undefined') {
        return authorization;
    }

    return callback(authorization);
};

/**
 * Authenticate action.
 *
 * @param action
 * @returns {Function}
 */
module.exports.action = function (action) {
    return function (req, res, next) {
        if(req.isUnauthenticated()) {
            return res.sendStatus(403);
        }

        permission(req.user, action, function(auth){
            if(auth) {
                return next();
            } else {
                return res.sendStatus(403);
            }
        });
    }
};

/**
 * Check user authenticated.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isAuthenticated = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    return res.sendStatus(403);
};

/**
 * Check user unauthenticated.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isUnauthenticated = function (req, res, next) {
    if(req.isUnauthenticated()) {
        return next();
    }

    return res.sendStatus(403);
};

/**
 * Login.
 *
 * @param req
 * @param res
 * @param user
 * @param message
 * @param next
 * @param err
 * @returns {*}
 */
module.exports.login = function (req, res, user, message, next, err) {
    if (err) {
        // Return error 500.
        return next(err);
    }
    else if (!user) {
        // Return 401 with message.
        return res.status(401).json(req.response.return(message));
    }

    req.logIn(user, function (err) {
        if (err) {
            // Return error 500.
            return next(err);
        }

        return req.setCookieLogin(true).then(function () {
            req.response.setData({
                username: user.username
            });

            // Success
            req.response.setSuccess();
            return res.json(req.response.return());
        });
    });
};

/**
 * Generate token.
 *
 * @param secret
 * @param algorithm
 * @returns {*}
 */
module.exports.token = function (secret, algorithm) {
    algorithm = algorithm || 'sha256';
    secret = secret || new Date().getTime();

    var hash = crypto.createHash(algorithm),
        tokenHash = hash.update(uuid.v4() + secret);

    return tokenHash.digest('hex');
};
