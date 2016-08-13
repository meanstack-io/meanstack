/**
 * Log
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
var winston = require('winston');

/**
 * Log
 *
 * @param App
 * @constructor
 */
var Log = function (App) {
    this._config = App.config.get('log');
    this._settings = {
        transports: [],
        exceptionHandlers: []
    };

    // Config
    this.config();
};

/**
 * Config logger
 */
Log.prototype.config = function () {
    var config = this._config;

    this._settings.transports.push(
        new winston.transports.File(config.system.file)
    );

    if (config.system.console) {
        this._settings.transports.push(
            new winston.transports.Console(config.system.console)
        );
    }

    this._settings.exceptionHandlers.push(
        new winston.transports.File(config.exception.file)
    );

    this._settings.exitOnError = config.exception.exitOnError;
};

/**
 * Creates instance Logger
 *
 * @returns {*}
 * @constructor
 */
Log.prototype.Logger = function () {
    return new winston.Logger(this._settings);
};

module.exports = Log;
