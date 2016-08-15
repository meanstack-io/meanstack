/**
 * mergeObject
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Merge object recursive.
 *
 * @param obj
 * @param custom
 * @returns {*}
 */
module.exports = function mergeObjectRecursive(obj, custom) {
    Object.keys(custom).forEach(function (index) {
        if (custom[index] && typeof custom[index] === 'object' && custom[index].constructor === Object) {
            if (typeof obj[index] === 'undefined') {
                obj[index] = {};
            }

            return obj[index] = mergeObjectRecursive(obj[index], custom[index]);
        }

        return obj[index] = custom[index];
    });

    return obj;
};
