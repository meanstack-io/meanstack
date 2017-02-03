/**
 * Validator
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
 * Validator
 *
 * @param req
 * @param res
 * @param next
 */
var validator = function (req, res, next) {

    /**
     * Parameters
     */
    var data = req.body;

    /**
     * Http status code on error.
     *
     * @type {number}
     */
    this.code = 400;

    /**
     * Authorized access. [Optional]
     *   Default true.
     *
     *   Example functionality:
     *       this.authorized = function (req) {
     *           return req.isAuthenticated();
     *       };
     *
     * @param req
     * @returns {boolean}
     */
    this.authorized = function (req) {
        return true;
    };

    /**
     * Rules. [Required]
     *
     *   Example:
     *       this.rules = {
     *           version: 'required|min:3|max:10',
     *           description: 'required|min:10',
     *           publish: 'required|boolean'
     *       };
     */
    this.rules = {};

    /**
     * Labels of attributes. [Optional]
     *   Default name field.
     *
     *   Example:
     *       this.labels = {
     *           version: 'Version',
     *           description: 'Description',
     *           publish: 'Publish'
     *       };
     */
    this.labels = {};

    /**
     * Messages. [Optional]
     *   Example message of substitution.
     *      this.message.required = 'Please :attribute required';
     *      this.message.max: 'Please :attribute accept max :param characters !';
     */
    this.message = {
        required: 'Field :attribute is required !',
        min: 'Field :attribute required min :param characters !',
        max: 'Field :attribute accept max :param characters !',
        equal: 'Field :attribute not is equal :param !',
        boolean: 'Field :attribute invalid ! Need to be boolean.',
        object: 'Field :attribute invalid ! Need to be object.',
        email: 'Field :attribute :value invalid !',
        notAuthorized: 'It is not allowed to do this operation.'
    };

    /**
     * Custom message for field.
     *   Example:
     *       this.fieldMessage.email = 'Email invalid !';
     *
     * @type {{}}
     */
    this.fieldMessage = {};

    /**
     * Get error message.
     *
     * @param error
     * @param field
     * @returns {*}
     */
    this.getErrorMessage = function (error, field) {
        if (this.fieldMessage[field] && this.fieldMessage[field][error]) {
            return this.fieldMessage[field][error]
        }
        return this.message[error];
    };

    /**
     * Make and set message error.
     *
     * @param error
     * @param field
     * @param value
     * @param param
     * @returns {*}
     */
    this.setErrorMessage = function (error, field, value, param) {

        var message = this.getErrorMessage(error, field);

        if (typeof message === 'undefined') {

            return this.setError(
                util.format('Error ! Type error: %s.', error)
            )
        }

        if (typeof field !== 'undefined') {
            var label = (typeof this.labels[field] !== 'undefined') ? this.labels[field] : field;

            var message_label = message.replace(/:attribute/g, '%s');

            if (message_label !== message) {
                message = util.format(
                    message_label,
                    label
                );
            }
        }

        if (typeof value !== 'undefined') {
            var message_value = message.replace(/:value/g, '%s');

            if (message_value !== message) {
                message = util.format(
                    message_value,
                    value
                );
            }
        }

        if (typeof param !== 'undefined') {
            var message_param = message.replace(/:param/g, '%s');

            if (message_param !== message) {
                message = util.format(
                    message_param,
                    param
                );
            }
        }

        return req.response.setMsg(message);
    };

    /**
     * Validator method.
     *   Main method for valid.
     *
     * @returns {*}
     */
    this.validator = function () {
        var self = this,
            rules = this.rules;

        if (!this.authorized(req)) {
            return this.setErrorMessage('notAuthorized');
        }

        for (var k in rules) {
            rules[k].split('|').forEach(function (rule_line) {
                // rule[0] => rule, rule[1] => param
                var rule = rule_line.split(':');

                if (typeof self[rule[0]] === 'function') {
                    self[rule[0]](k, rule[1]);
                }
            });
        }

        if (req.response.hasMsg()) {
            return res.status(this.code).json(req.response.return());
        }

        return next();
    };

    /**
     * Rule 'required'.
     *
     * @param field
     * @returns {*}
     */
    this.required = function (field) {
        if (typeof data[field] === 'undefined' || data[field].length === 0) {
            return this.setErrorMessage('required', field);
        }
    };

    /**
     * Rule 'min'.
     *
     * @param field
     * @param param
     * @returns {*}
     */
    this.min = function (field, param) {
        if (typeof data[field] === 'string' && data[field].length !== 0 && data[field].length < param) {
            return this.setErrorMessage('min', field, data[field], param);
        }
    };

    /**
     * Rule 'max'.
     *
     * @param field
     * @param param
     * @returns {*}
     */
    this.max = function (field, param) {
        if (typeof data[field] === 'string' && data[field].length !== 0 && data[field].length > param) {
            return this.setErrorMessage('max', field, data[field], param);
        }
    };

    /**
     * Rule 'equal'.
     *
     * @param field
     * @param param
     * @returns {*}
     */
    this.equal = function (field, param) {
        if (data[field] !== data[param]) {
            return this.setErrorMessage('equal', field, data[field], param);
        }
    };

    /**
     * Rule 'boolean'.
     *
     * @param field
     * @returns {*}
     */
    this.boolean = function (field) {
        var testBoolean = [
            null,
            '',
            'true',
            true,
            'false',
            false
        ];

        if (typeof data[field] !== 'undefined' && testBoolean.indexOf(data[field]) == -1) {
            return this.setErrorMessage('boolean', field, data[field]);
        }
    };

    /**
     * Rule 'object'.
     *
     * @param field
     * @returns {*}
     */
    this.object = function (field) {
        if (typeof data[field] !== 'undefined' && typeof data[field] !== 'object') {
            return this.setErrorMessage('object', field, data[field]);
        }
    };

    /**
     * Rule 'email'.
     *
     * @param field
     * @returns {*}
     */
    this.email = function (field) {
        var validaEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (typeof data[field] !== 'undefined' && !validaEmail.test(data[field])) {
            return this.setErrorMessage('email', field, data[field]);
        }
    };
};

module.exports = validator;
