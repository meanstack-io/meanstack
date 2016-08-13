/**
 * PassportServiceProvider
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
    Passport = require('./Passport');

/**
 * PassportServiceProvider
 *
 * @param App
 * @type {Function}
 */
var PassportServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._passport = new Passport(App);
});

/**
 * Register Passport service Auth.
 *
 * @param done
 */
PassportServiceProvider.prototype.register = function (done) {

    // Initialize passport
    this._App.app.use(this._passport.initialize());
    this._App.app.use(this._passport.session());
    this._passport.serializeUser();
    this._passport.deserializeUser();
    this._passport.registerStrategies();

    this._App.passport = this._passport.passport;

    return done();
};

module.exports = PassportServiceProvider;
