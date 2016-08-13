/**
 * Server
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
var util = require('util');

/**
 * Normalize port.
 *
 * @param val
 * @returns {*}
 */
var normalizePort = module.exports.normalizePort = function (val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * Return string pipe or port.
 *
 * @param pipePort
 * @returns {string}
 */
var pipePort = module.exports.pipePort = function (pipePort) {
    return typeof pipePort === 'string'
        ? 'Pipe ' + pipePort
        : 'Port ' + pipePort;
};

/**
 * Return string listening server.
 *
 * @param port
 * @returns {string}
 */
var listening = module.exports.listening = function (port) {
    return util.format('MEANStack.io server listening on %s', pipePort(port))
};
