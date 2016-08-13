/**
 * Mongoose plugin for valid email.
 *
 * @author: Rafael Pegorari <rafapegorari@gmail.com>
 * @copyright Copyright (c) 2015-2016, MEANStack.io.
 * @license See LICENSE
 * MIT Licensed
 */

'use strict';

/**
 * Email
 *
 * @param {Schema} schema
 */
var Email = function (schema) {
    var paths = schema.paths,
        fields = Object.keys(paths),
        validaEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    fields.forEach(function (field) {
        var options = paths[field]['options'];
        if (typeof options['email'] !== 'undefined' && options['email'] !== false) {

            schema.path(field).validate(
                function (value) {
                    return validaEmail.test(value)
                },
                (options['email'] === true) ? 'Field {PATH} {VALUE} not valid !' : options['email']
            );
        }
    });
};

module.exports = Email;
