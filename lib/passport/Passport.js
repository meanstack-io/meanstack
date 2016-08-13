/**
 * Passport
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
var passport = require('passport');

/**
 * Passport
 *
 * @param App
 * @constructor
 */
var Passport = function (App) {
    this._config = App.config.get('auth');
    this.passport = passport;
};

/**
 * initialize
 *   Initialize passport for middleware.
 *
 * @return {Function} passport.initialize
 */
Passport.prototype.initialize = function () {
    return passport.initialize(this._config.initialize || {});
};

/**
 * session
 *   Configure session for middleware.
 *
 * @return {Function} passport.session
 */
Passport.prototype.session = function () {
    return passport.session(this._config.session || {});
};

/**
 * Serialize id user for session.
 */
Passport.prototype.serializeUser = function () {
    this.passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
};

/**
 * Find user by deserialize id.
 */
Passport.prototype.deserializeUser = function () {
    var model = require(this._config.model);

    passport.deserializeUser(function (id, done) {
        model.findById(id, function (err, user) {
            done(err, user);
        });
    });
};

/**
 * Load strategies.
 *
 * @param strategies
 */
Passport.prototype.loadStrategies = function (strategies) {
    var self = this;

    strategies.forEach(function (strategyPath) {
        self.useStrategies(require(strategyPath));
    });
};

/**
 * useStrategies
 *   Use strategy for passport.
 *
 * @param strategy
 */
Passport.prototype.useStrategies = function (strategy) {
    var self = this;

    if (Array.isArray(strategy)) {
        strategy.forEach(function (strategies) {
            self.useStrategies(strategies);
        });

        return;
    }

    return passport.use(strategy.authentication, strategy.strategy);
};

/**
 * Register strategies for passport.
 */
Passport.prototype.registerStrategies = function () {
    this.loadStrategies(this._config.strategies);
};

module.exports = Passport;
