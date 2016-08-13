/**
 * Validation
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
var Validator = require('./validator');


/**
 * Validation
 *
 * @param Validation
 * @returns {Function}
 */
module.exports = function (Validation) {

    /**
     * Return function for valid in route middleware.
     *
     * @param req
     * @param res
     * @param next
     */
    return function (req, res, next) {

        /**
         * Extends validator for validation.
         */
        Validation.prototype = new Validator(req, res, next);
        Validation.prototype.constructor = Validation;

        var validation = new Validation();

        /**
         * Validator method.
         */
        validation.validator();
    }
};
