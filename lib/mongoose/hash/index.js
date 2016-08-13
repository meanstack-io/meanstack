/**
 * Mongoose plugin for hash encrypt.
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
var bcrypt = require('bcrypt');

/**
 * Hash
 *
 * @param schema
 */
var Hash = function (schema) {

    /**
     * Get parameter
     *
     * Covers
     *  min: [6, 'Password accept min 6 characters !'],
     *  min: 6,
     *
     * @param param
     * @returns {*}
     */
    var getParam = function (param) {
        if (typeof param === 'undefined') {
            return false;
        }
        else if (Array.isArray(param)) {
            return param[0];
        }

        return param;
    };

    /**
     * Create methods to compare the hash fields.
     *
     * Example Schema:
     *   password: {
     *       type: String,
     *       minlength: [6, 'Password accept min 6 characters !'],
     *       hash: 15
     *   }
     *
     * Method created:
     *   model.compareHash(Field, String); // return true of false
     */
    schema.methods.compareHash = function (field, value) {
        return bcrypt.compareSync(value, this[field]);
    };

    /**
     * Generate hash.
     *
     * Middleware mongoose
     *   http://mongoosejs.com/docs/middleware.html
     *
     */
    schema.pre('save', function (next) {
        var document = this,
            paths = schema.paths;

        Object.keys(paths).forEach(function (field) {
            var options = paths[field]['options'],
                min = getParam(options['minlength']),
                max = getParam(options['maxlength']);

            if (typeof options['hash'] !== 'undefined'
                && document.isModified(field)
                && !(max && (document[field]).length > max)
                && !(min && (document[field]).length < min)) {

                document[field] = bcrypt.hashSync(document[field], bcrypt.genSaltSync(options['hash']));
            }
        });

        return next();
    });
};

module.exports = Hash;
