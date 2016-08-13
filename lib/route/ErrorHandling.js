/**
 * ErrorHandling
 *   Documentation Express: https://expressjs.com/en/guide/error-handling.html
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
 * ErrorHandling
 *
 * @param App
 * @constructor
 */
var ErrorHandling = function (App) {
    this._App = App;

    this.messageProduction = {
        title: 'D\'oh! Something failed!',
        message: 'Do not worry, our programmers have been warned.'
    };
};

/**
 * Return error-handling middleware function.
 *
 * @returns {Function}
 */
ErrorHandling.prototype.use = function () {
    var messageProduction = this.messageProduction,
        env = this._App.app.get('env'),
        // Logger error.
        loggerError = this._App.log.error;

    return function (err, req, res, next) {

        // Write error log.
        loggerError(err);

        res.status(err.status || 500);

        if (env === 'production') {
            return res.json(req.response.return(util.format('%s %s', messageProduction.title, messageProduction.message)));
        }

        return res.json(req.response.return(err.toString()));
    };
};

module.exports = ErrorHandling;
