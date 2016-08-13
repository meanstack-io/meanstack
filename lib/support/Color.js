/**
 * Color
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
 * Style of color for console.
 *
 * @returns {{}}
 * @constructor
 */
var Color = function () {

    /**
     * Colors
     *
     * @type {{red: string, green: string, yellow: string, blue: string, black: string}}
     */
    this.colors = {
        red: '\x1B[31m',
        green: '\x1B[32m',
        yellow: '\x1B[33m',
        blue: '\x1B[34m',
        black: '\x1B[39m'
    };

    return this.generate();
};

/**
 * Generate method colors.
 *
 * @returns {{}}
 */
Color.prototype.generate = function () {
    var self = this,
        methods = {};

    Object.keys(this.colors).forEach(function (index) {
        return methods[index] = function (str) {
            return util.format('%s%s%s', self.colors[index], str, self.colors.black);
        }
    });

    return methods;
};

module.exports = new Color();
