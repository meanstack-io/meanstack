/**
 * LogAccess
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
var morgan = require('morgan'),
    fileStreamRotator = require('file-stream-rotator'),
    path = require('path');

/**
 * LogAccess
 *
 * @param App
 * @constructor
 */
var LogAccess = function (App) {
    this._config = App.config.get('log');
};

/**
 * Creates instance stream
 *
 * @return {Function} fileStreamRotator
 */
LogAccess.prototype.stream = function () {
    var stream = this._config.access.file.stream;

    return fileStreamRotator.getStream({
        date_format: stream.date_format,
        filename: path.join(stream.path, stream.name),
        frequency: stream.frequency,
        verbose: false
    });
};

/**
 * File access morgan.
 *
 * @returns {Function} morgan
 */
LogAccess.prototype.file = function () {
    var self = this,
        format = this._config.access.file.format;

    return morgan(format,
        {
            "stream": self.stream()
        }
    );
};

/**
 * Console access morgan.
 *
 * @returns {Boolean|Function} morgan
 */
LogAccess.prototype.console = function () {
    var console = this._config.access.console;

    if (console) {
        return morgan(console.format);
    }

    return false;
};

module.exports = LogAccess;
