/**
 * MailServiceProvider
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
var Mail = require('./Mail');

/**
 * MailServiceProvider
 *
 * @param App
 * @type {Function}
 */
var MailServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._mail = new Mail(App);
});

/**
 * Register the mail service.
 *
 * @param done
 */
MailServiceProvider.prototype.register = function (done) {

    this._App.mail = this._mail;

    done();
};

module.exports = MailServiceProvider;
