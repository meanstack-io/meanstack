/**
 * DatabaseServiceProvider
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
    Database = require('./Database');

/**
 * DatabaseServiceProvider
 *
 * @param App
 * @type {Function}
 */
var DatabaseServiceProvider = ServiceProvider.extend(function (App) {
    this._App = App;
    this._database = new Database(App);
});

/**
 * Register Database.
 *
 * @param done
 */
DatabaseServiceProvider.prototype.register = function (done) {

    this._database.connect();

    this._App.database = this._database.mongoose;

    done();
};

module.exports = DatabaseServiceProvider;
