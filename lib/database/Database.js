/**
 * Database, MongoDB With Mongoose.
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
var util = require('util'),
    debug = require('debug')('meanstack:database');

/**
 * Database
 *
 * @param App
 * @constructor
 */
var Database = function (App) {
    this._config = App.config.get('database');
    this.mongoose = require('mongoose');

    /**
     * Use bluebird Promise
     *    http://mongoosejs.com/docs/promises.html
     */
    this.mongoose.Promise = require('bluebird');
};

/**
 * urlConnect
 *
 * @returns {String} URL connection mongodb
 */
Database.prototype.urlConnect = function () {
    return util.format(
        "mongodb://%s:%s@%s:%s/%s",
        this._config.user,
        this._config.password,
        this._config.host,
        this._config.port,
        this._config.base
    );
};

/**
 * Connect MongoDB with mongoose
 *   Documentation mongoose: http://mongoosejs.com/docs/connections.html
 *
 * @returns {Promise}
 */
Database.prototype.connect = function () {
    var urlConnect = this.urlConnect();

    return this.mongoose.connect(urlConnect)
        .then(function () {
            debug("Connection established MongoDB. URL: ", urlConnect);
        })
        .catch(function (err) {
            throw new Error(
                util.format("\nError during the connection MongoDB URL: %s.\nIf you do not need database in your application remove the provider \"DatabaseServiceProvider\" of \"config/app\". \n%s", urlConnect, err)
            );
        });
};

module.exports = Database;
