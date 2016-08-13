/**
 * Plugins validator for Mongoose.
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Export plugins validator
 *
 * @type {{email: Email}}
 */
module.exports = {
    email: require('./email')
};
